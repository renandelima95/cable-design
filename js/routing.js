// ========================================
// Routing Module - Dijkstra shortest path
// ========================================

const Routing = {
    findShortestPath(origin, destination) {
        const graph = {};

        AppState.connections.forEach(conn => {
            if (!graph[conn.from]) graph[conn.from] = [];
            if (!graph[conn.to]) graph[conn.to] = [];

            graph[conn.from].push({ node: conn.to, distance: conn.distance });
            graph[conn.to].push({ node: conn.from, distance: conn.distance });
        });

        if (!graph[origin]) {
            return { found: false, error: `Ponto de origem "${origin}" não tem conexões` };
        }
        if (!graph[destination]) {
            return { found: false, error: `Ponto de destino "${destination}" não tem conexões` };
        }

        const distances = {};
        const previous = {};
        const unvisited = new Set();

        for (const node in graph) {
            distances[node] = Infinity;
            previous[node] = null;
            unvisited.add(node);
        }
        distances[origin] = 0;

        while (unvisited.size > 0) {
            let current = null;
            let minDist = Infinity;
            for (const node of unvisited) {
                if (distances[node] < minDist) {
                    minDist = distances[node];
                    current = node;
                }
            }

            if (current === null || distances[current] === Infinity) break;
            if (current === destination) break;

            unvisited.delete(current);

            if (graph[current]) {
                for (const neighbor of graph[current]) {
                    const alt = distances[current] + neighbor.distance;
                    if (alt < distances[neighbor.node]) {
                        distances[neighbor.node] = alt;
                        previous[neighbor.node] = current;
                    }
                }
            }
        }

        if (distances[destination] === Infinity) {
            return { found: false, error: `Não há caminho entre "${origin}" e "${destination}"` };
        }

        const path = [];
        let current = destination;
        while (current !== null) {
            path.unshift(current);
            current = previous[current];
        }

        return { found: true, path: path, distance: distances[destination] };
    }
};
