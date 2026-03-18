/* ============================================
   BELLMAN-FORD ALGORİTMASI (bellman-ford.js)
   Ağırlıklı (ve negatif ağırlıklı) graflarda en kısa yol bulur.
   Bağımlılıklar: Graph (structures/graph.js)
   ============================================ */

const BellmanFord = {

    /**
     * Bellman-Ford algoritmasını çalıştırır.
     * Hem sonucu hem de görselleştirici için adım listesini döndürür.
     *
     * @param {Graph}  graph     - Üzerinde çalışılacak graf
     * @param {string} startId   - Başlangıç node id'si
     * @param {string} endId     - Bitiş node id'si (opsiyonel)
     * @returns {{ shortestPath, totalDistance, distances, steps, hasNegativeCycle }}
     */
    run(graph, startId, endId = null) {

        if (!graph.nodes[startId]) {
            console.error(`Bellman-Ford Hatası: '${startId}' node bulunamadı.`);
            return null;
        }

        const nodeIds = graph.getNodeIds();
        const edges = graph.getAllEdges();

        const distances = {};
        const previous = {};
        const steps = [];

        // Başlangıç durumu
        for (const id of nodeIds) {
            distances[id] = Infinity;
            previous[id] = null;
        }
        distances[startId] = 0;

        steps.push({
            type: 'init',
            activeNode: startId,
            activeEdge: null,
            visitedNodes: [startId],
            distances: { ...distances },
            description: `Başlangıç: Bütün mesafeler sonsuz, başlangıç node '${startId}' mesafesi 0 yapıldı.`
        });

        const V = nodeIds.length;
        let hasNegativeCycle = false;

        // V-1 kez tüm kenarları gevşet (relax)
        for (let i = 1; i <= V - 1; i++) {
            let anyUpdate = false;

            steps.push({
                type: 'visit', // İterasyon başı
                activeNode: null,
                activeEdge: null,
                visitedNodes: [],
                distances: { ...distances },
                description: `İterasyon ${i}/${V - 1} başlıyor.`
            });

            for (const edge of edges) {
                const u = edge.from;
                const v = edge.to;
                const weight = edge.weight;

                if (distances[u] !== Infinity && distances[u] + weight < distances[v]) {
                    distances[v] = distances[u] + weight;
                    previous[v] = u;
                    anyUpdate = true;

                    steps.push({
                        type: 'relax',
                        activeNode: v,
                        activeEdge: edge,
                        visitedNodes: [],
                        distances: { ...distances },
                        description: `'${u}' üzerinden '${v}' node'una daha kısa bir yol bulundu. Yeni mesafe: ${distances[v]}`
                    });
                }
            }

            // Eğer bu iterasyonda hiçbir mesafe güncellenmediyse, daha fazla iterasyona gerek yok
            if (!anyUpdate) {
                steps.push({
                    type: 'info',
                    activeNode: null,
                    activeEdge: null,
                    visitedNodes: [],
                    distances: { ...distances },
                    description: `İterasyon ${i}'de hiçbir mesafe güncellenmedi, erken bitiriliyor.`
                });
                break;
            }
        }

        // Negatif döngü (Negative Cycle) kontrolü (V. iterasyon)
        for (const edge of edges) {
            const u = edge.from;
            const v = edge.to;
            const weight = edge.weight;

            if (distances[u] !== Infinity && distances[u] + weight < distances[v]) {
                hasNegativeCycle = true;
                steps.push({
                    type: 'error',
                    activeNode: v,
                    activeEdge: edge,
                    visitedNodes: [],
                    distances: { ...distances },
                    description: `DİKKAT! Graf üzerinde negatif ağırlıklı bir döngü tespit edildi. Kenar: '${u}' -> '${v}'`
                });
                break; // Bir tane bulmak yeterli
            }
        }

        let shortestPath = [];
        let totalDistance = Infinity;

        // Eğer bitiş hedefi verilmişse yolu bul
        if (endId && distances[endId] !== Infinity && !hasNegativeCycle) {
            let curr = endId;
            while (curr !== null) {
                shortestPath.unshift(curr);
                curr = previous[curr];
            }
            totalDistance = distances[endId];
        }

        steps.push({
            type: 'finish',
            activeNode: endId || null,
            activeEdge: null,
            visitedNodes: nodeIds.filter(n => distances[n] !== Infinity),
            distances: { ...distances },
            description: hasNegativeCycle 
                ? `Algoritma tamamlandı fakat graf negatif döngü içeriyor. Çıkan sonuçlar hatalı olabilir.`
                : `Algoritma başarıyla tamamlandı.`
        });

        return {
            shortestPath,
            totalDistance,
            distances,
            steps,
            hasNegativeCycle
        };
    }
};

// Tarayıcı için global değişkene ata
if (typeof window !== 'undefined') {
    window.BellmanFord = BellmanFord;
}
