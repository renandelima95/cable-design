// ========================================
// Database Loader - Loads all JSON databases
// ========================================

const Database = {
    cables: [],
    braidTubes: [],
    tubeShrinks: [],
    markerSleeves: [],
    clearTubeShrinks: [],
    connectors: [],
    backshells: [],
    bootShrinks: [],

    async loadAll() {
        const files = [
            { key: 'cables', path: 'data/cables.json' },
            { key: 'braidTubes', path: 'data/braid_tubes.json' },
            { key: 'tubeShrinks', path: 'data/tube_shrinks.json' },
            { key: 'markerSleeves', path: 'data/marker_sleeves.json' },
            { key: 'clearTubeShrinks', path: 'data/clear_tube_shrinks.json' },
            { key: 'connectors', path: 'data/connectors.json' },
            { key: 'backshells', path: 'data/backshells.json' },
            { key: 'bootShrinks', path: 'data/boot_shrinks.json' }
        ];

        const results = await Promise.allSettled(
            files.map(f => fetch(f.path).then(r => {
                if (!r.ok) throw new Error(`Failed to load ${f.path}: ${r.status}`);
                return r.json();
            }))
        );

        results.forEach((result, i) => {
            if (result.status === 'fulfilled') {
                this[files[i].key] = result.value;
            } else {
                console.warn(`Could not load ${files[i].path}:`, result.reason);
                this[files[i].key] = [];
            }
        });
    },

    getCable(name) {
        return this.cables.find(c => c.name === name) || null;
    },

    findBraidTube(bundleDiameter) {
        return this.braidTubes
            .filter(bt => bt.minDiameter > 0 && bt.maxDiameter > 0)
            .filter(bt => bundleDiameter >= bt.minDiameter && bundleDiameter <= bt.maxDiameter)
            .sort((a, b) => a.maxDiameter - b.maxDiameter)[0] || null;
    },

    findTubeShrink(outerDiameter) {
        return this.tubeShrinks
            .filter(ts => ts.minDiameter > 0 && ts.maxDiameter > 0)
            .filter(ts => outerDiameter >= ts.minDiameter && outerDiameter <= ts.maxDiameter)
            .sort((a, b) => a.maxDiameter - b.maxDiameter)[0] || null;
    },

    findMarkerSleeve(outerDiameter) {
        return this.markerSleeves
            .filter(ms => ms.minDiameter > 0 && ms.maxDiameter > 0)
            .filter(ms => outerDiameter >= ms.minDiameter && outerDiameter <= ms.maxDiameter)
            .sort((a, b) => a.maxDiameter - b.maxDiameter)[0] || null;
    },

    findClearTubeShrink(outerDiameter) {
        return this.clearTubeShrinks
            .filter(ct => ct.minDiameter > 0 && ct.maxDiameter > 0)
            .filter(ct => outerDiameter >= ct.minDiameter && outerDiameter <= ct.maxDiameter)
            .sort((a, b) => a.maxDiameter - b.maxDiameter)[0] || null;
    },

    findConnector(name) {
        return this.connectors.find(c => c.description === name || c.PN === name) || null;
    },

    findBackshell(connectorShellSize, angle, bundleDiameter) {
        return this.backshells
            .filter(bs => bs.connectorShellSize === connectorShellSize)
            .filter(bs => bs.angle === angle)
            .filter(bs => bs.minBundleDiameter > 0 && bs.maxBundleDiameter > 0)
            .filter(bs => bundleDiameter >= bs.minBundleDiameter && bundleDiameter <= bs.maxBundleDiameter)
            .sort((a, b) => a.maxBundleDiameter - b.maxBundleDiameter)[0] || null;
    },

    findBootShrink(type, backshellExternalDiameter, bundleDiameter) {
        return this.bootShrinks
            .filter(bs => bs.type === type)
            .filter(bs => bs.minBackshellDiameter > 0 && bs.maxBackshellDiameter > 0)
            .filter(bs =>
                backshellExternalDiameter >= bs.minBackshellDiameter &&
                backshellExternalDiameter <= bs.maxBackshellDiameter
            )
            .filter(bs => bs.minBundleDiameter > 0 && bs.maxBundleDiameter > 0)
            .filter(bs => bundleDiameter >= bs.minBundleDiameter && bundleDiameter <= bs.maxBundleDiameter)
            .sort((a, b) => a.maxBundleDiameter - b.maxBundleDiameter)[0] || null;
    }
};
