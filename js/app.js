// ========================================
// App Module - State, init, UI orchestration
// ========================================

// Global application state
const AppState = {
    nodes: [],
    connections: [],
    routes: [],
    endNodeConfigs: {},   // { nodeName: { connector, backshellAngle, bootShrinkType } }

    mode: 'addNode',
    selectedNodeType: 'end',  // 'end' or 'transition'
    selectedNode: null,
    connectingFrom: null,
    draggingNode: null,
    nodeIdCounter: 0,
    routeIdCounter: 0,
    editingRouteId: null
};

// Bundle UI - Wire bundle visualization (extracted for reuse by ConnectorUI)
const BundleUI = {
    // Cache: store computed bundle data per segment to avoid double-calc
    _bundleCache: {},

    getSegmentBundles() {
        const branchMap = {};

        AppState.routes.forEach(route => {
            for (let i = 0; i < route.points.length - 1; i++) {
                const from = route.points[i];
                const to = route.points[i + 1];
                const segmentKey = [from, to].sort().join(' \u2194 ');

                if (!branchMap[segmentKey]) {
                    branchMap[segmentKey] = [];
                }

                const cableData = Database.getCable(route.cableType);
                if (cableData) {
                    for (let j = 0; j < route.quantity; j++) {
                        branchMap[segmentKey].push({
                            name: route.cableType,
                            nominalDiameter: cableData.nominalDiameter,
                            diameter: cableData.nominalDiameter,
                            color: cableData.color
                        });
                    }
                }
            }
        });

        return branchMap;
    },

    update() {
        const container = document.getElementById('bundleContainer');
        if (!container) return;

        if (AppState.routes.length === 0) {
            container.innerHTML = '<div class="empty-state"><p>Adicione rotas para ver os wire bundles</p></div>';
            this._bundleCache = {};
            return;
        }

        const branchMap = this.getSegmentBundles();
        const esc = CanvasEditor.escapeHtml.bind(CanvasEditor);

        // Compute all bundles once, store in cache
        this._bundleCache = {};
        for (const [segment, wires] of Object.entries(branchMap)) {
            this._bundleCache[segment] = calculateWireBundle(wires);
        }

        let html = '';

        for (const [segment, wires] of Object.entries(branchMap)) {
            const bundleData = this._bundleCache[segment];
            const canvasId = `bundle-${segment.replace(/[^a-zA-Z0-9]/g, '')}`;
            const suggestions = ComponentSuggestions.getSuggestionsForSegment(bundleData.diameter);

            html += `
                <div class="bundle-item">
                    <div class="bundle-header">
                        <span>${esc(segment)}</span>
                        <span class="bundle-diameter">\u00D8 ${bundleData.diameter.toFixed(2)} mm</span>
                    </div>
                    <div class="bundle-content">
                        <div class="bundle-visual">
                            <canvas id="${canvasId}" class="bundle-canvas" width="200" height="200"></canvas>
                        </div>
                        <div class="bundle-details">
                            <strong style="display: block; margin-bottom: 10px;">Cabos nesta ramificação:</strong>`;

            // Group wires by type
            const wireGroups = {};
            wires.forEach(wire => {
                if (!wireGroups[wire.name]) {
                    wireGroups[wire.name] = { count: 0, color: wire.color, diameter: wire.nominalDiameter || wire.diameter };
                }
                wireGroups[wire.name].count++;
            });

            for (const [name, data] of Object.entries(wireGroups)) {
                html += `
                    <div class="wire-list-item">
                        <div class="wire-color-dot" style="background-color: ${esc(data.color)};"></div>
                        <span><strong>${data.count}\u00D7</strong> ${esc(name)} (\u00D8 ${data.diameter} mm)</span>
                    </div>`;
            }

            html += `
                        </div>
                    </div>
                    ${ComponentSuggestions.renderComponentSuggestion(suggestions)}
                </div>`;
        }

        container.innerHTML = html;

        // Draw bundles using cached data (single computation)
        setTimeout(() => {
            for (const [segment] of Object.entries(branchMap)) {
                const canvasId = `bundle-${segment.replace(/[^a-zA-Z0-9]/g, '')}`;
                const canvasEl = document.getElementById(canvasId);
                if (canvasEl && this._bundleCache[segment]) {
                    drawWireBundle(canvasEl, this._bundleCache[segment]);
                }
            }
        }, 50);
    }
};

// Main application controller
const App = {

    init() {
        this.populateCableTypes();
        CanvasEditor.init();
        this.setMode('addNode');
        this.setNodeType('end');
        CanvasEditor.redraw();
        ConnectorUI.render();

        // Margin input listener
        document.getElementById('marginInput').addEventListener('input', () => {
            if (AppState.routes.length > 0) {
                this.updateResults();
            }
        });

        // Modal close on outside click
        window.onclick = function (event) {
            const modal = document.getElementById('editModal');
            if (event.target === modal) {
                App.closeEditModal();
            }
        };
    },

    populateCableTypes() {
        const select = document.getElementById('cableType');
        if (!select) return;
        select.innerHTML = '<option value="">Selecione...</option>';
        Database.cables.forEach(cable => {
            const option = document.createElement('option');
            option.value = cable.name;
            option.textContent = `${cable.name} (\u00D8 ${cable.nominalDiameter} mm)`;
            select.appendChild(option);
        });
    },

    setMode(newMode) {
        AppState.mode = newMode;

        document.getElementById('addNodeBtn').classList.remove('active');
        document.getElementById('connectBtn').classList.remove('active');
        document.getElementById('selectBtn').classList.remove('active');

        const canvas = document.getElementById('canvas');
        if (newMode === 'addNode') {
            document.getElementById('addNodeBtn').classList.add('active');
            canvas.style.cursor = 'crosshair';
        } else if (newMode === 'connect') {
            document.getElementById('connectBtn').classList.add('active');
            canvas.style.cursor = 'pointer';
        } else if (newMode === 'select') {
            document.getElementById('selectBtn').classList.add('active');
            canvas.style.cursor = 'move';
        }

        AppState.connectingFrom = null;
        AppState.selectedNode = null;
        CanvasEditor.redraw();
    },

    setNodeType(type) {
        AppState.selectedNodeType = type;

        const endBtn = document.getElementById('endNodeBtn');
        const transBtn = document.getElementById('transitionNodeBtn');
        if (endBtn) endBtn.classList.toggle('active', type === 'end');
        if (transBtn) transBtn.classList.toggle('active', type === 'transition');
    },

    updateNodeSelects() {
        const selects = ['origin', 'destination'];
        selects.forEach(id => {
            const select = document.getElementById(id);
            if (!select) return;
            const currentVal = select.value;
            select.innerHTML = '<option value="">Selecione...</option>';
            AppState.nodes.forEach(node => {
                const option = document.createElement('option');
                option.value = node.name;
                option.textContent = `${node.name} (${node.nodeType === 'end' ? 'End' : 'TB'})`;
                select.appendChild(option);
            });
            if (currentVal) select.value = currentVal;
        });
    },

    addRoute() {
        const cableType = document.getElementById('cableType').value;
        const quantity = parseInt(document.getElementById('quantity').value);
        const origin = document.getElementById('origin').value;
        const destination = document.getElementById('destination').value;

        if (!cableType) {
            alert('Por favor, selecione o tipo de cabo');
            return;
        }
        if (!quantity || quantity <= 0) {
            alert('Por favor, insira uma quantidade válida');
            return;
        }
        if (!origin || !destination) {
            alert('Por favor, selecione origem e destino');
            return;
        }
        if (origin === destination) {
            alert('Origem e destino devem ser diferentes');
            return;
        }

        const result = Routing.findShortestPath(origin, destination);
        if (!result.found) {
            alert(result.error);
            return;
        }

        const route = {
            id: AppState.routeIdCounter++,
            cableType,
            quantity,
            points: result.path,
            totalDistance: result.distance
        };

        AppState.routes.push(route);

        document.getElementById('cableType').value = '';
        document.getElementById('quantity').value = '1';

        this.updateRoutesList();
        this.updateResults();
        BundleUI.update();
        ConnectorUI.render();
    },

    removeRoute(id) {
        AppState.routes = AppState.routes.filter(r => r.id !== id);
        this.updateRoutesList();
        this.updateResults();
        BundleUI.update();
        ConnectorUI.render();
    },

    updateRoutesList() {
        const container = document.getElementById('routesList');
        if (!container) return;

        if (AppState.routes.length === 0) {
            container.innerHTML = '<div class="empty-state"><p>Nenhuma rota definida</p></div>';
            return;
        }

        const esc = CanvasEditor.escapeHtml.bind(CanvasEditor);
        let html = '';

        AppState.routes.forEach(route => {
            const pathDisplay = route.points.join(' \u2192 ');
            html += `
                <div class="route-item">
                    <div class="route-header">
                        <div>
                            <span>${esc(route.cableType)}</span>
                            <span class="auto-route-badge">AUTO</span>
                        </div>
                        <div>
                            <button class="edit-btn" onclick="App.editRoute(${route.id})">Editar</button>
                            <button class="btn btn-danger btn-sm" onclick="App.removeRoute(${route.id})">x</button>
                        </div>
                    </div>
                    <div class="route-info">
                        <strong>Vias:</strong> ${route.quantity}<br>
                        <strong>Caminho:</strong>
                        <div class="path-display">${esc(pathDisplay)}</div>
                        <strong>Distância:</strong> ${route.totalDistance} mm
                    </div>
                </div>`;
        });

        container.innerHTML = html;
    },

    updateResults() {
        const container = document.getElementById('resultsContainer');
        if (!container) return;

        if (AppState.routes.length === 0) {
            container.innerHTML = '<div class="empty-state"><p>Adicione rotas para ver os resultados</p></div>';
            return;
        }

        const margin = parseFloat(document.getElementById('marginInput').value) / 100;
        const totals = {};

        AppState.routes.forEach(route => {
            const lengthWithMargin = route.totalDistance * (1 + margin);
            const totalLength = lengthWithMargin * route.quantity;

            if (!totals[route.cableType]) {
                totals[route.cableType] = { routes: [], totalLength: 0 };
            }

            totals[route.cableType].routes.push({
                path: route.points.join(' \u2192 '),
                quantity: route.quantity,
                baseDistance: route.totalDistance,
                totalLength: totalLength
            });

            totals[route.cableType].totalLength += totalLength;
        });

        const esc = CanvasEditor.escapeHtml.bind(CanvasEditor);
        let html = '';

        for (const [cableType, data] of Object.entries(totals)) {
            html += `
                <div class="result-card">
                    <div class="result-title">${esc(cableType)}</div>`;

            data.routes.forEach(route => {
                html += `
                    <div class="result-item">
                        <span style="flex: 1;">${esc(route.path)}</span>
                        <span style="font-weight: 600;">${(route.totalLength / 1000).toFixed(2)} m</span>
                    </div>`;
            });

            html += `
                    <div class="result-total">
                        <span>Total:</span>
                        <span>${(data.totalLength / 1000).toFixed(2)} m</span>
                    </div>
                </div>`;
        }

        container.innerHTML = html;
    },

    clearAll() {
        if (AppState.routes.length === 0) return;

        if (confirm('Limpar todas as rotas?')) {
            AppState.routes = [];
            AppState.routeIdCounter = 0;
            this.updateRoutesList();
            this.updateResults();
            BundleUI.update();
            ConnectorUI.render();
        }
    },

    // --- Edit Route Modal ---
    editRoute(id) {
        const route = AppState.routes.find(r => r.id === id);
        if (!route) return;

        AppState.editingRouteId = id;

        this.populateEditModal();

        document.getElementById('editCableType').value = route.cableType;
        document.getElementById('editQuantity').value = route.quantity;
        document.getElementById('editOrigin').value = route.points[0];
        document.getElementById('editDestination').value = route.points[route.points.length - 1];

        document.getElementById('editModal').style.display = 'block';
    },

    populateEditModal() {
        // Cable types
        const cableSelect = document.getElementById('editCableType');
        cableSelect.innerHTML = '<option value="">Selecione...</option>';
        Database.cables.forEach(cable => {
            const option = document.createElement('option');
            option.value = cable.name;
            option.textContent = `${cable.name} (\u00D8 ${cable.nominalDiameter} mm)`;
            cableSelect.appendChild(option);
        });

        // Node selects
        ['editOrigin', 'editDestination'].forEach(id => {
            const select = document.getElementById(id);
            select.innerHTML = '<option value="">Selecione...</option>';
            AppState.nodes.forEach(node => {
                const option = document.createElement('option');
                option.value = node.name;
                option.textContent = `${node.name} (${node.nodeType === 'end' ? 'End' : 'TB'})`;
                select.appendChild(option);
            });
        });
    },

    closeEditModal() {
        document.getElementById('editModal').style.display = 'none';
        AppState.editingRouteId = null;
    },

    saveEditedRoute() {
        if (AppState.editingRouteId === null) return;

        const cableType = document.getElementById('editCableType').value;
        const quantity = parseInt(document.getElementById('editQuantity').value);
        const origin = document.getElementById('editOrigin').value;
        const destination = document.getElementById('editDestination').value;

        if (!cableType || !quantity || !origin || !destination) {
            alert('Preencha todos os campos!');
            return;
        }
        if (origin === destination) {
            alert('Origem e destino devem ser diferentes');
            return;
        }

        const result = Routing.findShortestPath(origin, destination);
        if (!result.found) {
            alert(result.error);
            return;
        }

        const routeIndex = AppState.routes.findIndex(r => r.id === AppState.editingRouteId);
        if (routeIndex !== -1) {
            AppState.routes[routeIndex] = {
                id: AppState.editingRouteId,
                cableType: cableType,
                quantity: quantity,
                points: result.path,
                totalDistance: result.distance
            };
        }

        this.closeEditModal();
        this.updateRoutesList();
        this.updateResults();
        BundleUI.update();
        ConnectorUI.render();
    }
};
