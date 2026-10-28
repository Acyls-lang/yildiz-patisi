# Yıldız Patisi

Yıldız Patisi, öğrenme amacıyla hazırlanmış, tarayıcıda çalışan sade bir görev ve ilerleme uygulamasıdır. Gece göğü ve piksel oyunlarından esinlenen özgün görünümünde görevlerini tamamladıkça yıldız bahçen gelişir.

## Özellikler

- Görev ekleme; boş ve yalnızca boşluk içeren metinleri reddetme
- Görevleri tamamlandı olarak işaretleme veya yeniden aktifleştirme
- Görev silme ve tamamlanmış görevleri topluca temizleme
- Tümü, Aktif ve Tamamlananlar filtreleri
- Kalan aktif görev sayacı
- Yan menüden Görevler, Yıldız Bahçem ve Profilim sayfalarına geçiş
- Tamamlanan görevlerle yıldız kazanma; bahçenin tohumdan çiçekli bir alana aşamalı büyümesi
- Görev ve toplam ilerleme verilerini sayfa yenilendikten sonra da koruma
- Telefon ve masaüstüne uyumlu görünüm, klavye odağı ve azaltılmış hareket desteği
- Kullanıcı metnini HTML olarak çalıştırmadan güvenli biçimde gösterme

## Dosyalar

- `index.html`: Sayfa yapısı, yan gezinme, görevler, bahçe ve profil ekranları
- `style.css`: Renkler, düzen, duyarlı tasarım ve küçük animasyonlar
- `script.js`: Görev işlemleri, sayfa geçişi ve ilerleme hesabı
- `.gitignore`: İşletim sistemi ve editör geçici dosyalarının Git dışında tutulması

## Çalıştırma

Kurulum veya derleme gerekmez. `index.html` dosyasına çift tıklayıp güncel bir web tarayıcısında açın.

## localStorage kullanımı

Görev listesi `yildiz-patisi-tasks` anahtarıyla, toplam tamamlanma ilerlemesi ise `yildiz-patisi-progress` anahtarıyla tarayıcının `localStorage` alanında saklanır. Böylece sayfayı yenilemek görevleri veya bahçedeki gelişimi sıfırlamaz. İlerleme tarayıcıya ve dosyanın açıldığı adrese özeldir; tarayıcı verileri silinirse bu kayıtlar da silinir. Bir görevi tamamlamak bir yıldız kazandırır. Görevi sonradan yeniden aktifleştirmek kazanılmış yıldızı geri almaz.

## GitHub'a yükleme

1. GitHub'da boş bir depo oluşturun.
2. Bu klasörde terminal açıp `git init` çalıştırın.
3. `git add index.html style.css script.js README.md .gitignore` ile proje dosyalarını ekleyin.
4. `git commit -m "Yıldız Patisi görev ve ilerleme uygulaması"` ile ilk kaydı oluşturun.
5. GitHub deposunu uzak depo olarak ekleyip `git push -u origin main` komutuyla yükleyin. GitHub hesabınızda gerekirse varsayılan dal adınızı `main` olarak ayarlayın.
