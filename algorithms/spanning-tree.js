/* ============================================
   SPANNING TREE ALGORİTMASI (spanning-tree.js)
   Grafın tüm bağlanabilir düğümlerini kapsayan (döngüsüz) bir ağaç oluşturur.
   Bağımlılıklar: Graph (structures/graph.js)
   ============================================ */
const SpanningTree = {
    // DFS tabanlı bir spanning tree
    run(graph, startId) {
        if (!graph.nodes[startId]) return null;

        const visited = new Set();
        const edges = [];
        const steps = [];

        steps.push({
            type: 'init',
            activeNode: startId,
            visitedNodes: [],
            description: `Ağaç oluşturulmaya '${startId}' düğümünden başlanıyor.`
        });

        const stack = [{ node: startId, parent: null }];

        while (stack.length > 0) {
            const { node: currentId, parent } = stack.pop();

            if (!visited.has(currentId)) {
                visited.add(currentId);

                if (parent !== null) {
                    // Bulduğumuz yol ağaca ait
                    const weight = graph.adjacencyList[parent].find(e => e.to === currentId).weight;
                    edges.push({ from: parent, to: currentId, weight });

                    steps.push({
                        type: 'relax',
                        activeNode: currentId,
                        activeEdge: { from: parent, to: currentId, weight },
                        visitedNodes: [...visited],
                        description: `'${currentId}' düğümü ziyaret edildi, '${parent}' üzerinden ağaca eklendi.`
                    });
                } else {
                    steps.push({
                        type: 'visit',
                        activeNode: currentId,
                        visitedNodes: [...visited],
                        description: `Başlangıç düğümü '${currentId}' ziyaret edildi.`
                    });
                }

                const neighbors = graph.getNeighbors(currentId);
                // Tersten eklenir ki DFS alfabetik gitmesi daha doğal görünsün (isteğe bağlı)
                for (let i = neighbors.length - 1; i >= 0; i--) {
                    const neighbor = neighbors[i];
                    if (!visited.has(neighbor.to)) {
                        stack.push({ node: neighbor.to, parent: currentId });
                    }
                }
            }
        }

        steps.push({
            type: 'finish',
            visitedNodes: [...visited],
            description: `Spanning Tree işlemi tamamlandı. Toplam ${edges.length} kenar seçildi.`
        });

        return {
            treeEdges: edges,
            steps
        };
    }
};

if (typeof window !== 'undefined') {
    window.SpanningTree = SpanningTree;
}
