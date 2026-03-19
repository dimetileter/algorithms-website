/* ============================================
   GRAPH BUILDER — İNŞAA MODU (graph-builder.js)
   Kullanıcının SVG üzerinde interaktif olarak
   node ve kenar ekleyip düzenlemesini sağlar.
   ============================================ */

const BuildMode = (() => {

    // ─── İÇSEL DURUM ──────────────────────────────────────────────────
    let _graph = null;          // Aktif Graph nesnesi
    let _activeTool = 'select'; // Seçili araç
    let _edgeSource = null;     // Kenar çizmek için seçilen ilk node
    let _dragNode = null;       // Sürüklenen node id'si
    let _dragOffset = { dx: 0, dy: 0 }; // Sürükleme ofseti
    let _isEnabled = false;     // Mod aktif mi?
    let _nodeCounter = 0;       // Otomatik node id sayacı

    // SVG ve yardımcı elementler
    const getSvg = () => document.getElementById('graph-svg');

    // ─── MOD YÖNETİMİ ─────────────────────────────────────────────────

    /** Build Mode'u etkinleştirir ve yeni bir boş graph oluşturur. */
    function enable() {
        _isEnabled = true;
        _graph = new Graph(false);
        _nodeCounter = 0;
        _edgeSource = null;

        // SVG'yi temizle ve Build Mode event'lerini bağla
        clearSvg();
        _bindSvgEvents();
        _setTool('select');
    }

    /** Build Mode'u devre dışı bırakır ve event'leri kaldırır. */
    function disable() {
        _isEnabled = false;
        _edgeSource = null;
        _removeTempLine();
        _unbindSvgEvents();
    }

    /** Tüm grafu ve SVG'yi temizler. */
    function reset() {
        _graph.clear();
        _nodeCounter = 0;
        _edgeSource = null;
        _removeTempLine();
        clearSvg();
    }

    /** Mevcut Graph nesnesini döndürür. */
    function getGraph() {
        return _graph;
    }

    // ─── SVG TEMİZLEME ────────────────────────────────────────────────

    /** SVG içindeki tüm kullanıcı çizimlerini temizler. */
    function clearSvg() {
        const svg = getSvg();
        while (svg.firstChild) svg.removeChild(svg.firstChild);
    }

    // ─── ARAÇ SEÇİMİ ──────────────────────────────────────────────────

    /** Toolbar butonlarını ve SVG cursor'ı aktif araca göre günceller. */
    function _setTool(tool) {
        _activeTool = tool;
        _edgeSource = null;
        _removeTempLine();

        // Toolbar buton vurgusunu güncelle
        document.querySelectorAll('.build-tool-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tool === tool);
        });

        // SVG cursor sınıflarını güncelle
        const svg = getSvg();
        svg.classList.remove('svg-cursor-addNode', 'svg-cursor-addEdge',
                             'svg-cursor-delete', 'svg-cursor-select');
        svg.classList.add(`svg-cursor-${tool}`);
    }

    // ─── SVG EVENT BAĞLAMA ────────────────────────────────────────────

    // Bağlı işlevleri dış kapsamda tut (unbind için)
    const _onSvgClick    = (e) => _handleSvgClick(e);
    const _onSvgMouseMove = (e) => _handleMouseMove(e);
    const _onSvgMouseUp   = (e) => _handleMouseUp(e);

    function _bindSvgEvents() {
        const svg = getSvg();
        svg.addEventListener('click',     _onSvgClick);
        svg.addEventListener('mousemove', _onSvgMouseMove);
        svg.addEventListener('mouseup',   _onSvgMouseUp);
    }

    function _unbindSvgEvents() {
        const svg = getSvg();
        svg.removeEventListener('click',     _onSvgClick);
        svg.removeEventListener('mousemove', _onSvgMouseMove);
        svg.removeEventListener('mouseup',   _onSvgMouseUp);
    }

    // ─── OLAY İŞLEYİCİLERİ ────────────────────────────────────────────

    /** SVG canvas'a tıklanma olayını araç tipine göre yönlendirir. */
    function _handleSvgClick(e) {
        // Node veya kenar elementine tık — node/edge handler'ları kendi içinde yönetir
        if (e.target !== getSvg() && e.target.tagName !== 'svg') return;
        if (_activeTool === 'addNode') {
            const pos = _svgPoint(e);
            _showNodeNamePopup(pos.x, pos.y);
        }
    }

    /** Node sürükleme sırasında SVG içindeki hareketi takip eder. */
    function _handleMouseMove(e) {
        if (_activeTool === 'addEdge' && _edgeSource) {
            const pos = _svgPoint(e);
            _updateTempLine(_edgeSource, pos.x, pos.y);
        }
        if (_dragNode && _activeTool === 'select') {
            const pos = _svgPoint(e);
            _moveNode(_dragNode, pos.x - _dragOffset.dx, pos.y - _dragOffset.dy);
        }
    }

    /** Mouse bırakıldığında sürüklemeyi sonlandırır. */
    function _handleMouseUp() {
        _dragNode = null;
    }

    // ─── NODE YÖNETİMİ ────────────────────────────────────────────────

    /** Kullanıcıdan node adı alarak SVG'ye yeni bir node ekler. */
    function _showNodeNamePopup(x, y) {
        _showPopup(
            'Yeni Node',
            '&#9711; Node adı girin',
            'text',
            '',
            'Ekle',
            (value) => {
                const label = value.trim();
                if (!label) return;
                // Aynı isimde node varsa uyar
                if (_graph.nodes[label]) {
                    _showWarningBanner(`"${label}" adında bir node zaten var!`);
                    return;
                }
                _graph.addNode(label, label, x, y);
                _renderNode(label);
                _updateNodeSelectors();
                _logToPanel(`Node eklendi: "${label}"`, 'add');
            }
        );
    }

    /** Graph ve SVG'den bir node ve bağlı kenarları siler. */
    function _deleteNode(id) {
        // SVG elementlerini temizle
        document.getElementById(`node-group-${id}`)?.remove();
        // Bu node'a bağlı kenarları SVG'den temizle
        const edges = _graph.getAllEdges();
        edges.forEach(e => {
            if (e.from === id || e.to === id) {
                document.getElementById(`edge-group-${e.from}-${e.to}`)?.remove();
                document.getElementById(`edge-group-${e.to}-${e.from}`)?.remove();
            }
        });
        _graph.removeNode(id);
        _updateNodeSelectors();
        _logToPanel(`Node silindi: "${id}"`, 'warning');
    }

    /** Node'u sürükle için hazırlar (mousedown). */
    function _startDrag(id, e) {
        if (_activeTool !== 'select') return;
        e.stopPropagation();
        _dragNode = id;
        const pos = _svgPoint(e);
        const node = _graph.nodes[id];
        _dragOffset = { dx: pos.x - node.x, dy: pos.y - node.y };
    }

    /** Node'un SVG konumunu ve Graph verisini senkronize günceller. */
    function _moveNode(id, x, y) {
        _graph.nodes[id].x = x;
        _graph.nodes[id].y = y;

        // Node grubunu taşı
        const group = document.getElementById(`node-group-${id}`);
        const circle = document.getElementById(`node-${id}`);
        const text = group?.querySelector('text');

        if (circle) { circle.setAttribute('cx', x); circle.setAttribute('cy', y); }
        if (text)   { text.setAttribute('x', x);    text.setAttribute('y', y); }

        // Bağlı kenarları güncelle
        _graph.getAllEdges().forEach(e => {
            if (e.from === id || e.to === id) {
                _repositionEdge(e.from, e.to);
            }
        });
    }

    // ─── KENAR YÖNETİMİ ───────────────────────────────────────────────

    /** Kenar çizimi için birinci node'u seçer veya ikinci node seçilince ağırlık popup'ı açar. */
    function _handleEdgeNodeClick(id, e) {
        e.stopPropagation();
        if (_activeTool !== 'addEdge') return;

        if (!_edgeSource) {
            // İlk node seçildi — geçici çizgi başlat
            _edgeSource = id;
            document.getElementById(`node-${id}`).style.stroke = '#007AFF';
            document.getElementById(`node-${id}`).style.strokeWidth = '5';
        } else if (_edgeSource === id) {
            // Aynı node'a iki kez tıklandı — iptal
            _cancelEdgeSource();
        } else {
            // İkinci node seçildi — ağırlık sor
            const from = _edgeSource;
            const to = id;
            _cancelEdgeSource();
            _showEdgeWeightPopup(from, to);
        }
    }

    /** Seçilen kaynak node'un vurgusunu ve geçici çizgiyi temizler. */
    function _cancelEdgeSource() {
        if (_edgeSource) {
            const circle = document.getElementById(`node-${_edgeSource}`);
            if (circle) {
                circle.style.stroke = 'var(--accent-color)';
                circle.style.strokeWidth = '3';
            }
        }
        _edgeSource = null;
        _removeTempLine();
    }

    /** Kenar ağırlığı için popup gösterir ve onaylanınca kenar ekler. */
    function _showEdgeWeightPopup(from, to) {
        // İki node arasında zaten kenar var mı?
        const exists = _graph.getNeighbors(from).some(n => n.to === to);
        if (exists) {
            _showWarningBanner(`"${from}" — "${to}" arasında zaten bir kenar var!`);
            return;
        }
        _showPopup(
            `Kenar: ${from} → ${to}`,
            '&#8604; Kenar ağırlığı girin',
            'number',
            '1',
            'Ekle',
            (value) => {
                const weight = parseFloat(value) || 1;
                _graph.addEdge(from, to, weight);
                _renderEdge(from, to, weight);
                _logToPanel(`Kenar eklendi: ${from} — ${to} (ağırlık: ${weight})`, 'add');
            }
        );
    }

    /** Bir kenarı SVG ve Graph'tan siler. */
    function _deleteEdge(from, to) {
        document.getElementById(`edge-group-${from}-${to}`)?.remove();
        document.getElementById(`edge-group-${to}-${from}`)?.remove();
        _graph.removeEdge(from, to);
        _logToPanel(`Kenar silindi: ${from} — ${to}`, 'warning');
    }

    // ─── GEÇICI ÇİZGİ (Kenar Çizimi Sırasında) ───────────────────────

    /** Kenar çizim sırasında mouse ile birlikte hareket eden geçici çizgiyi çizer/günceller. */
    function _updateTempLine(fromId, toX, toY) {
        const svg = getSvg();
        const from = _graph.nodes[fromId];
        let line = document.getElementById('temp-edge-line');
        if (!line) {
            line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('id', 'temp-edge-line');
            line.style.stroke = 'var(--accent-color)';
            line.style.strokeWidth = '2';
            line.style.strokeDasharray = '6 4';
            line.style.opacity = '0.7';
            line.style.pointerEvents = 'none';
            svg.insertBefore(line, svg.firstChild); // En arkaya
        }
        line.setAttribute('x1', from.x);
        line.setAttribute('y1', from.y);
        line.setAttribute('x2', toX);
        line.setAttribute('y2', toY);
    }

    /** Geçici çizgiyi SVG'den kaldırır. */
    function _removeTempLine() {
        document.getElementById('temp-edge-line')?.remove();
    }

    // ─── SVG RENDER ───────────────────────────────────────────────────

    /** Yeni bir node'u SVG'ye çizer. */
    function _renderNode(id) {
        const svg = getSvg();
        const node = _graph.nodes[id];

        const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        group.setAttribute('id', `node-group-${id}`);
        group.style.cursor = 'grab';

        // Daire
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', node.x);
        circle.setAttribute('cy', node.y);
        circle.setAttribute('r', 22);
        circle.setAttribute('id', `node-${id}`);
        circle.style.fill = 'var(--bg-primary)';
        circle.style.stroke = 'var(--accent-color)';
        circle.style.strokeWidth = '3';
        circle.style.transition = 'all 0.2s ease';

        // Etiket
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', node.x);
        text.setAttribute('y', node.y);
        text.setAttribute('alignment-baseline', 'middle');
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('fill', 'var(--text-primary)');
        text.setAttribute('font-weight', 'bold');
        text.setAttribute('font-size', '13px');
        text.style.pointerEvents = 'none';
        text.textContent = node.label;

        group.appendChild(circle);
        group.appendChild(text);
        svg.appendChild(group);

        // Olayları bağla
        group.addEventListener('mousedown', (e) => _startDrag(id, e));
        group.addEventListener('click', (e) => {
            if (_activeTool === 'addEdge') { _handleEdgeNodeClick(id, e); return; }
            if (_activeTool === 'delete')  { e.stopPropagation(); _deleteNode(id); }
        });
    }

    /** İki node arasındaki kenarı ve ağırlık etiketini SVG'ye çizer. */
    function _renderEdge(from, to, weight) {
        const svg = getSvg();
        const fNode = _graph.nodes[from];
        const tNode = _graph.nodes[to];

        const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        group.setAttribute('id', `edge-group-${from}-${to}`);

        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', fNode.x); line.setAttribute('y1', fNode.y);
        line.setAttribute('x2', tNode.x); line.setAttribute('y2', tNode.y);
        line.setAttribute('id', `edge-${from}-${to}`);
        line.style.stroke = 'var(--text-secondary)';
        line.style.strokeWidth = '3';
        line.style.transition = 'stroke 0.3s ease, stroke-width 0.3s ease';
        line.style.cursor = 'pointer';

        const mx = (fNode.x + tNode.x) / 2;
        const my = (fNode.y + tNode.y) / 2 - 12;
        const wText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        wText.setAttribute('id', `edge-weight-${from}-${to}`);
        wText.setAttribute('x', mx); wText.setAttribute('y', my);
        wText.setAttribute('text-anchor', 'middle');
        wText.setAttribute('fill', 'var(--text-secondary)');
        wText.setAttribute('font-weight', '600');
        wText.setAttribute('font-size', '14px');
        wText.style.pointerEvents = 'none';
        wText.textContent = weight;

        group.appendChild(line);
        group.appendChild(wText);

        // Kenarları node gruplarının önüne, ama arkasına ekle
        const firstNodeGroup = document.getElementById(`node-group-${from}`);
        svg.insertBefore(group, firstNodeGroup);

        // Kenar silme için tık olayı
        line.addEventListener('click', (e) => {
            if (_activeTool === 'delete') { e.stopPropagation(); _deleteEdge(from, to); }
        });
    }

    /** Node taşındığında bağlı kenar çizgisini ve ağırlık etiketini günceller. */
    function _repositionEdge(from, to) {
        const fNode = _graph.nodes[from];
        const tNode = _graph.nodes[to];
        if (!fNode || !tNode) return;

        // İki yönden birini dene
        let line = document.getElementById(`edge-${from}-${to}`) ||
                   document.getElementById(`edge-${to}-${from}`);
        let wText = document.getElementById(`edge-weight-${from}-${to}`) ||
                    document.getElementById(`edge-weight-${to}-${from}`);

        if (line) {
            line.setAttribute('x1', fNode.x); line.setAttribute('y1', fNode.y);
            line.setAttribute('x2', tNode.x); line.setAttribute('y2', tNode.y);
        }
        if (wText) {
            wText.setAttribute('x', (fNode.x + tNode.x) / 2);
            wText.setAttribute('y', (fNode.y + tNode.y) / 2 - 12);
        }
    }

    // ─── POPUP ────────────────────────────────────────────────────────

    /**
     * Genel amaçlı input popup'ı gösterir.
     * @param {string} title - Popup başlığı
     * @param {string} label - Input etiketi
     * @param {string} inputType - 'text' veya 'number'
     * @param {string} defaultValue - Varsayılan input değeri
     * @param {string} confirmText - Onay butonu metni
     * @param {function} onConfirm - Onaylandığında çağrılacak callback(value)
     */
    function _showPopup(title, label, inputType, defaultValue, confirmText, onConfirm) {
        // Var olan popup varsa kaldır
        document.getElementById('build-popup-overlay')?.remove();

        const overlay = document.createElement('div');
        overlay.id = 'build-popup-overlay';
        overlay.innerHTML = `
            <div class="build-popup">
                <h4>${title}</h4>
                <p style="font-size:0.85rem; color:var(--text-secondary); margin:0 0 10px 0;">${label}</p>
                <input type="${inputType}" id="build-popup-input" value="${defaultValue}" autocomplete="off" />
                <div class="build-popup-actions">
                    <button class="popup-btn-cancel" id="popup-cancel">İptal</button>
                    <button class="popup-btn-confirm" id="popup-confirm">${confirmText}</button>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);

        const input = document.getElementById('build-popup-input');
        input.focus();
        input.select();

        // Olay bağlanti
        const confirm = () => {
            onConfirm(input.value);
            overlay.remove();
        };
        const cancel = () => overlay.remove();

        document.getElementById('popup-confirm').addEventListener('click', confirm);
        document.getElementById('popup-cancel').addEventListener('click', cancel);
        overlay.addEventListener('click', (e) => { if (e.target === overlay) cancel(); });
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') confirm();
            if (e.key === 'Escape') cancel();
        });
    }

    // ─── UYARI BANNER'I ───────────────────────────────────────────────

    /** Visualization panelinde geçici bir uyarı mesajı gösterir. */
    function _showWarningBanner(message) {
        document.getElementById('warning-banner')?.remove();
        const banner = document.createElement('div');
        banner.id = 'warning-banner';
        banner.textContent = message;
        document.querySelector('.visualization-panel').appendChild(banner);
        setTimeout(() => banner.remove(), 3000);
    }

    // ─── DROPDOWN GÜNCELLEME ──────────────────────────────────────────

    /** Başlangıç/bitiş dropdown'larını mevcut node'larla doldurur. */
    function _updateNodeSelectors() {
        const nodeIds = _graph.getNodeIds();
        const startSel = document.getElementById('start-node-select');
        const endSel   = document.getElementById('end-node-select');
        if (!startSel || !endSel) return;

        const buildOptions = () => {
            let html = '<option value="">Başlangıç...</option>';
            nodeIds.forEach(id => { html += `<option value="${id}">${id}</option>`; });
            return html;
        };
        startSel.innerHTML = buildOptions().replace('Başlangıç...', 'Başlangıç...');
        endSel.innerHTML   = buildOptions().replace('Başlangıç...', 'Bitiş...');
        endSel.querySelector('option').textContent = 'Bitiş...';
    }

    // ─── LOG ──────────────────────────────────────────────────────────

    /** Sağ paneldeki log kutusuna mesaj ekler. */
    function _logToPanel(text, type = 'add') {
        const container = document.getElementById('log-container');
        if (!container) return;
        const div = document.createElement('div');
        div.textContent = text;
        div.className = `log-line log-type-${type}`;
        container.appendChild(div);
        container.scrollTop = container.scrollHeight;
    }

    // ─── SVG KOORDİNAT DÖNÜŞÜMÜ ──────────────────────────────────────

    /** Sayfa koordinatlarını SVG viewBox koordinatına çevirir. */
    function _svgPoint(e) {
        const svg = getSvg();
        const pt = svg.createSVGPoint();
        pt.x = e.clientX;
        pt.y = e.clientY;
        return pt.matrixTransform(svg.getScreenCTM().inverse());
    }

    // ─── PUBLIC API ───────────────────────────────────────────────────
    return { enable, disable, reset, getGraph, clearSvg, setTool: _setTool };

})();
