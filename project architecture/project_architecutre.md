## Yapay Zeka Ajanı için Önemli NOT!
- Bu projenin genel yaısı ve istenler açıklanmıştır. Ancak hiçbir adım sorulmadan, anlaşılmadan ve onay alınmadan yazılmaya başlanmayacaktır. Öncelikle proje yapısı kurgulanacak, bu yapı bana sorulacak (zaten beraber kurgulyor olacağız) daha sonra koda dökülecek. Büyük parçalar her daim küçük alt adımlara bölünerek ilerlenecek. Tüm sayfa/sayfalar bir anda kodlanmaya başlanmayacak. Her bir sayfa, her bir modül, her bir fonksiyon ayrı ayrı ele alınacak ve onay alındıktan sonra devam edilecek.

## Proje Mimarisi

1- Proje için HTML, CSS ve JavaScript kullanılmasını planlamaktayım. Gerekli görülmesi halinde React Native kullanılabilir.

2- Proje dosyaları backend, algorithms, frontend şeklinde klasörlere ayrılmış modüler bir yapıda olmalı. Bu klasörlerin farklı versiyonalrı da (database, structures, components, pages, etc.) olabilir.

3- Proje kesinlikle "Clean Code" prensiplerine uygun yazılmalı. Gereksiz kodlardan kaçınılmalı, kodlar temiz, anlaşılır ve düzenli olmalı. Kod blokları yorum satırları içermeli ve bu yorum satırları temiz, kısa, öz şekilde komutu açıklamalı. Karmaşık, uzun satırlı kod bloklarına yer verilmemeli.

### Ödevden Bağımsız Olarak:
1- Proje daha sonra içerik eklenebilmesine olanak tanıyan ve güncellenebilir bir frontend tasarımına sahip olmalıdır. Öyleki ileride verilecek ödevleri aynı web sitesine eklemek son derece kolay olmalı.

2- Görselleştirilmesi yapılan algoritmanın çalışma anındaki hızı ayarlanabilir olmalı.

3- Kullanılan frontend teknolojisi esnek ve interaktif bir tasarıma sahip olmalı.

## Kurallar
- Yorum satırları Türkçe olacak
- Her fonksiyonun üzerine ne yaptığı kısaca yazılacak
- Hata ve log mesajları Türkçe olacak
- Modülerlik olarak test edilebilirlik esnek olmalı

# Projeden Neye Benzemeli
- Temiz bir web arayüzü istiyorum. Arayüz mimarisi Apple'ın tasarım pattern'lerine yakın olsun.
- Sitenin gece ve gündüz modu olacak.
- Ana sayfada algoritmaları gösteren dahsboard'lar olacak. Her dashboard üzerinde ilgili algoritmanın ufak bir gösrseli olacak. Bu görsel basti "loop" bir animasyona sahip olabilir. Her algoritmanın kendi sayfasına gidilince üst tarafta bir menü belirecek. Bu menüde  diğer algoritmalara hızlı erişim yapılabilecek. Geri ve ana menüye dönmek için sol tarafta butonlar yer alacak. Sağ tarafta bir arama kutucuğu yer alacak. Üzerine tıklanınca kutucuk sola doğru uzayarak arama çubuğuna dönüşecek. Hızlı bir şekilde farklı algoritmaları aramaya yarayacak.
- Her algoritmanın kendi sayfasında algoritmanın ne işe yaradığı, nasıl çalıştığı, zaman ve mekan karmaşıklığı gibi bilgiler yer alacak.
- Algoritmanın sayfasında, algoritmalar çalışırken sağ taraftaki alanda adım adım eldeki durumun ne olduğunu gösteren bir akış şeması bulunacak. Böylelikle Graph gibi yapılarda arama yapılırken sağ tarafta bir tablo (ya da benzer farklı bir yapıda) kaçıncı döngüde olduğumuz, hangi nodu ziyaret ettiğimiz, hangi nodu ziyaret etmediğimiz gibi bilgiler yer alacak.
-"İnşaa Modu" gibi bir mod olmasını istiyorum. Bu modda kullanıcı istediği gibi nodlar (Node'lara isim verilebilecek) ve kenarlar (kenarlara ağırlık verilebilecek) ekleyerek kendi graph'ını oluşturabilecek. Ardından bu graph üzerinde istediği algoritmaları çalıştırabilecek. Eğer bir algoritmanın çalışması için özel bir durum gerekiyorsa (örneğin Dijkstra için başlangıç ve bitiş nodu seçimi gibi) bu durumlar için özel alanlar bulunacak. Eğer bu alanlar seçilmezse kullanıcıya uyarı gösterliecek.
