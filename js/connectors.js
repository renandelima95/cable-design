// ========================================
// Connectors Module - End Node configuration
// D38999 MPN builder with dropdown selectors
// Manages connector, backshell, boot shrink
// ========================================

const ConnectorUI = {

    getEndNodes() {
        return AppState.nodes.filter(n => n.nodeType === 'end');
    },

    getNodePrefix(nodeName) {
        return nodeName.charAt(0).toUpperCase();
    },

    getBundleDiameterAtNode(nodeName) {
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

    buildMPN(config) {
        if (!config) return '';
        const parts = [
            config.series || '',
            config.coating || '',
            config.shellSize || '',
            config.insertArr || '',
            config.contactType || '',
            config.polarity || ''
        ];
        if (parts.some(p => !p)) return '';
        return parts.join('');
    },

    buildDescription(config) {
        if (!config || !config.shellSize) return '';
        const cfg = Database.d38999Config;

        const seriesInfo = cfg.series.find(s => s.code === config.series);
        const sizeInfo = cfg.shellSizes.find(s => s.letter === config.shellSize);
        const arrangements = cfg.insertArrangements[config.shellSize] || [];
        const arrInfo = arrangements.find(a => a.code === config.insertArr);

        const seriesName = seriesInfo ? seriesInfo.name : '';
        const shellNum = sizeInfo ? sizeInfo.number : '';
        const totalPins = arrInfo ? arrInfo.total : '?';

        return `D38999 ${seriesName} Shell ${shellNum} - ${totalPins} contacts`;
    },

    getShellSizeNumber(config) {
        if (!config || !config.shellSize) return '';
        const sizeInfo = Database.d38999Config.shellSizes.find(s => s.letter === config.shellSize);
        return sizeInfo ? sizeInfo.number : '';
    },

    findMatchingConnector(mpn) {
        if (!mpn) return null;
        return Database.connectors.find(c => c.MPN === mpn) || null;
    },

    getBackshellSuggestion(nodeName) {
        const config = AppState.endNodeConfigs[nodeName];
        if (!config || !config.shellSize) return null;

        const shellSizeNum = this.getShellSizeNumber(config);
        if (!shellSizeNum) return null;

        const bundleDiameter = this.getBundleDiameterAtNode(nodeName);
        const angle = config.backshellAngle || 'straight';

        return Database.findBackshell(shellSizeNum, angle, bundleDiameter);
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

    formatInsertArrLabel(arr) {
        const pinParts = Object.entries(arr.pins).map(([gauge, count]) => `${count}\u00D7#${gauge}`);
        return `${arr.code} \u2014 ${arr.total} contacts (${pinParts.join(' + ')})`;
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
        const cfg = Database.d38999Config;
        let html = '<div class="connector-config-grid">';

        endNodes.forEach(node => {
            const config = AppState.endNodeConfigs[node.name] || {};
            const nodePrefix = this.getNodePrefix(node.name);
            const bundleDiameter = this.getBundleDiameterAtNode(node.name);

            const availableSeries = cfg.series.filter(s => s.nodePrefix === nodePrefix);
            const arrangements = config.shellSize ? (cfg.insertArrangements[config.shellSize] || []) : [];

            const mpn = this.buildMPN(config);
            const matchedConnector = this.findMatchingConnector(mpn);

            const backshellSuggestion = this.getBackshellSuggestion(node.name);
            const bootShrinkSuggestion = this.getBootShrinkSuggestion(node.name);

            // --- Series dropdown ---
            let seriesOptions = '<option value="">Selecione...</option>';
            availableSeries.forEach(s => {
                const selected = config.series === s.code ? 'selected' : '';
                seriesOptions += `<option value="${s.code}" ${selected}>${s.code} - ${esc(s.name)}</option>`;
            });

            // --- Coating dropdown ---
            let coatingOptions = '<option value="">Selecione...</option>';
            cfg.coatings.forEach(c => {
                const selected = config.coating === c.code ? 'selected' : '';
                coatingOptions += `<option value="${c.code}" ${selected}>${c.code} - ${esc(c.name)}</option>`;
            });

            // --- Shell Size dropdown ---
            let shellSizeOptions = '<option value="">Selecione...</option>';
            cfg.shellSizes.forEach(s => {
                const selected = config.shellSize === s.letter ? 'selected' : '';
                shellSizeOptions += `<option value="${s.letter}" ${selected}>${s.letter} (Shell ${s.number})</option>`;
            });

            // --- Insert Arrangement dropdown ---
            let insertArrOptions = '<option value="">Selecione...</option>';
            arrangements.forEach(a => {
                const selected = config.insertArr === a.code ? 'selected' : '';
                insertArrOptions += `<option value="${a.code}" ${selected}>${esc(this.formatInsertArrLabel(a))}</option>`;
            });

            // --- Contact Type dropdown ---
            let contactTypeOptions = '<option value="">Selecione...</option>';
            cfg.contactTypes.forEach(ct => {
                const selected = config.contactType === ct.code ? 'selected' : '';
                contactTypeOptions += `<option value="${ct.code}" ${selected}>${ct.code} - ${esc(ct.name)}</option>`;
            });

            // --- Polarity dropdown ---
            let polarityOptions = '<option value="">Selecione...</option>';
            cfg.polarities.forEach(p => {
                const selected = config.polarity === p.code ? 'selected' : '';
                polarityOptions += `<option value="${p.code}" ${selected}>${p.code} - ${esc(p.name)}</option>`;
            });

            // --- MPN display ---
            let mpnHtml;
            if (mpn) {
                mpnHtml = `<span class="mpn-code">${esc(mpn)}</span>`;
                if (matchedConnector) {
                    mpnHtml += `<div class="mpn-match">
                        <span class="label">PN:</span> <span class="value">${esc(matchedConnector.PN || '\u2014')}</span>
                        <span class="label" style="margin-left:12px;">Description:</span> <span class="value">${esc(matchedConnector.description || '\u2014')}</span>
                    </div>`;
                } else {
                    mpnHtml += '<div class="mpn-no-match">MPN not found in database</div>';
                }
            } else {
                mpnHtml = '<span class="mpn-placeholder">Complete all fields to build MPN</span>';
            }

            html += `
                <div class="connector-card">
                    <div class="connector-card-header">
                        <span class="connector-card-title">${esc(node.name)}</span>
                        <span class="node-type-badge end-node">${nodePrefix === 'P' ? 'Plug' : 'Receptacle'}</span>
                    </div>

                    <div class="input-row">
                        <label>Bundle Diameter</label>
                        <input type="text" value="${bundleDiameter > 0 ? bundleDiameter.toFixed(2) + ' mm' : 'No routes'}" disabled>
                    </div>

                    <div class="mpn-builder">
                        <div class="mpn-builder-title">D38999 MPN Builder</div>

                        <div class="input-row-3col">
                            <div>
                                <label>Series</label>
                                <select onchange="ConnectorUI.onFieldChange('${esc(node.name)}', 'series', this.value)">
                                    ${seriesOptions}
                                </select>
                            </div>
                            <div>
                                <label>Coating</label>
                                <select onchange="ConnectorUI.onFieldChange('${esc(node.name)}', 'coating', this.value)">
                                    ${coatingOptions}
                                </select>
                            </div>
                            <div>
                                <label>Shell Size</label>
                                <select onchange="ConnectorUI.onShellSizeChange('${esc(node.name)}', this.value)">
                                    ${shellSizeOptions}
                                </select>
                            </div>
                        </div>

                        <div class="input-row">
                            <label>Insert Arrangement</label>
                            <select onchange="ConnectorUI.onFieldChange('${esc(node.name)}', 'insertArr', this.value)"
                                    ${!config.shellSize ? 'disabled' : ''}>
                                ${insertArrOptions}
                            </select>
                        </div>

                        <div class="input-row-2col">
                            <div>
                                <label>Contact Type</label>
                                <select onchange="ConnectorUI.onFieldChange('${esc(node.name)}', 'contactType', this.value)">
                                    ${contactTypeOptions}
                                </select>
                            </div>
                            <div>
                                <label>Polarity</label>
                                <select onchange="ConnectorUI.onFieldChange('${esc(node.name)}', 'polarity', this.value)">
                                    ${polarityOptions}
                                </select>
                            </div>
                        </div>

                        <div class="mpn-display">
                            <div class="mpn-display-title">MPN</div>
                            ${mpnHtml}
                        </div>
                    </div>

                    <div class="input-row-2col" style="margin-top: 15px;">
                        <div>
                            <label>Backshell Angle</label>
                            <select onchange="ConnectorUI.onFieldChange('${esc(node.name)}', 'backshellAngle', this.value)">
                                <option value="straight" ${config.backshellAngle === 'straight' ? 'selected' : ''}>Straight</option>
                                <option value="90-deg" ${config.backshellAngle === '90-deg' ? 'selected' : ''}>90\u00B0</option>
                            </select>
                        </div>
                        <div>
                            <label>Boot Shrink Type</label>
                            <select onchange="ConnectorUI.onFieldChange('${esc(node.name)}', 'bootShrinkType', this.value)">
                                <option value="straight" ${config.bootShrinkType === 'straight' ? 'selected' : ''}>Straight</option>
                                <option value="90-deg" ${config.bootShrinkType === '90-deg' ? 'selected' : ''}>90\u00B0</option>
                            </select>
                        </div>
                    </div>

                    <div class="suggestion-box">
                        <div class="suggestion-box-title">Backshell Suggestion</div>
                        ${this.renderSuggestion(backshellSuggestion)}
                    </div>

                    <div class="suggestion-box" style="margin-top: 10px;">
                        <div class="suggestion-box-title">Boot Shrink Suggestion</div>
                        ${this.renderSuggestion(bootShrinkSuggestion)}
                    </div>
                </div>`;
        });

        html += '</div>';
        container.innerHTML = html;
    },

    renderSuggestion(item) {
        if (!item) {
            return '<div class="suggestion-item"><span class="label">No suggestion available</span></div>';
        }
        const esc = CanvasEditor.escapeHtml.bind(CanvasEditor);
        return `
            <div class="suggestion-item">
                <span class="label">PN:</span>
                <span class="value">${esc(item.PN || '\u2014')}</span>
            </div>
            <div class="suggestion-item">
                <span class="label">MPN:</span>
                <span class="value">${esc(item.MPN || '\u2014')}</span>
            </div>
            <div class="suggestion-item">
                <span class="label">Description:</span>
                <span class="value">${esc(item.description || '\u2014')}</span>
            </div>`;
    },

    onFieldChange(nodeName, field, value) {
        if (!AppState.endNodeConfigs[nodeName]) {
            AppState.endNodeConfigs[nodeName] = {
                series: null, coating: null, shellSize: null, insertArr: null,
                contactType: null, polarity: null,
                backshellAngle: 'straight', bootShrinkType: 'straight'
            };
        }
        AppState.endNodeConfigs[nodeName][field] = value || null;
        this.render();
        BomUI.update();
    },

    onShellSizeChange(nodeName, value) {
        if (!AppState.endNodeConfigs[nodeName]) {
            AppState.endNodeConfigs[nodeName] = {
                series: null, coating: null, shellSize: null, insertArr: null,
                contactType: null, polarity: null,
                backshellAngle: 'straight', bootShrinkType: 'straight'
            };
        }
        AppState.endNodeConfigs[nodeName].shellSize = value || null;
        AppState.endNodeConfigs[nodeName].insertArr = null;
        this.render();
        BomUI.update();
    }
};
