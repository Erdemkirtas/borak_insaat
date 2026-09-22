/* BORAK İNŞAAT GROUP — etkileşim */
(function () {
  'use strict';

  var WA = '905338513899';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- sabit başlık ---------- */
  var hdr = document.getElementById('hdr');
  var ticking = false;
  function paintScroll() {
    if (hdr) hdr.classList.toggle('is-stuck', (window.scrollY || 0) > 40);
    ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(paintScroll);
  }, { passive: true });
  paintScroll();

  /* ---------- mobil menü ---------- */
  var burger = document.getElementById('burger');
  var nav = document.getElementById('nav');

  function setMenu(open) {
    if (!nav || !burger) return;
    nav.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    document.body.classList.toggle('nav-open', open);
  }

  if (burger && nav) {
    burger.addEventListener('click', function () {
      setMenu(burger.getAttribute('aria-expanded') !== 'true');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) setMenu(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') setMenu(false);
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > 1060) setMenu(false);
    });
  }

  /* ---------- tema (açık / koyu) ----------
     Varsayılan: cihazın teması. Düğmeyle yapılan seçim kaydedilir;
     <head>'deki satır içi betik onu ilk boyamadan önce uygular. */
  var root = document.documentElement;
  var temaBtn = document.getElementById('tema');
  var sistemKoyu = window.matchMedia('(prefers-color-scheme: dark)');

  function aktifTema() {
    var t = root.getAttribute('data-theme');
    if (t === 'dark' || t === 'light') return t;
    return sistemKoyu.matches ? 'dark' : 'light';
  }
  function temaEtiketi() {
    if (!temaBtn) return;
    temaBtn.setAttribute('aria-label', aktifTema() === 'dark' ? 'Açık temaya geç' : 'Koyu temaya geç');
  }
  if (temaBtn) {
    temaBtn.addEventListener('click', function () {
      var yeni = aktifTema() === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', yeni);
      try { localStorage.setItem('borak-tema', yeni); } catch (e) { /* gizli mod vb. */ }
      temaEtiketi();
    });
    if (sistemKoyu.addEventListener) sistemKoyu.addEventListener('change', temaEtiketi);
    temaEtiketi();
  }

  /* ---------- menüde bulunulan bölüm ---------- */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav > a[href^="#"]'));
  var navTargets = navLinks
    .map(function (a) {
      var el = document.querySelector(a.getAttribute('href'));
      return el ? { a: a, el: el } : null;
    })
    .filter(Boolean);

  if (navTargets.length && 'IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        navTargets.forEach(function (t) {
          t.a.classList.toggle('is-current', t.el === en.target);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
    navTargets.forEach(function (t) { spy.observe(t.el); });
  }

  /* ---------- harita: proje seçimi ---------- */
  var PROJE = {
    borak7: {
      t: 'Borak 7',
      d: 'Estetik mimarisi ve fonksiyonel planlarıyla modern yaşamın yeni adresi. Gazimağusa merkezde.'
    },
    borak6: {
      t: 'Borak 6',
      d: 'Çanakkale bölgesinde, göl manzarasına açılan geniş balkonlu daireler.'
    },
    borak5: {
      t: 'Borak 5',
      d: '2+1, 3+1 ve penthouse seçenekleriyle satışları devam eden projemiz.'
    }
  };

  var items = Array.prototype.slice.call(document.querySelectorAll('.mapitem'));
  var pins = Array.prototype.slice.call(document.querySelectorAll('.pin'));
  var info = document.getElementById('mapinfo');

  /* Dar ekranda harita tüm adaya sığınca yazılar 4px'e düşüyor.
     Bu yüzden mobilde Gazimağusa bölgesine kırpıyoruz. */
  var kktc = document.querySelector('.kktc');
  var kktcMod = '';
  function fitMap() {
    if (!kktc) return;
    var mod = window.innerWidth < 760 ? 'dar' : 'genis';
    if (mod === kktcMod) return;
    kktcMod = mod;
    kktc.setAttribute('viewBox', mod === 'dar' ? '406 126 440 272' : '0 0 1000 440');
  }
  fitMap();
  window.addEventListener('resize', fitMap, { passive: true });

  function selectProject(key) {
    if (!PROJE[key]) return;

    items.forEach(function (b) { b.classList.toggle('is-on', b.dataset.go === key); });
    pins.forEach(function (p) { p.classList.toggle('is-on', p.dataset.pin === key); });

    if (info) {
      info.querySelector('.mapinfo__t').textContent = PROJE[key].t;
      info.querySelector('.mapinfo__d').textContent = PROJE[key].d;
      info.querySelector('.mapinfo__a').setAttribute('href', '#' + key);
    }
  }

  items.forEach(function (b) {
    b.addEventListener('click', function () { selectProject(b.dataset.go); });
  });
  pins.forEach(function (p) {
    p.addEventListener('click', function () { selectProject(p.dataset.pin); });
    p.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        selectProject(p.dataset.pin);
      }
    });
  });
  selectProject('borak7');

  /* ---------- SSS: aynı anda tek açık ---------- */
  var faqs = Array.prototype.slice.call(document.querySelectorAll('.faq details'));
  faqs.forEach(function (d) {
    d.addEventListener('toggle', function () {
      if (!d.open) return;
      faqs.forEach(function (o) { if (o !== d) o.open = false; });
    });
  });

  /* ---------- form → WhatsApp ---------- */
  var form = document.getElementById('form');
  var hint = document.getElementById('form-hint');

  function fail(el, msg) {
    el.setAttribute('aria-invalid', 'true');
    el.focus();
    if (hint) {
      hint.textContent = msg;
      hint.style.color = '#D4483E';
    }
  }

  if (form) {
    ['f-ad', 'f-tel'].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.addEventListener('input', function () { el.removeAttribute('aria-invalid'); });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var ad = document.getElementById('f-ad');
      var tel = document.getElementById('f-tel');
      var proje = document.getElementById('f-proje');
      var tip = document.getElementById('f-tip');
      var not = document.getElementById('f-not');

      if (!ad.value.trim()) return fail(ad, 'Lütfen adınızı ve soyadınızı yazın.');
      if (tel.value.replace(/\D/g, '').length < 10) {
        return fail(tel, 'Lütfen geçerli bir telefon numarası yazın.');
      }

      if (hint) {
        hint.textContent = 'WhatsApp yeni sekmede açılıyor…';
        hint.style.color = '';
      }

      var satir = [
        'Merhaba Borak İnşaat Group,',
        '',
        'Ad Soyad: ' + ad.value.trim(),
        'Telefon: ' + tel.value.trim(),
        'Proje: ' + proje.value,
        'Daire tipi: ' + tip.value
      ];
      if (not.value.trim()) satir.push('Mesaj: ' + not.value.trim());
      satir.push('', 'Bilgi almak istiyorum.');

      window.open(
        'https://wa.me/' + WA + '?text=' + encodeURIComponent(satir.join('\n')),
        '_blank',
        'noopener'
      );
    });
  }

  /* ---------- görünürlükte yumuşak giriş ---------- */
  if (!reduce && 'IntersectionObserver' in window) {
    var targets = document.querySelectorAll(
      '.proj, .feat, .unit, .steps li, .frame, .stats, .mapcard, .maplist, .form, .contact, .faq details'
    );
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.animate(
          [{ opacity: 0, transform: 'translateY(20px)' }, { opacity: 1, transform: 'none' }],
          { duration: 650, easing: 'cubic-bezier(.22,.82,.28,1)', fill: 'both' }
        );
        io.unobserve(en.target);
      });
    }, { rootMargin: '0px 0px -6% 0px', threshold: 0.06 });
    Array.prototype.forEach.call(targets, function (t) { io.observe(t); });
  }

  /* ---------- yıl ---------- */
  var yil = document.getElementById('yil');
  if (yil) yil.textContent = new Date().getFullYear();
})();
