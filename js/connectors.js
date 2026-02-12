// ========================================
// Connectors Module - End Node configuration
// Manages connector, backshell, boot shrink
// ========================================

const ConnectorUI = {

    getEndNodes() {
        return AppState.nodes.filter(n => n.nodeType === 'end');
    },

    getBundleDiameterAtNode(nodeName) {
        // Find all segments touching this node, get the max bundle diameter
        const segmentBundles = BundleUI.getSegmentBundles();
        let maxDiameter = 0;

        for (const [segmentKey, wires] of Object.entries(segmentBundles)) {
            if (segmentKey.includes(nodeName) && wires.length > 0) {
                const bundleData = calculateWireBundle(wires);
                if (bundleData.diameter > maxDiameter) {
                    maxDiameter = bundleData.diameter;
                }
            }
        }

        return maxDiameter;
    },

    getBackshellSuggestion(nodeName) {
        const config = AppState.endNodeConfigs[nodeName];
        if (!config || !config.connector) return null;

        const connector = Database.findConnector(config.connector);
        if (!connector) return null;

        const bundleDiameter = this.getBundleDiameterAtNode(nodeName);
        const shellSize = connector.shellSize || '';
        const angle = config.backshellAngle || 'straight';

        return Database.findBackshell(shellSize, angle, bundleDiameter);
    },

    getBootShrinkSuggestion(nodeName) {
        const config = AppState.endNodeConfigs[nodeName];
        if (!config) return null;

        const backshell = this.getBackshellSuggestion(nodeName);
        if (!backshell) return null;

        const bundleDiameter = this.getBundleDiameterAtNode(nodeName);
        const bootType = config.bootShrinkType || 'straight';

        return Database.findBootShrink(bootType, backshell.outputExternalDiameter, bundleDiameter);
    },

    render() {
        const container = document.getElementById('connectorConfigContainer');
        if (!container) return;

        const endNodes = this.getEndNodes();

        if (endNodes.length === 0) {
            container.innerHTML = '<div class="empty-state"><p>Adicione End Nodes (Jx/Px) para configurar conectores</p></div>';
            return;
        }

        const esc = CanvasEditor.escapeHtml.bind(CanvasEditor);
        let html = '<div class="connector-config-grid">';

        endNodes.forEach(node => {
            const config = AppState.endNodeConfigs[node.name] || {
                connector: null,
                backshellAngle: 'straight',
                bootShrinkType: 'straight'
            };

            const bundleDiameter = this.getBundleDiameterAtNode(node.name);
            const backshellSuggestion = this.getBackshellSuggestion(node.name);
            const bootShrinkSuggestion = this.getBootShrinkSuggestion(node.name);

            // Build connector options
            let connectorOptions = '<option value="">Selecione...</option>';
            Database.connectors.forEach(c => {
                const selected = config.connector === (c.PN || c.description) ? 'selected' : '';
                const label = c.PN ? `${c.PN} — ${c.description}` : c.description;
                connectorOptions += `<option value="${esc(c.PN || c.description)}" ${selected}>${esc(label)}</option>`;
            });

            html += `
                <div class="connector-card">
                    <div class="connector-card-header">
                        <span class="connector-card-title">${esc(node.name)}</span>
                        <span class="node-type-badge end-node">End Node</span>
                    </div>

                    <div class="input-row">
                        <label>Bundle Diameter neste nó</label>
                        <input type="text" value="${bundleDiameter > 0 ? bundleDiameter.toFixed(2) + ' mm' : 'Sem rotas'}" disabled>
                    </div>

                    <div class="input-row">
                        <label>Conector</label>
                        <select onchange="ConnectorUI.onConnectorChange('${esc(node.name)}', this.value)">
                            ${connectorOptions}
                        </select>
                    </div>

                    <div class="input-row-2col">
                        <div>
                            <label>Ângulo do Backshell</label>
                            <select onchange="ConnectorUI.onBackshellAngleChange('${esc(node.name)}', this.value)">
                                <option value="straight" ${config.backshellAngle === 'straight' ? 'selected' : ''}>Straight</option>
                                <option value="90-deg" ${config.backshellAngle === '90-deg' ? 'selected' : ''}>90°</option>
                            </select>
                        </div>
                        <div>
                            <label>Tipo de Boot Shrink</label>
                            <select onchange="ConnectorUI.onBootShrinkTypeChange('${esc(node.name)}', this.value)">
                                <option value="straight" ${config.bootShrinkType === 'straight' ? 'selected' : ''}>Straight</option>
                                <option value="90-deg" ${config.bootShrinkType === '90-deg' ? 'selected' : ''}>90°</option>
                            </select>
                        </div>
                    </div>

                    <div class="suggestion-box">
                        <div class="suggestion-box-title">Sugestão de Backshell</div>
                        ${this.renderSuggestion(backshellSuggestion)}
                    </div>

                    <div class="suggestion-box" style="margin-top: 10px;">
                        <div class="suggestion-box-title">Sugestão de Boot Shrink</div>
                        ${this.renderSuggestion(bootShrinkSuggestion)}
                    </div>
                </div>`;
        });

        html += '</div>';
        container.innerHTML = html;
    },

    renderSuggestion(item) {
        if (!item) {
            return '<div class="suggestion-item"><span class="label">Nenhuma sugestão disponível</span></div>';
        }
        const esc = CanvasEditor.escapeHtml.bind(CanvasEditor);
        return `
            <div class="suggestion-item">
                <span class="label">PN:</span>
                <span class="value">${esc(item.PN || '—')}</span>
            </div>
            <div class="suggestion-item">
                <span class="label">MPN:</span>
                <span class="value">${esc(item.MPN || '—')}</span>
            </div>
            <div class="suggestion-item">
                <span class="label">Descrição:</span>
                <span class="value">${esc(item.description || '—')}</span>
            </div>`;
    },

    onConnectorChange(nodeName, value) {
        if (!AppState.endNodeConfigs[nodeName]) {
            AppState.endNodeConfigs[nodeName] = { connector: null, backshellAngle: 'straight', bootShrinkType: 'straight' };
        }
        AppState.endNodeConfigs[nodeName].connector = value || null;
        this.render();
    },

    onBackshellAngleChange(nodeName, value) {
        if (!AppState.endNodeConfigs[nodeName]) return;
        AppState.endNodeConfigs[nodeName].backshellAngle = value;
        this.render();
    },

    onBootShrinkTypeChange(nodeName, value) {
        if (!AppState.endNodeConfigs[nodeName]) return;
        AppState.endNodeConfigs[nodeName].bootShrinkType = value;
        this.render();
    }
};
