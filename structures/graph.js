/* ============================================
   GRAPH VERİ YAPISI (graph.js)
   Tüm algoritmaların kullandığı ortak Graph sınıfı.
   Yönlü veya yönsüz, ağırlıklı veya ağırlıksız grafları destekler.
   ============================================ */

class Graph {

    /**
     * Yeni bir Graph oluşturur.
     * @param {boolean} directed - true ise yönlü graf, false ise yönsüz
     */
    constructor(directed = false) {
        this.directed = directed;

        // { nodeId: { label, x, y } }
        this.nodes = {};

        // { nodeId: [ { to, weight } ] }
        this.adjacencyList = {};
    }

    // ─── NODE YÖNETİMİ ───────────────────────────────────────────────

    /**
     * Grafa yeni bir node ekler.
     * @param {string} id     - Benzersiz node kimliği (örn. 'A', '1')
     * @param {string} label  - Görsel etiket (id ile aynı olabilir)
     * @param {number} x      - Tuval üzerindeki x konumu (opsiyonel)
     * @param {number} y      - Tuval üzerindeki y konumu (opsiyonel)
     */
    addNode(id, label = id, x = 0, y = 0) {
        // Aynı id'li node zaten varsa ekleme
        if (this.nodes[id]) return;

        this.nodes[id] = { label, x, y };
        this.adjacencyList[id] = [];
    }

    /**
     * Graftan bir node ve ona bağlı tüm kenarları kaldırır.
     * @param {string} id - Kaldırılacak node'un id'si
     */
    removeNode(id) {
        delete this.nodes[id];
        delete this.adjacencyList[id];

        // Bu node'a gelen tüm kenarları da temizle
        for (const nodeId in this.adjacencyList) {
            this.adjacencyList[nodeId] = this.adjacencyList[nodeId]
                .filter(edge => edge.to !== id);
        }
    }

    // ─── KENAR YÖNETİMİ ──────────────────────────────────────────────

    /**
     * İki node arasına kenar ekler.
     * @param {string} from   - Başlangıç node id'si
     * @param {string} to     - Bitiş node id'si
     * @param {number} weight - Kenar ağırlığı (varsayılan 1)
     */
    addEdge(from, to, weight = 1) {
        // Node'lar yoksa otomatik ekle
        if (!this.nodes[from]) this.addNode(from);
        if (!this.nodes[to])   this.addNode(to);

        this.adjacencyList[from].push({ to, weight });

        // Yönsüz grafta karşı yönü de ekle
        if (!this.directed) {
            this.adjacencyList[to].push({ to: from, weight });
        }
    }

    /**
     * İki node arasındaki kenarı kaldırır.
     * @param {string} from - Başlangıç node id'si
     * @param {string} to   - Bitiş node id'si
     */
    removeEdge(from, to) {
        this.adjacencyList[from] = this.adjacencyList[from]
            .filter(edge => edge.to !== to);

        if (!this.directed) {
            this.adjacencyList[to] = this.adjacencyList[to]
                .filter(edge => edge.to !== from);
        }
    }

    // ─── SORGULAMA ────────────────────────────────────────────────────

    /**
     * Bir node'un komşularını döndürür.
     * @param {string} nodeId - Sorgulanacak node id'si
     * @returns {Array} [ { to, weight } ]
     */
    getNeighbors(nodeId) {
        return this.adjacencyList[nodeId] || [];
    }

    /**
     * Graftaki tüm kenarları döndürür.
     * @returns {Array} [ { from, to, weight } ]
     */
    getAllEdges() {
        const edges = [];
        for (const from in this.adjacencyList) {
            for (const edge of this.adjacencyList[from]) {
                edges.push({ from, to: edge.to, weight: edge.weight });
            }
        }
        return edges;
    }

    /**
     * Graftaki tüm node id'lerini dizi olarak döndürür.
     * @returns {string[]}
     */
    getNodeIds() {
        return Object.keys(this.nodes);
    }

    /**
     * Graf boşsa true döndürür.
     * @returns {boolean}
     */
    isEmpty() {
        return Object.keys(this.nodes).length === 0;
    }

    /**
     * Grafı sıfırlar — tüm node ve kenarları temizler.
     */
    clear() {
        this.nodes = {};
        this.adjacencyList = {};
    }
}
