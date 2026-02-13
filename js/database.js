// ========================================
// Database - Component lookup methods
// Data is loaded by data/*.js script tags
// ========================================

const Database = {
    // These arrays are populated by data/*.js files loaded via <script> tags
    cables: [],
    braidTubes: [],
    tubeShrinks: [],
    markerSleeves: [],
    clearTubeShrinks: [],
    connectors: [],
    backshells: [],
    bootShrinks: [],

    getCable(name) {
        return this.cables.find(c => c.name === name) || null;
    },

    findBraidTube(bundleDiameter) {
        return this.braidTubes
            .filter(bt => bt.nominalDiameter > 0)
            .filter(bt => bundleDiameter <= bt.nominalDiameter)
            .sort((a, b) => a.nominalDiameter - b.nominalDiameter)[0] || null;
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
        // Hard constraints: both must fit within max.
        // Prefer smallest boot shrink (tightest fit, closest to min).
        return this.bootShrinks
            .filter(bs => bs.type === type)
            .filter(bs => bs.maxBackshellDiameter > 0 && bs.maxBundleDiameter > 0)
            .filter(bs => backshellExternalDiameter <= bs.maxBackshellDiameter)
            .filter(bs => bundleDiameter <= bs.maxBundleDiameter)
            .sort((a, b) => a.maxBackshellDiameter - b.maxBackshellDiameter)[0] || null;
    },

    getCompatibleBootShrinks(type) {
        return this.bootShrinks
            .filter(bs => bs.type === type)
            .sort((a, b) => a.maxBackshellDiameter - b.maxBackshellDiameter);
    }
};
