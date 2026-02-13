// ========================================
// Components Module - Ramification suggestions
// Suggests braid tube, tube shrink, marker sleeve,
// clear tube shrink for each segment
// ========================================

const ComponentSuggestions = {

    getSelectedTubeShrink(segmentKey, bundleDiameter) {
        const overrides = AppState.segmentOverrides[segmentKey];
        if (overrides && overrides.tubeShrinkOverrideMPN) {
            const ts = Database.tubeShrinks.find(t => t.MPN === overrides.tubeShrinkOverrideMPN);
            if (ts) return ts;
        }
        const diameterAfterBraid = this._getDiameterAfterBraid(bundleDiameter);
        return Database.findTubeShrink(diameterAfterBraid);
    },

    _getDiameterAfterBraid(bundleDiameter) {
        const braidTube = Database.findBraidTube(bundleDiameter);
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

    getSuggestionsForSegment(bundleDiameter) {
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

        // Step 1: Find braid tube that fits the bundle
        const braidTube = Database.findBraidTube(bundleDiameter);
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
            const pn = component.PN || '—';
            const desc = component.description || component.name || '—';
            return `
                <div class="component-row">
                    <span class="component-label">${label}</span>
                    <span class="component-value">${esc(pn)} — ${esc(desc)}</span>
                </div>`;
        }

        // Build tube shrink override dropdown
        const selectedTubeShrink = segmentKey
            ? this.getSelectedTubeShrink(segmentKey, bundleDiameter)
            : suggestion.tubeShrink;
        const overrides = segmentKey ? (AppState.segmentOverrides[segmentKey] || {}) : {};
        const currentOverrideMPN = overrides.tubeShrinkOverrideMPN || '';

        let tubeShrinkHtml;
        if (Database.tubeShrinks.length > 0 && segmentKey) {
            const escapedKey = esc(segmentKey).replace(/'/g, "\\'");
            let options = `<option value="">Auto (sugestão)</option>`;
            Database.tubeShrinks.forEach(ts => {
                const isSuggested = suggestion.tubeShrink && ts.MPN === suggestion.tubeShrink.MPN;
                const selected = (currentOverrideMPN && ts.MPN === currentOverrideMPN) ? 'selected'
                    : (!currentOverrideMPN && isSuggested) ? 'selected' : '';
                const label = `${esc(ts.MPN)} — ${esc(ts.description || '')} (${ts.minDiameter}–${ts.maxDiameter} mm)${isSuggested ? ' (sugerido)' : ''}`;
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
                    <span class="component-value">${esc(selectedTubeShrink.PN || '—')} — ${esc(selectedTubeShrink.description || '—')}</span>
                </div>`;
            }
        } else {
            tubeShrinkHtml = formatComponent('Tube Shrink', selectedTubeShrink);
        }

        return `
            <div class="component-suggestion">
                <div class="component-suggestion-title">Componentes Sugeridos</div>
                ${formatComponent('Braid Tube', suggestion.braidTube)}
                ${tubeShrinkHtml}
                ${formatComponent('Marker Sleeve', suggestion.markerSleeve)}
                ${formatComponent('Clear Tube Shrink', suggestion.clearTubeShrink)}
            </div>`;
    }
};
