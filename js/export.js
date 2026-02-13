// ========================================
// Export Module - CSV, JSON save/load, VSDX
// ========================================

const ExportManager = {

    exportResults() {
        if (AppState.routes.length === 0) {
            alert('Adicione rotas antes de exportar');
            return;
        }

        const margin = parseFloat(document.getElementById('marginInput').value) / 100;

        let csv = 'RESULTADOS POR ROTA\n';
        csv += 'Tipo de Cabo,PN,Origem,Destino,Caminho Completo,Distância Base (mm),Quantidade Vias,Total com Margem (m)\n';

        AppState.routes.forEach(route => {
            const cable = Database.getCable(route.cableType);
            const pn = cable ? cable.PN : '';
            const path = route.points.join(' > ');
            const origin = route.points[0];
            const destination = route.points[route.points.length - 1];
            const lengthWithMargin = route.totalDistance * (1 + margin);
            const totalLength = lengthWithMargin * route.quantity;
            csv += `${route.cableType},${pn},${origin},${destination},"${path}",${route.totalDistance},${route.quantity},${(totalLength / 1000).toFixed(2)}\n`;
        });

        csv += '\n\nRESUMO POR TIPO DE CABO\n';
        csv += 'Tipo de Cabo,PN,Comprimento Total (m)\n';

        const totals = {};
        AppState.routes.forEach(route => {
            const lengthWithMargin = route.totalDistance * (1 + margin);
            const totalLength = lengthWithMargin * route.quantity;

            if (!totals[route.cableType]) {
                totals[route.cableType] = 0;
            }
            totals[route.cableType] += totalLength;
        });

        for (const [cableType, length] of Object.entries(totals)) {
            const cable = Database.getCable(cableType);
            const pn = cable ? cable.PN : '';
            csv += `${cableType},${pn},${(length / 1000).toFixed(2)}\n`;
        }

        csv += '\n\nWIRE BUNDLE POR RAMIFICAÇÃO\n';
        csv += 'Segmento,Tipo de Cabo,Quantidade de Vias,Diâmetro Bundle (mm),Braid Tube PN,Tube Shrink PN,Marker Sleeve PN,Clear Tube Shrink PN\n';

        const segmentBundles = BundleUI.getSegmentBundles();

        for (const [segment, wires] of Object.entries(segmentBundles)) {
            const bundleData = calculateWireBundle(wires);
            const suggestions = ComponentSuggestions.getSuggestionsForSegment(bundleData.diameter);

            const wireGroups = {};
            wires.forEach(wire => {
                if (!wireGroups[wire.name]) {
                    wireGroups[wire.name] = 0;
                }
                wireGroups[wire.name]++;
            });

            for (const [name, count] of Object.entries(wireGroups)) {
                csv += `${segment},${name},${count},${bundleData.diameter.toFixed(2)}`;
                csv += `,${suggestions.braidTube ? suggestions.braidTube.PN : ''}`;
                csv += `,${suggestions.tubeShrink ? suggestions.tubeShrink.PN : ''}`;
                csv += `,${suggestions.markerSleeve ? suggestions.markerSleeve.PN : ''}`;
                csv += `,${suggestions.clearTubeShrink ? suggestions.clearTubeShrink.PN : ''}`;
                csv += '\n';
            }
        }

        // End Node connectors section
        csv += '\n\nCONECTORES POR END NODE\n';
        csv += 'Node,Connector MPN,Connector PN,Backshell Angle,Backshell PN,Boot Shrink Type,Boot Shrink PN\n';

        const endNodes = AppState.nodes.filter(n => n.nodeType === 'end');
        endNodes.forEach(node => {
            const config = AppState.endNodeConfigs[node.name];
            if (!config) return;

            const mpn = ConnectorUI.buildMPN(config);
            const matched = ConnectorUI.findMatchingConnector(mpn);
            const backshell = ConnectorUI.getBackshellSuggestion(node.name);
            const bootShrink = ConnectorUI.getBootShrinkSuggestion(node.name);

            csv += `${node.name}`;
            csv += `,${mpn || ''}`;
            csv += `,${matched ? matched.PN : ''}`;
            csv += `,${config.backshellAngle || ''}`;
            csv += `,${backshell ? backshell.PN : ''}`;
            csv += `,${config.bootShrinkType || ''}`;
            csv += `,${bootShrink ? bootShrink.PN : ''}`;
            csv += '\n';
        });

        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'wire_bundle_completo.csv';
        link.click();
        URL.revokeObjectURL(link.href);
    },

    saveProject() {
        if (AppState.nodes.length === 0) {
            alert('Desenhe o diagrama antes de salvar o projeto!');
            return;
        }

        const project = {
            version: '2.0',
            timestamp: new Date().toISOString(),
            nodes: AppState.nodes,
            connections: AppState.connections,
            routes: AppState.routes,
            endNodeConfigs: AppState.endNodeConfigs,
            nodeIdCounter: AppState.nodeIdCounter,
            routeIdCounter: AppState.routeIdCounter
        };

        const json = JSON.stringify(project, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `cable_project_${Date.now()}.json`;
        link.click();
        URL.revokeObjectURL(link.href);

        alert('Projeto salvo com sucesso!');
    },

    loadProject(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function (e) {
            try {
                const project = JSON.parse(e.target.result);

                if (!project.nodes || !Array.isArray(project.nodes) ||
                    !project.connections || !Array.isArray(project.connections)) {
                    alert('Arquivo de projeto inválido!');
                    return;
                }

                // Migrate v1 projects: add nodeType if missing
                project.nodes.forEach(node => {
                    if (!node.nodeType) {
                        // Guess: names starting with J or P are end nodes, TB are transition
                        if (/^(J|P)\d*/i.test(node.name)) {
                            node.nodeType = 'end';
                        } else {
                            node.nodeType = 'transition';
                        }
                    }
                });

                AppState.nodes = project.nodes;
                AppState.connections = project.connections;
                AppState.routes = project.routes || [];
                AppState.endNodeConfigs = project.endNodeConfigs || {};
                AppState.nodeIdCounter = project.nodeIdCounter || 0;
                AppState.routeIdCounter = project.routeIdCounter || 0;

                // Ensure end node configs exist and migrate old format
                AppState.nodes.filter(n => n.nodeType === 'end').forEach(n => {
                    const cfg = AppState.endNodeConfigs[n.name];
                    if (!cfg) {
                        AppState.endNodeConfigs[n.name] = {
                            series: null, coating: null, shellSize: null, insertArr: null,
                            contactType: null, polarity: null,
                            backshellAngle: 'straight', bootShrinkType: 'straight'
                        };
                    } else if ('connector' in cfg && !('series' in cfg)) {
                        // Migrate old format to new D38999 MPN format
                        cfg.series = null;
                        cfg.coating = null;
                        cfg.shellSize = null;
                        cfg.insertArr = null;
                        cfg.contactType = null;
                        cfg.polarity = null;
                        delete cfg.connector;
                    }
                });

                App.updateNodeSelects();
                CanvasEditor.redraw();
                App.updateRoutesList();
                App.updateResults();
                BundleUI.update();
                ConnectorUI.render();
                BomUI.update();

                alert('Projeto carregado com sucesso!');
            } catch (error) {
                alert('Erro ao carregar projeto: ' + error.message);
            }
        };
        reader.readAsText(file);

        event.target.value = '';
    },

    async exportToVisio() {
        if (AppState.nodes.length === 0) {
            alert('Desenhe o diagrama no canvas antes de exportar!');
            return;
        }

        if (typeof JSZip === 'undefined') {
            alert('JSZip não carregado. Verifique a conexão com a internet.');
            return;
        }

        const exportData = {
            nodes: AppState.nodes.map(n => ({
                name: n.name,
                x: n.x,
                y: n.y,
                nodeType: n.nodeType
            })),
            connections: AppState.connections.map(c => ({
                from: c.from,
                to: c.to,
                distance: c.distance
            }))
        };

        const zip = new JSZip();

        zip.file('[Content_Types].xml', this._vsdxContentTypes());

        const relsFolder = zip.folder('_rels');
        relsFolder.file('.rels', this._vsdxRootRels());

        const visioFolder = zip.folder('visio');
        visioFolder.file('document.xml', this._vsdxDocument());

        const visioRelsFolder = visioFolder.folder('_rels');
        visioRelsFolder.file('document.xml.rels', this._vsdxDocumentRels());

        const pagesFolder = visioFolder.folder('pages');
        pagesFolder.file('pages.xml', this._vsdxPages());
        pagesFolder.file('page1.xml', this._vsdxPage1(exportData));

        const pagesRelsFolder = pagesFolder.folder('_rels');
        pagesRelsFolder.file('pages.xml.rels', this._vsdxPagesRels());
        pagesRelsFolder.file('page1.xml.rels', this._vsdxPage1Rels());

        const blob = await zip.generateAsync({
            type: 'blob',
            compression: 'DEFLATE',
            compressionOptions: { level: 6 }
        });

        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'cable_diagram.vsdx';
        link.click();
        URL.revokeObjectURL(link.href);
    },

    // --- VSDX helper methods ---
    _vsdxContentTypes() {
        return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
    <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
    <Default Extension="xml" ContentType="application/xml"/>
    <Override PartName="/visio/document.xml" ContentType="application/vnd.ms-visio.drawing.main+xml"/>
    <Override PartName="/visio/pages/pages.xml" ContentType="application/vnd.ms-visio.pages+xml"/>
    <Override PartName="/visio/pages/page1.xml" ContentType="application/vnd.ms-visio.page+xml"/>
</Types>`;
    },

    _vsdxRootRels() {
        return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
    <Relationship Id="rId1" Type="http://schemas.microsoft.com/visio/2010/relationships/document" Target="visio/document.xml"/>
</Relationships>`;
    },

    _vsdxDocument() {
        return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<VisioDocument xmlns="http://schemas.microsoft.com/office/visio/2012/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xml:space="preserve">
    <DocumentSettings DefaultTabStop="0.5" DefaultTextStyle="3" DefaultLineStyle="3" DefaultFillStyle="3"/>
    <Colors>
        <ColorEntry IX="0" RGB="#000000"/>
        <ColorEntry IX="1" RGB="#FFFFFF"/>
        <ColorEntry IX="2" RGB="#e74c3c"/>
        <ColorEntry IX="3" RGB="#3498db"/>
        <ColorEntry IX="4" RGB="#667eea"/>
    </Colors>
    <FaceNames>
        <FaceName ID="0" Name="Segoe UI" UnicodeRanges="0 1 2 3 4 5" CharSets="0 0 0 0 0 0" Panos="2 11 5 2 4 2 4 2 2 3" Flags="325"/>
    </FaceNames>
</VisioDocument>`;
    },

    _vsdxDocumentRels() {
        return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
    <Relationship Id="rId1" Type="http://schemas.microsoft.com/visio/2010/relationships/pages" Target="pages/pages.xml"/>
</Relationships>`;
    },

    _vsdxPagesRels() {
        return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
    <Relationship Id="rId1" Type="http://schemas.microsoft.com/visio/2010/relationships/page" Target="page1.xml"/>
</Relationships>`;
    },

    _vsdxPages() {
        return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Pages xmlns="http://schemas.microsoft.com/office/visio/2012/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xml:space="preserve">
    <Page ID="0" NameU="Page-1" Name="Cable Diagram" ViewScale="1" ViewCenterX="5.5" ViewCenterY="4.25">
        <PageSheet LineStyle="0" FillStyle="0" TextStyle="0">
            <Cell N="PageWidth" V="11" U="IN"/>
            <Cell N="PageHeight" V="8.5" U="IN"/>
            <Cell N="ShdwOffsetX" V="0.125" U="IN"/>
            <Cell N="ShdwOffsetY" V="-0.125" U="IN"/>
            <Cell N="PageScale" V="1" U="IN_F"/>
            <Cell N="DrawingScale" V="1" U="IN_F"/>
        </PageSheet>
        <Rel r:id="rId1"/>
    </Page>
</Pages>`;
    },

    _vsdxPage1Rels() {
        return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
</Relationships>`;
    },

    _vsdxPage1(data) {
        const scale = 0.015;
        let shapesXML = '';
        let shapeId = 1;

        data.nodes.forEach(node => {
            const x = node.x * scale + 2;
            const y = 8.5 - (node.y * scale + 2);
            const fillColor = node.nodeType === 'end' ? '2' : '3'; // Red or Blue

            shapesXML += `
        <Shape ID="${shapeId}" Type="Shape" LineStyle="3" FillStyle="3" TextStyle="3">
            <Cell N="PinX" V="${x}" U="IN"/>
            <Cell N="PinY" V="${y}" U="IN"/>
            <Cell N="Width" V="0.5" U="IN"/>
            <Cell N="Height" V="0.5" U="IN"/>
            <Cell N="LocPinX" V="0.25" U="IN"/>
            <Cell N="LocPinY" V="0.25" U="IN"/>
            <Text>${this._escapeXml(node.name)}</Text>
            <Section N="Geometry" IX="0">
                <Cell N="NoFill" V="0"/>
                <Cell N="NoLine" V="0"/>
                <Row T="Ellipse" IX="1">
                    <Cell N="X" V="0.25" U="IN"/>
                    <Cell N="Y" V="0.25" U="IN"/>
                    <Cell N="A" V="0.5" U="IN"/>
                    <Cell N="B" V="0" U="IN"/>
                    <Cell N="C" V="0.25" U="IN"/>
                    <Cell N="D" V="0.25" U="IN"/>
                </Row>
            </Section>
            <Section N="Fill">
                <Cell N="FillForegnd" V="${fillColor}"/>
                <Cell N="FillPattern" V="1"/>
            </Section>
            <Section N="Line">
                <Cell N="LineWeight" V="0.01" U="IN"/>
                <Cell N="LineColor" V="1"/>
                <Cell N="LinePattern" V="1"/>
            </Section>
            <Section N="Character">
                <Row IX="0">
                    <Cell N="Font" V="Segoe UI"/>
                    <Cell N="Color" V="1"/>
                    <Cell N="Size" V="0.1389" U="PT"/>
                </Row>
            </Section>
        </Shape>`;
            shapeId++;
        });

        data.connections.forEach(conn => {
            const fromNode = data.nodes.find(n => n.name === conn.from);
            const toNode = data.nodes.find(n => n.name === conn.to);

            if (fromNode && toNode) {
                const x1 = fromNode.x * scale + 2;
                const y1 = 8.5 - (fromNode.y * scale + 2);
                const x2 = toNode.x * scale + 2;
                const y2 = 8.5 - (toNode.y * scale + 2);
                const width = Math.abs(x2 - x1) || 0.01;
                const height = Math.abs(y2 - y1) || 0.01;
                const pinX = Math.min(x1, x2) + width / 2;
                const pinY = Math.min(y1, y2) + height / 2;
                const locPinX = width / 2;
                const locPinY = height / 2;

                shapesXML += `
        <Shape ID="${shapeId}" Type="Shape" LineStyle="3" FillStyle="3" TextStyle="3">
            <Cell N="PinX" V="${pinX}" U="IN"/>
            <Cell N="PinY" V="${pinY}" U="IN"/>
            <Cell N="Width" V="${width}" U="IN"/>
            <Cell N="Height" V="${height}" U="IN"/>
            <Cell N="LocPinX" V="${locPinX}" U="IN"/>
            <Cell N="LocPinY" V="${locPinY}" U="IN"/>
            <Text>${conn.distance} mm</Text>
            <Section N="Geometry" IX="0">
                <Cell N="NoFill" V="1"/>
                <Cell N="NoLine" V="0"/>
                <Row T="MoveTo" IX="1">
                    <Cell N="X" V="${x1 - pinX + locPinX}" U="IN"/>
                    <Cell N="Y" V="${y1 - pinY + locPinY}" U="IN"/>
                </Row>
                <Row T="LineTo" IX="2">
                    <Cell N="X" V="${x2 - pinX + locPinX}" U="IN"/>
                    <Cell N="Y" V="${y2 - pinY + locPinY}" U="IN"/>
                </Row>
            </Section>
            <Section N="Line">
                <Cell N="LineWeight" V="0.02" U="IN"/>
                <Cell N="LineColor" V="4"/>
                <Cell N="LinePattern" V="1"/>
            </Section>
            <Section N="Character">
                <Row IX="0">
                    <Cell N="Font" V="Segoe UI"/>
                    <Cell N="Color" V="0"/>
                    <Cell N="Size" V="0.125" U="PT"/>
                </Row>
            </Section>
        </Shape>`;
                shapeId++;
            }
        });

        return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<PageContents xmlns="http://schemas.microsoft.com/office/visio/2012/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xml:space="preserve">
    <Shapes>
${shapesXML}
    </Shapes>
    <Connects/>
</PageContents>`;
    },

    _escapeXml(str) {
        return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }
};
