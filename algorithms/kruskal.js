/* ============================================
   KRUSKAL ALGORİTMASI (kruskal.js)
   Minimum Spanning Tree (MST) - En Küçük Örten Ağaç bulur.
   Disjoint Set (Union-Find) yapısı inline (dahili) olarak kodlanmıştır.
   Bağımlılıklar: Graph (structures/graph.js)
   ============================================ */
const Kruskal = {
    run(graph) {
        const nodeIds = graph.getNodeIds();
        if (nodeIds.length === 0) return null;

        const allEdges = graph.getAllEdges();
        const steps = [];
        
        // Kenarları ağırlığa göre küçükten büyüğe sırala
        allEdges.sort((a, b) => a.weight - b.weight);

        steps.push({
            type: 'init',
            visitedNodes: [],
            description: `Kruskal başlatıldı. Tüm kenarlar ağırlıklarına göre sıralandı.`
        });

        // --- INLINE DISJOINT SET (UNION-FIND) ---
        const parent = {};
        const rank = {};
        
        for (const id of nodeIds) {
            parent[id] = id;
            rank[id] = 0;
        }

        function find(i) {
            if (parent[i] === i) return i;
            return parent[i] = find(parent[i]); // Path compression
        }

        function union(i, j) {
            const rootI = find(i);
            const rootJ = find(j);

            if (rootI !== rootJ) {
                if (rank[rootI] < rank[rootJ]) {
                    parent[rootI] = rootJ;
                } else if (rank[rootI] > rank[rootJ]) {
                    parent[rootJ] = rootI;
                } else {
                    parent[rootJ] = rootI;
                    rank[rootI]++;
                }
                return true;
            }
            return false;
        }
        // ----------------------------------------

        const mstEdges = [];
        let totalWeight = 0;
        const visitedNodes = new Set();

        for (const edge of allEdges) {
            const u = edge.from;
            const v = edge.to;

            steps.push({
                type: 'visit',
                activeEdge: edge,
                visitedNodes: [...visitedNodes],
                description: `'${u}' - '${v}' (W: ${edge.weight}) kenarı kontrol ediliyor.`
            });

            const rootU = find(u);
            const rootV = find(v);

            if (rootU !== rootV) {
                // Döngü oluşturmaz, kenarı kabul et
                union(u, v);
                mstEdges.push(edge);
                totalWeight += edge.weight;
                visitedNodes.add(u);
                visitedNodes.add(v);

                steps.push({
                    type: 'relax',
                    activeEdge: edge,
                    visitedNodes: [...visitedNodes],
                    description: `Kenar kabul edildi: Ağaca eklendi. Güncel MST Ağırlığı: ${totalWeight}`
                });

                // Ağaç tamamlandıysa (V-1 kenar) erken çıkış yapılabilir
                if (mstEdges.length === nodeIds.length - 1) {
                    break;
                }
            } else {
                 steps.push({
                    type: 'info',
                    activeEdge: edge,
                    visitedNodes: [...visitedNodes],
                    description: `Reddedildi: Döngü oluşturuyor.`
                });
            }
        }

        steps.push({
            type: 'finish',
            visitedNodes: [...visitedNodes],
            description: `Kruskal tamamlandı. MST Toplam Ağırlığı: ${totalWeight}`
        });

        return {
            mstEdges,
            totalWeight,
            steps
        };
    }
};

if (typeof window !== 'undefined') {
    window.Kruskal = Kruskal;
}
