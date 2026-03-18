/* ============================================
   ANA UYGULAMA MANTIĞI & YÖNLENDİRME (app.js)
   Dashboard etkileşimleri ve algoritma sayfasına geçiş
   ============================================ */

const AppManager = {
    init: function() {
        // Dashboard'daki algoritma kartlarını seç
        const cards = document.querySelectorAll('.algorithm-card');
        
        // Her bir karta tıklama olayı ekle
        cards.forEach(card => {
            card.addEventListener('click', () => {
                const algorithmId = card.getAttribute('data-algorithm');
                if (algorithmId) {
                    // Algoritma sayfasına route et, parametre olarak algoritma ID'sini gönder
                    // Not: Github Pages vs için path kök dizin kontrolü gerekebilir, 
                    // göreceli olarak pages/algorithm.html'e gidiyoruz.
                    window.location.href = `pages/algorithm.html?algo=${algorithmId}`;
                }
            });
            
            // İmleci pointer yap (CSS'te yoksa diye)
            card.style.cursor = 'pointer';
        });
    }
};

document.addEventListener('DOMContentLoaded', () => {
    AppManager.init();
});
