# Borak İnşaat Group — web sitesi

Tek sayfalık statik site. Derleme adımı, bağımlılık, `node_modules` yok.

```
borak-insaat/
├── index.html
├── assets/
│   ├── style.css
│   ├── main.js
│   ├── borak-logo.svg      favicon
│   └── img/                fotoğraflar (temsili)
├── 404.html                bulunamayan sayfa
├── vercel.json             temiz URL + başlıklar
├── .vercelignore
├── artifact.html           Claude önizleme sürümü — hosting'e GEREKMEZ
└── README.md
```

## Tasarım

Referans: akolglobal.com. Düzen ve form dili ondan, renk Borak'ın kendi logosundan.

- **Renk**: beyaz / `#F6F6F4` zemin, `#0B0B0D` koyu bantlar, marka altını
  `#8C6714` (beyaz üstünde yazı) ve `#C9A24A` (dolgu). Tümü `assets/style.css`
  içindeki `:root` değişkenlerinde.
- **Tipografi**: Outfit (başlıklar, 700), Plus Jakarta Sans (metin), IBM Plex Mono (indeksler).
- **Form dili**: 14/20/28/36px radius, 999px pill butonlar, cam sticky header.
- **İnteraktif harita**: elle çizilmiş KKTC haritası (SVG). Harici servis, API
  anahtarı yok. Mobilde `main.js` içindeki `fitMap()` haritayı Gazimağusa
  bölgesine kırpar ki yazılar okunur kalsın.

## Açık / koyu tema

- Varsayılan olarak ziyaretçinin cihaz teması kullanılır (`prefers-color-scheme`).
- Header'daki güneş/ay düğmesi temayı değiştirir. Seçim `localStorage`
  (`borak-tema`) içinde saklanır. `<head>`'deki tek satırlık betik onu ilk
  boyamadan önce uygular, sayfa açılırken beyaz parlama olmaz.
- Tüm renkler `:root` token'larında. Koyu değerler iki blokta tekrar ediyor
  (sistem teması için `@media` + düğme için `[data-theme="dark"]`).
  Renk değiştirirken ikisini birlikte güncelleyin.
- Hero, harita, iletişim bandı ve footer her iki temada da koyu kalır.
  Koyu temada fotoğraflar hafifçe kısılır (`--img-filter`).

## Fotoğraflar — TEMSİLİ

`assets/img/` içindeki 8 fotoğraf **Unsplash**'tan alındı (Unsplash Lisansı:
ticari kullanım serbest, atıf zorunlu değil). Hiçbiri Borak'ın binası değil.
Bu yüzden her birinin üstünde "Temsili görsel" notu, footer'da da
"Görseller temsilidir." yazıyor.

| Dosya | Kullanıldığı yer | Kaynak |
|---|---|---|
| `hero.jpg` | Açılış | images.unsplash.com/photo-1600596542815-ffad4c1539a9 |
| `borak7.jpg` | Borak 7 | images.unsplash.com/photo-1551038247-3d9af20df552 |
| `borak6.jpg` | Borak 6 | images.unsplash.com/photo-1613490493576-7fde63acd811 |
| `borak5.jpg` | Borak 5 | images.unsplash.com/photo-1574362848149-11496d93a7c7 |
| `kurumsal.jpg` | Kurumsal | images.unsplash.com/photo-1545324418-cc1a3fa10c00 |
| `daire-2-1.jpg` | 2+1 | images.unsplash.com/photo-1600210492486-724fe5c67fb0 |
| `daire-3-1.jpg` | 3+1 | images.unsplash.com/photo-1600607687939-ce8a6c25118c |
| `penthouse.jpg` | Penthouse | images.unsplash.com/photo-1616594039964-ae9021a400a0 |

**Firmanın gerçek render/fotoğrafları gelince** aynı adla `assets/img/` içine
koyun. Kodda değişiklik gerekmez. Sonra ilgili `<span class="tmsl">` notlarını
ve footer'daki "Görseller temsilidir." ifadesini kaldırın (render kullanılıyorsa
not kalabilir). Öneri: dış cephe ~1600px, hero ~2200px geniş, JPEG kalite 75.

## Paylaşım kartı ve arama motoru

- `assets/img/og.jpg` (1200×630): WhatsApp/Instagram/Facebook'ta link paylaşılınca
  çıkan önizleme kartı. **Fotoğraf içermez**, yalnız marka öğelerinden üretilir;
  site görselleri değişse de geçerli kalır.
- `index.html` içindeki `og:image` yolu görecelidir. **Alan adı belli olunca**
  tam adrese çevirin (ör. `https://borakinsaat.com/assets/img/og.jpg`);
  bazı uygulamalar göreceli yolu çözemez.
- Sayfada `application/ld+json` ile işletme bilgisi var (ad, telefon, Gazimağusa
  konumu, koordinat, Instagram). Google'ın işletmeyi tanıması için. İçinde
  yalnız doğrulanmış bilgiler var.

## Form

Backend yok. Form bilgileri hazır bir WhatsApp mesajına çevirip
`wa.me/905338513899` adresinde açar. Numara `assets/main.js` başındaki `WA`.

## Güncelleme yaparken

CSS/JS değiştirince `index.html` içindeki `?v=...` sürüm etiketini artırın
(`style.css?v=20260922g`, `main.js?v=20260922g`). Yoksa ziyaretçiler eski
dosyayı önbellekten görebilir.

## Vercel

```
npx vercel login
npx vercel --prod
```

`vercel.json` şunları ayarlar:
- `cleanUrls`
- **`X-Robots-Tag: noindex`**: site demo aşamasındayken Google'a girmesin diye.
  **Müşteri onaylayıp kendi alan adına taşındığında bu satırı silin**, yoksa site
  arama sonuçlarında çıkmaz.

## Gerçek verilerle doldurulmuş kısımlar

Instagram hesabından (@borakinsaatcyprus) doğrulanan bilgiler: Borak 5 / 6 / 7,
2+1 · 3+1 · penthouse, altı özellik (modern mimari, konforlu yaşam, güvenli yapı,
aile dostu, merkezî konum, otopark), telefon `0533 851 38 99`, konum
`35.139013, 33.917244` (Gazimağusa).

**Uydurma rakam eklenmedi** ("25 yıllık tecrübe", "1.200 konut" gibi ifadeler yok).

## Firmadan istenecekler

- [ ] Logo dosyası (SVG/PNG). Şu an logo vektör olarak yeniden çizildi.
- [ ] Proje render ve şantiye fotoğrafları (temsili görsellerin yerine)
- [ ] Gerçek kat planları ve metrekareler
- [ ] Kuruluş yılı, teslim edilen konut sayısı
- [ ] Ofis açık adresi, sabit telefon, e-posta
- [ ] Alan adı (Vercel'e bağlanacak)
