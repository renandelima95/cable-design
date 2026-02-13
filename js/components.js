// ========================================
// Components Module - Ramification suggestions
// Suggests braid tube, tube shrink, marker sleeve,
// clear tube shrink for each segment
// ========================================

const ComponentSuggestions = {

    getSelectedBraidTube(segmentKey, bundleDiameter) {
        const overrides = AppState.segmentOverrides[segmentKey];
        if (overrides && overrides.braidTubeOverrideMPN) {
            const bt = Database.braidTubes.find(b => b.MPN === overrides.braidTubeOverrideMPN);
            if (bt) return bt;
        }
        return Database.findBraidTube(bundleDiameter);
    },

    getBraidTubeWarnings(segmentKey, bundleDiameter) {
        const braidTube = this.getSelectedBraidTube(segmentKey, bundleDiameter);
        if (!braidTube || bundleDiameter <= 0) return [];
        const warnings = [];
        if (bundleDiameter > braidTube.nominalDiameter) {
            warnings.push({ type: 'error', msg: `Bundle (${bundleDiameter.toFixed(2)} mm) excede diâmetro do braid tube (${braidTube.nominalDiameter} mm)` });
        }
        return warnings;
    },

    onBraidTubeChange(segmentKey, value) {
        if (!AppState.segmentOverrides[segmentKey]) {
            AppState.segmentOverrides[segmentKey] = {};
        }
        AppState.segmentOverrides[segmentKey].braidTubeOverrideMPN = value || null;
        BundleUI.update();
        BomUI.markDirty();
    },

    getSelectedTubeShrink(segmentKey, bundleDiameter) {
        const overrides = AppState.segmentOverrides[segmentKey];
        if (overrides && overrides.tubeShrinkOverrideMPN) {
            const ts = Database.tubeShrinks.find(t => t.MPN === overrides.tubeShrinkOverrideMPN);
            if (ts) return ts;
        }
        const diameterAfterBraid = this._getDiameterAfterBraid(segmentKey, bundleDiameter);
        return Database.findTubeShrink(diameterAfterBraid);
    },

    _getDiameterAfterBraid(segmentKey, bundleDiameter) {
        const braidTube = segmentKey
            ? this.getSelectedBraidTube(segmentKey, bundleDiameter)
            : Database.findBraidTube(bundleDiameter);
        if (braidTube) {
            return bundleDiameter + 2 * (braidTube.wallThickness || 0);
        }
        return bundleDiameter;
    },

    onTubeShrinkChange(segmentKey, value) {
        if (!AppState.segmentOverrides[segmentKey]) {
            AppState.segmentOverrides[segmentKey] = {};
        }
        AppState.segmentOverrides[segmentKey].tubeShrinkOverrideMPN = value || null;
        BundleUI.update();
        BomUI.markDirty();
    },

    getSuggestionsForSegment(bundleDiameter, segmentKey) {
        const result = {
            bundleDiameter: bundleDiameter,
            braidTube: null,
            braidOuterDiameter: null,
            tubeShrink: null,
            tubeShrinkOuterDiameter: null,
            markerSleeve: null,
            markerSleeveOuterDiameter: null,
            clearTubeShrink: null,
            clearTubeShrinkOuterDiameter: null
        };

        // Step 1: Find braid tube that fits the bundle (use override if set)
        const braidTube = segmentKey
            ? this.getSelectedBraidTube(segmentKey, bundleDiameter)
            : Database.findBraidTube(bundleDiameter);
        if (braidTube) {
            result.braidTube = braidTube;
            // OD after braid = bundle diameter + 2 * wall thickness
            result.braidOuterDiameter = bundleDiameter + 2 * (braidTube.wallThickness || 0);
        }

        // Step 2: Find tube shrink that fits over the braid (or bundle if no braid)
        const diameterAfterBraid = result.braidOuterDiameter || bundleDiameter;
        const tubeShrink = Database.findTubeShrink(diameterAfterBraid);
        if (tubeShrink) {
            result.tubeShrink = tubeShrink;
            result.tubeShrinkOuterDiameter = diameterAfterBraid + 2 * (tubeShrink.wallThickness || 0);
        }

        // Step 3: Find marker sleeve that fits over current OD
        const diameterAfterTubeShrink = result.tubeShrinkOuterDiameter || diameterAfterBraid;
        const markerSleeve = Database.findMarkerSleeve(diameterAfterTubeShrink);
        if (markerSleeve) {
            result.markerSleeve = markerSleeve;
            // Marker sleeve doesn't significantly change OD for the purpose of clear tube sizing
            result.markerSleeveOuterDiameter = diameterAfterTubeShrink;
        }

        // Step 4: Find clear tube shrink for marker sleeve protection
        const diameterForClear = result.markerSleeveOuterDiameter || diameterAfterTubeShrink;
        const clearTubeShrink = Database.findClearTubeShrink(diameterForClear);
        if (clearTubeShrink) {
            result.clearTubeShrink = clearTubeShrink;
            result.clearTubeShrinkOuterDiameter = diameterForClear + 2 * (clearTubeShrink.wallThickness || 0);
        }

        return result;
    },

    renderComponentSuggestion(suggestion, segmentKey, bundleDiameter) {
        const esc = CanvasEditor.escapeHtml.bind(CanvasEditor);

        function formatComponent(label, component) {
            if (!component) {
                return `
                    <div class="component-row">
                        <span class="component-label">${label}</span>
                        <span class="component-value no-data">Sem dados no banco</span>
                    </div>`;
            }
            const pn = component.PN || '\u2014';
            const desc = component.description || component.name || '\u2014';
            return `
                <div class="component-row">
                    <span class="component-label">${label}</span>
                    <span class="component-value">${esc(pn)} \u2014 ${esc(desc)}</span>
                </div>`;
        }

        // Build braid tube override dropdown
        const selectedBraidTube = segmentKey
            ? this.getSelectedBraidTube(segmentKey, bundleDiameter)
            : suggestion.braidTube;
        const overrides = segmentKey ? (AppState.segmentOverrides[segmentKey] || {}) : {};
        const braidOverrideMPN = overrides.braidTubeOverrideMPN || '';
        const braidWarnings = segmentKey ? this.getBraidTubeWarnings(segmentKey, bundleDiameter) : [];
        const autoSuggestedBraid = Database.findBraidTube(bundleDiameter);

        let braidTubeHtml;
        if (Database.braidTubes.length > 0 && segmentKey) {
            const escapedKey = esc(segmentKey).replace(/'/g, "\\'");
            let options = `<option value="">Auto (sugest\u00E3o)</option>`;
            Database.braidTubes.forEach(bt => {
                const isSuggested = autoSuggestedBraid && bt.MPN === autoSuggestedBraid.MPN;
                const selected = (braidOverrideMPN && bt.MPN === braidOverrideMPN) ? 'selected'
                    : (!braidOverrideMPN && isSuggested) ? 'selected' : '';
                const label = `${esc(bt.MPN)} \u2014 \u00D8${bt.nominalDiameter} mm${isSuggested ? ' (sugerido)' : ''}`;
                options += `<option value="${esc(bt.MPN)}" ${selected}>${label}</option>`;
            });
            braidTubeHtml = `
                <div class="component-row">
                    <span class="component-label">Braid Tube</span>
                    <select class="component-override-select" onchange="ComponentSuggestions.onBraidTubeChange('${escapedKey}', this.value)">
                        ${options}
                    </select>
                </div>`;
            if (selectedBraidTube) {
                braidTubeHtml += `
                <div class="component-row" style="padding-left: 10px;">
                    <span class="component-value">${esc(selectedBraidTube.PN || '\u2014')} \u2014 ${esc(selectedBraidTube.description || '\u2014')}</span>
                </div>`;
            }
            if (braidWarnings.length > 0) {
                braidTubeHtml += braidWarnings.map(w => `<div class="backshell-warning">${w.msg}</div>`).join('');
            }
        } else {
            braidTubeHtml = formatComponent('Braid Tube', selectedBraidTube);
        }

        // Build tube shrink override dropdown
        const selectedTubeShrink = segmentKey
            ? this.getSelectedTubeShrink(segmentKey, bundleDiameter)
            : suggestion.tubeShrink;
        const currentOverrideMPN = overrides.tubeShrinkOverrideMPN || '';

        let tubeShrinkHtml;
        if (Database.tubeShrinks.length > 0 && segmentKey) {
            const escapedKey = esc(segmentKey).replace(/'/g, "\\'");
            let options = `<option value="">Auto (sugest\u00E3o)</option>`;
            Database.tubeShrinks.forEach(ts => {
                const isSuggested = suggestion.tubeShrink && ts.MPN === suggestion.tubeShrink.MPN;
                const selected = (currentOverrideMPN && ts.MPN === currentOverrideMPN) ? 'selected'
                    : (!currentOverrideMPN && isSuggested) ? 'selected' : '';
                const label = `${esc(ts.MPN)} \u2014 ${esc(ts.description || '')} (${ts.minDiameter}\u2013${ts.maxDiameter} mm)${isSuggested ? ' (sugerido)' : ''}`;
                options += `<option value="${esc(ts.MPN)}" ${selected}>${label}</option>`;
            });
            tubeShrinkHtml = `
                <div class="component-row">
                    <span class="component-label">Tube Shrink</span>
                    <select class="component-override-select" onchange="ComponentSuggestions.onTubeShrinkChange('${escapedKey}', this.value)">
                        ${options}
                    </select>
                </div>`;
            if (selectedTubeShrink) {
                tubeShrinkHtml += `
                <div class="component-row" style="padding-left: 10px;">
                    <span class="component-value">${esc(selectedTubeShrink.PN || '\u2014')} \u2014 ${esc(selectedTubeShrink.description || '\u2014')}</span>
                </div>`;
            }
        } else {
            tubeShrinkHtml = formatComponent('Tube Shrink', selectedTubeShrink);
        }

        return `
            <div class="component-suggestion">
                <div class="component-suggestion-title">Componentes Sugeridos</div>
                ${braidTubeHtml}
                ${tubeShrinkHtml}
                ${formatComponent('Marker Sleeve', suggestion.markerSleeve)}
                ${formatComponent('Clear Tube Shrink', suggestion.clearTubeShrink)}
            </div>`;
    }
};
