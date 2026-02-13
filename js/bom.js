// ========================================
// BOM Module - Bill of Materials
// Consolidates all materials into a single table
// ========================================

const BomUI = {

    update() {
        const container = document.getElementById('bomContainer');
        if (!container) return;

        if (AppState.routes.length === 0) {
            container.innerHTML = '<div class="empty-state"><p>Adicione rotas para ver a lista de materiais</p></div>';
            return;
        }

        const bomItems = {};
        const margin = parseFloat(document.getElementById('marginInput').value) / 100;

        function addItem(pn, description, uom, quantity, mpn, categoryOrder) {
            const key = (pn && pn.trim()) ? pn.trim() : (description || '').trim();
            if (!key) return;

            if (bomItems[key]) {
                bomItems[key].quantity += quantity;
            } else {
                bomItems[key] = {
                    pn: pn || '',
                    description: description || '',
                    uom: uom || '',
                    quantity: quantity,
                    mpn: mpn || '',
                    categoryOrder: categoryOrder
                };
            }
        }

        // Build segment distance map (segment key → distance in mm)
        const segmentDistanceMap = {};
        AppState.connections.forEach(conn => {
            const key = [conn.from, conn.to].sort().join(' \u2194 ');
            segmentDistanceMap[key] = conn.distance;
        });

        // 1. Connectors (category 1)
        const endNodes = AppState.nodes.filter(n => n.nodeType === 'end');
        endNodes.forEach(node => {
            const config = AppState.endNodeConfigs[node.name];
            if (!config) return;
            const mpn = ConnectorUI.buildMPN(config);
            if (!mpn) return;
            const matched = ConnectorUI.findMatchingConnector(mpn);
            if (matched) {
                addItem(matched.PN, matched.description, matched.UOM || 'un', 1, mpn, 1);
            } else {
                const desc = ConnectorUI.buildDescription(config);
                addItem('', desc, 'un', 1, mpn, 1);
            }
        });

        // 2. Backshells (category 2)
        endNodes.forEach(node => {
            const backshell = ConnectorUI.getBackshellSuggestion(node.name);
            if (backshell) {
                addItem(backshell.PN, backshell.description, backshell.UOM || 'un', 1, backshell.MPN, 2);
            }
        });

        // 3. Boot Shrinks (category 3)
        endNodes.forEach(node => {
            const bootShrink = ConnectorUI.getBootShrinkSuggestion(node.name);
            if (bootShrink) {
                addItem(bootShrink.PN, bootShrink.description, bootShrink.UOM || 'un', 1, bootShrink.MPN, 3);
            }
        });

        // Segment-based components
        const segmentBundles = BundleUI.getSegmentBundles();

        for (const [segment, wires] of Object.entries(segmentBundles)) {
            const bundleData = BundleUI._bundleCache[segment] || calculateWireBundle(wires);
            const suggestions = ComponentSuggestions.getSuggestionsForSegment(bundleData.diameter);
            const segmentLengthM = (segmentDistanceMap[segment] || 0) * (1 + margin) / 1000;

            // 4. Tube Shrink (category 4)
            if (suggestions.tubeShrink) {
                const ts = suggestions.tubeShrink;
                const qty = ts.UOM === 'un' ? 1 : segmentLengthM;
                addItem(ts.PN, ts.description, ts.UOM || 'm', qty, ts.MPN, 4);
            }

            // 5. Braid Tube (category 5)
            if (suggestions.braidTube) {
                const bt = suggestions.braidTube;
                const qty = bt.UOM === 'un' ? 1 : segmentLengthM;
                addItem(bt.PN, bt.description, bt.UOM || 'm', qty, bt.MPN, 5);
            }

            // 6. Marker Sleeve (category 6)
            if (suggestions.markerSleeve) {
                const ms = suggestions.markerSleeve;
                const qty = ms.UOM === 'm' ? segmentLengthM : 1;
                addItem(ms.PN, ms.description, ms.UOM || 'un', qty, ms.MPN, 6);
            }

            // 7. Clear Tube Shrink (category 7)
            if (suggestions.clearTubeShrink) {
                const ct = suggestions.clearTubeShrink;
                const qty = ct.UOM === 'un' ? 1 : segmentLengthM;
                addItem(ct.PN, ct.description, ct.UOM || 'm', qty, ct.MPN, 7);
            }
        }

        // 8. Wires (category 8) - consolidated by cable type
        const wireTotals = {};
        AppState.routes.forEach(route => {
            const cable = Database.getCable(route.cableType);
            if (!cable) return;
            const lengthM = route.totalDistance * (1 + margin) * route.quantity / 1000;
            const key = cable.name;

            if (!wireTotals[key]) {
                wireTotals[key] = { cable: cable, total: 0 };
            }
            wireTotals[key].total += lengthM;
        });

        for (const data of Object.values(wireTotals)) {
            addItem(data.cable.PN, data.cable.description, data.cable.UOM || 'm', data.total, data.cable.MPN, 8);
        }

        // Sort by category order, then alphabetically
        const sortedItems = Object.values(bomItems).sort((a, b) => {
            if (a.categoryOrder !== b.categoryOrder) return a.categoryOrder - b.categoryOrder;
            return (a.pn || a.description).localeCompare(b.pn || b.description);
        });

        // Render table
        const esc = CanvasEditor.escapeHtml.bind(CanvasEditor);
        let html = '<table class="bom-table"><thead><tr>';
        html += '<th>PN</th><th>Description</th><th>UOM</th><th>Quantity</th><th>MPN</th>';
        html += '</tr></thead><tbody>';

        sortedItems.forEach(item => {
            const qty = item.uom === 'm' ? item.quantity.toFixed(2) : Math.ceil(item.quantity);
            html += '<tr>';
            html += `<td>${esc(item.pn)}</td>`;
            html += `<td>${esc(item.description)}</td>`;
            html += `<td>${esc(item.uom)}</td>`;
            html += `<td class="bom-qty">${qty}</td>`;
            html += `<td>${esc(item.mpn)}</td>`;
            html += '</tr>';
        });

        html += '</tbody></table>';
        container.innerHTML = html;
    }
};
