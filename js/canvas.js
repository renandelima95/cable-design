// ========================================
// Canvas Module - Topology Editor
// Handles node creation, connections, drawing
// ========================================

const CanvasEditor = {
    canvas: null,
    ctx: null,

    // Visual constants
    NODE_RADIUS: 25,
    END_NODE_COLOR: '#e74c3c',
    TRANSITION_NODE_COLOR: '#3498db',
    NODE_SELECTED_COLOR: '#764ba2',
    CONNECTION_COLOR: '#3498db',

    init() {
        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.setupEvents();
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
    },

    resizeCanvas() {
        const container = this.canvas.parentElement;
        const rect = container.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        const width = container.offsetWidth - 50;
        const height = 500;

        this.canvas.width = width * dpr;
        this.canvas.height = height * dpr;
        this.canvas.style.width = width + 'px';
        this.canvas.style.height = height + 'px';
        this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        this.redraw();
    },

    getMousePos(e) {
        const rect = this.canvas.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    },

    findNodeAt(x, y) {
        for (const node of AppState.nodes) {
            const dx = node.x - x;
            const dy = node.y - y;
            if (Math.sqrt(dx * dx + dy * dy) <= this.NODE_RADIUS) {
                return node;
            }
        }
        return null;
    },

    getNodeColor(node) {
        if (node.nodeType === 'end') return this.END_NODE_COLOR;
        return this.TRANSITION_NODE_COLOR;
    },

    setupEvents() {
        this.canvas.addEventListener('click', (e) => this.handleClick(e));
        this.canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.canvas.addEventListener('mouseup', () => this.handleMouseUp());
        this.canvas.addEventListener('dblclick', (e) => this.handleDblClick(e));
    },

    handleClick(e) {
        const pos = this.getMousePos(e);

        if (AppState.mode === 'addNode') {
            const nodeType = AppState.selectedNodeType;
            let defaultName;
            if (nodeType === 'end') {
                defaultName = `J${AppState.nodeIdCounter + 1}`;
            } else {
                defaultName = `TB${AppState.nodeIdCounter + 1}`;
            }

            const name = prompt(
                `Nome do ${nodeType === 'end' ? 'End Node (Jx ou Px)' : 'Transition Node (TBx)'}:`,
                defaultName
            );
            if (name && name.trim()) {
                const sanitizedName = name.trim().toUpperCase();
                AppState.nodes.push({
                    id: AppState.nodeIdCounter++,
                    name: sanitizedName,
                    nodeType: nodeType,
                    x: pos.x,
                    y: pos.y
                });
                if (nodeType === 'end') {
                    AppState.endNodeConfigs[sanitizedName] = {
                        connector: null,
                        backshellAngle: 'straight',
                        bootShrinkType: 'straight'
                    };
                }
                App.updateNodeSelects();
                this.redraw();
                ConnectorUI.render();
            }
        } else if (AppState.mode === 'connect') {
            const clickedNode = this.findNodeAt(pos.x, pos.y);

            if (clickedNode) {
                if (!AppState.connectingFrom) {
                    AppState.connectingFrom = clickedNode;
                    this.redraw();
                } else {
                    if (AppState.connectingFrom.id !== clickedNode.id) {
                        const exists = AppState.connections.some(c =>
                            (c.from === AppState.connectingFrom.name && c.to === clickedNode.name) ||
                            (c.from === clickedNode.name && c.to === AppState.connectingFrom.name)
                        );

                        if (!exists) {
                            const distance = prompt('Distância (mm):', '1000');
                            if (distance && parseFloat(distance) > 0) {
                                AppState.connections.push({
                                    from: AppState.connectingFrom.name,
                                    to: clickedNode.name,
                                    distance: parseFloat(distance)
                                });
                            }
                        } else {
                            alert('Conexão já existe!');
                        }
                    }
                    AppState.connectingFrom = null;
                    this.redraw();
                }
            }
        }
    },

    handleMouseDown(e) {
        if (AppState.mode === 'select') {
            const pos = this.getMousePos(e);
            AppState.draggingNode = this.findNodeAt(pos.x, pos.y);
        }
    },

    handleMouseMove(e) {
        if (AppState.draggingNode) {
            const pos = this.getMousePos(e);
            AppState.draggingNode.x = pos.x;
            AppState.draggingNode.y = pos.y;
            this.redraw();
        }
    },

    handleMouseUp() {
        AppState.draggingNode = null;
    },

    handleDblClick(e) {
        const pos = this.getMousePos(e);
        const clickedNode = this.findNodeAt(pos.x, pos.y);

        if (clickedNode) {
            if (confirm(`Deletar nó "${this.escapeHtml(clickedNode.name)}"?`)) {
                AppState.connections = AppState.connections.filter(c =>
                    c.from !== clickedNode.name && c.to !== clickedNode.name
                );
                AppState.nodes = AppState.nodes.filter(n => n.id !== clickedNode.id);
                delete AppState.endNodeConfigs[clickedNode.name];
                App.updateNodeSelects();
                this.redraw();
                ConnectorUI.render();
            }
        }
    },

    redraw() {
        const ctx = this.ctx;
        const displayWidth = parseInt(this.canvas.style.width);
        const displayHeight = parseInt(this.canvas.style.height);
        ctx.clearRect(0, 0, displayWidth, displayHeight);

        // Draw connections
        ctx.strokeStyle = this.CONNECTION_COLOR;
        ctx.lineWidth = 3;

        AppState.connections.forEach(conn => {
            const fromNode = AppState.nodes.find(n => n.name === conn.from);
            const toNode = AppState.nodes.find(n => n.name === conn.to);

            if (fromNode && toNode) {
                ctx.beginPath();
                ctx.moveTo(fromNode.x, fromNode.y);
                ctx.lineTo(toNode.x, toNode.y);
                ctx.stroke();

                // Distance label
                const midX = (fromNode.x + toNode.x) / 2;
                const midY = (fromNode.y + toNode.y) / 2;

                ctx.fillStyle = 'white';
                ctx.fillRect(midX - 30, midY - 12, 60, 24);

                ctx.fillStyle = this.CONNECTION_COLOR;
                ctx.font = 'bold 13px Arial';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(`${conn.distance}mm`, midX, midY);
            }
        });

        // Draw "connecting" preview line
        if (AppState.connectingFrom && AppState.mode === 'connect') {
            ctx.strokeStyle = this.NODE_SELECTED_COLOR;
            ctx.lineWidth = 2;
            ctx.setLineDash([5, 5]);
            ctx.beginPath();
            ctx.moveTo(AppState.connectingFrom.x, AppState.connectingFrom.y);
            ctx.lineTo(displayWidth / 2, displayHeight / 2);
            ctx.stroke();
            ctx.setLineDash([]);
        }

        // Draw nodes
        AppState.nodes.forEach(node => {
            const isConnecting = AppState.connectingFrom && AppState.connectingFrom.id === node.id;
            const baseColor = this.getNodeColor(node);

            ctx.fillStyle = isConnecting ? this.NODE_SELECTED_COLOR : baseColor;
            ctx.beginPath();
            ctx.arc(node.x, node.y, this.NODE_RADIUS, 0, Math.PI * 2);
            ctx.fill();

            ctx.strokeStyle = 'white';
            ctx.lineWidth = 4;
            ctx.stroke();

            // Node label
            ctx.fillStyle = 'white';
            ctx.font = 'bold 14px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(node.name, node.x, node.y);
        });
    },

    escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    },

    clearCanvas() {
        if (AppState.nodes.length === 0) return;

        if (confirm('Limpar todo o canvas? Isso também removerá todas as rotas.')) {
            AppState.nodes = [];
            AppState.connections = [];
            AppState.routes = [];
            AppState.endNodeConfigs = {};
            AppState.connectingFrom = null;
            AppState.selectedNode = null;
            AppState.nodeIdCounter = 0;
            AppState.routeIdCounter = 0;
            App.updateNodeSelects();
            this.redraw();
            App.updateRoutesList();
            App.updateResults();
            BundleUI.update();
            ConnectorUI.render();
        }
    }
};
