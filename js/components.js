// ========================================
// Components Module - Ramification suggestions
// Suggests braid tube, tube shrink, marker sleeve,
// clear tube shrink for each segment
// ========================================

const ComponentSuggestions = {

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

    renderComponentSuggestion(suggestion) {
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

        return `
            <div class="component-suggestion">
                <div class="component-suggestion-title">Componentes Sugeridos</div>
                ${formatComponent('Braid Tube', suggestion.braidTube)}
                ${formatComponent('Tube Shrink', suggestion.tubeShrink)}
                ${formatComponent('Marker Sleeve', suggestion.markerSleeve)}
                ${formatComponent('Clear Tube Shrink', suggestion.clearTubeShrink)}
            </div>`;
    }
};
