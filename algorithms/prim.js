/* ============================================
   PRIM ALGORİTMASI (prim.js)
   Minimum Spanning Tree (MST) - En Küçük Örten Ağaç bulur.
   Bağımlılıklar: Graph (structures/graph.js), PriorityQueue (structures/priority-queue.js)
   ============================================ */
const Prim = {
    run(graph, startId) {
        if (!graph.nodes[startId]) return null;

        const nodeIds = graph.getNodeIds();
        const steps = [];
        
        const visited = new Set();
        const mstEdges = [];
        let totalWeight = 0;

        // Custom Priority Queue for Edges: Store { from, to, weight }
        // The existing PriorityQueue class stores (value, priority).
        // We can enqueue edge objects as value, and edge.weight as priority.
        const pq = new PriorityQueue();

        visited.add(startId);

        steps.push({
            type: 'init',
            activeNode: startId,
            visitedNodes: [startId],
            description: `Prim başlatıldı: Başlangıç noktası '${startId}'.`
        });

        // Başlangıç düğümünün tüm kenarlarını kuyruğa ekle
        for (const neighbor of graph.getNeighbors(startId)) {
            pq.enqueue({ from: startId, to: neighbor.to, weight: neighbor.weight }, neighbor.weight);
        }

        while (!pq.isEmpty() && visited.size < nodeIds.length) {
            const { value: edge, priority: currentWeight } = pq.dequeue();
            const { from, to, weight } = edge;

            steps.push({
                type: 'visit',
                activeEdge: edge,
                visitedNodes: [...visited],
                description: `'${from}' ile '${to}' arasındaki en küçük öncelikli kenar (W: ${weight}) kontrol ediliyor.`
            });

            if (!visited.has(to)) {
                // Döngü yapmıyor, eklenebilir
                visited.add(to);
                mstEdges.push(edge);
                totalWeight += weight;

                steps.push({
                    type: 'relax',
                    activeNode: to,
                    activeEdge: edge,
                    visitedNodes: [...visited],
                    description: `Kenar MST'ye kabul edildi: '${to}' eklendi. Yeni Toplam: ${totalWeight}`
                });

                // Yeni eklenen düğümün komşularını (kuyruğa eklenmemişse/ziyaret edilmemişse) ekle
                for (const neighbor of graph.getNeighbors(to)) {
                    if (!visited.has(neighbor.to)) {
                        pq.enqueue({ from: to, to: neighbor.to, weight: neighbor.weight }, neighbor.weight);
                    }
                }
            } else {
                steps.push({
                    type: 'info',
                    activeEdge: edge,
                    visitedNodes: [...visited],
                    description: `'${to}' düğümü zaten ağaçta bulunduğu için kenar reddediliyor.`
                });
            }
        }

        steps.push({
            type: 'finish',
            visitedNodes: [...visited],
            description: `Prim algoritması tamamlandı. MST Toplam Ağırlığı: ${totalWeight}`
        });

        return {
            mstEdges,
            totalWeight,
            steps
        };
    }
}

if (typeof window !== 'undefined') {
    window.Prim = Prim;
}
