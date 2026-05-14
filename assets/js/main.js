/* ============================================================
   MAISON AURÉLIA — Demo Nextiweb
   Front-end e-commerce vanilla : panier persistant, i18n,
   reveal on scroll, thème clair/sombre, filtres, toast.
   ============================================================ */
(function () {
  'use strict';

  // -------------------- Image helper --------------------
  // Photos hotlinkées Unsplash (libres de droit, usage commercial, aucune attribution requise)
  // Pour passer en photos locales : remplacer chaque `img` par "assets/img/products/xxx.webp"
  const IMG_BASE = 'https://images.unsplash.com/photo-';
  const imgUrl = (id, w = 800, h = 1000) => `${IMG_BASE}${id}?w=${w}&h=${h}&fit=crop&q=80&auto=format`;

  // -------------------- Catalog (source de vérité) --------------------
  const CATALOG = [
    { id: 'solis', sku: 'AUR-001', name: { fr: 'Bague Solis', en: 'Solis Ring' }, category: 'bagues', price: 1290, oldPrice: null, badge: { fr: 'Édition limitée', en: 'Limited' }, img: '1627293501081-a1f856f447b4', materials: { fr: 'Or 18K · Onyx', en: '18K Gold · Onyx' }, lede: { fr: 'Le signet redessiné. Or 18K poli, cabochon onyx noir taillé à la main dans notre atelier de Montréal.', en: 'The signet, reimagined. Polished 18K gold and a black onyx cabochon, hand-cut in our Montréal workshop.' }, options: { metal: ['Or jaune 18K', 'Or rose 18K'], size: ['52', '54', '56', '58', '60'] }, rating: 4.9, reviews: 47 },
    { id: 'liane', sku: 'AUR-002', name: { fr: 'Collier Liane', en: 'Liane Necklace' }, category: 'colliers', price: 890, oldPrice: null, badge: null, img: '1611583027838-515a1087afdb', materials: { fr: 'Or 18K · Perle d\'eau douce', en: '18K Gold · Freshwater pearl' }, lede: { fr: 'Une chaîne ondulée comme une liane, ponctuée d\'une perle d\'eau douce. Délicat et intemporel.', en: 'A chain that flows like a vine, anchored by a freshwater pearl. Delicate, timeless.' }, options: { metal: ['Or jaune 18K', 'Or blanc 18K'], length: ['40 cm', '45 cm', '50 cm'] }, rating: 4.8, reviews: 32 },
    { id: 'mirage', sku: 'AUR-003', name: { fr: 'Boucles Mirage', en: 'Mirage Earrings' }, category: 'boucles', price: 650, oldPrice: 780, badge: { fr: 'Best-seller', en: 'Best-seller' }, img: '1675621916935-e0b6db01f491', materials: { fr: 'Or 18K · Perles', en: '18K Gold · Pearls' }, lede: { fr: 'Pendantes en croissant, perlées de blanc. Une silhouette qui capte la lumière à chaque mouvement.', en: 'Crescent drops with pearl tips. A silhouette that catches the light in every movement.' }, options: { metal: ['Or jaune 18K', 'Or rose 18K'] }, rating: 5.0, reviews: 64 },
    { id: 'onde', sku: 'AUR-004', name: { fr: 'Bracelet Onde', en: 'Onde Bracelet' }, category: 'bracelets', price: 750, oldPrice: null, badge: null, img: '1611107683227-e9060eccd846', materials: { fr: 'Or 18K martelé', en: 'Hammered 18K Gold' }, lede: { fr: 'Le jonc martelé à la main. Chaque marteau laisse une signature unique : aucun bracelet n\'est identique.', en: 'A hammered cuff. Each strike leaves a unique signature — no two bracelets are alike.' }, options: { metal: ['Or jaune 18K'], size: ['S', 'M', 'L'] }, rating: 4.9, reviews: 28 },
    { id: 'aurore', sku: 'AUR-005', name: { fr: 'Bague Aurore', en: 'Aurore Ring' }, category: 'bagues', price: 2450, oldPrice: null, badge: { fr: 'Nouveau', en: 'New' }, img: '1734640547704-98a4b882f1ba', materials: { fr: 'Or 18K · Diamant lab-grown 0.5ct', en: '18K Gold · 0.5ct Lab-grown diamond' }, lede: { fr: 'Le solitaire repensé. Diamant lab-grown taille brillant, certifié IGI, monture quatre griffes en or.', en: 'The solitaire, rethought. IGI-certified lab-grown brilliant-cut diamond, four-prong gold setting.' }, options: { metal: ['Or jaune 18K', 'Or blanc 18K', 'Or rose 18K'], size: ['52', '54', '56', '58'] }, rating: 5.0, reviews: 19 },
    { id: 'etoile', sku: 'AUR-006', name: { fr: 'Pendentif Étoile', en: 'Étoile Pendant' }, category: 'colliers', price: 1150, oldPrice: null, badge: null, img: '1601121141418-c1caa10a2a0b', materials: { fr: 'Or 18K · Émeraude lab-grown', en: '18K Gold · Lab-grown emerald' }, lede: { fr: 'Médaillon étoilé, cœur d\'émeraude. Une pièce qui se transmet.', en: 'A starlit medallion with an emerald heart. A piece to pass down.' }, options: { metal: ['Or jaune 18K'], length: ['45 cm', '50 cm'] }, rating: 4.9, reviews: 21 },
    { id: 'etincelle', sku: 'AUR-007', name: { fr: 'Boucles Étincelle', en: 'Étincelle Hoops' }, category: 'boucles', price: 480, oldPrice: null, badge: null, img: '1602699121297-81f2312fa4e7', materials: { fr: 'Or 18K', en: '18K Gold' }, lede: { fr: 'Les créoles essentielles. Or 18K plein, finition polie miroir. À porter au quotidien.', en: 'The essential hoops. Solid 18K gold, mirror-polished. Made for everyday.' }, options: { metal: ['Or jaune 18K', 'Or rose 18K'] }, rating: 4.8, reviews: 87 },
    { id: 'duo', sku: 'AUR-008', name: { fr: 'Bague Duo', en: 'Duo Ring' }, category: 'bagues', price: 920, oldPrice: null, badge: null, img: '1677316734745-057038106f80', materials: { fr: 'Or jaune 18K + Or rose 18K', en: '18K Yellow Gold + 18K Rose Gold' }, lede: { fr: 'Deux anneaux entrelacés, deux teintes d\'or. Symbole d\'union ou simple choix de style.', en: 'Two interlocking bands, two gold tones. A symbol — or simply a style choice.' }, options: { size: ['52', '54', '56', '58'] }, rating: 4.9, reviews: 36 },
    { id: 'constellation', sku: 'AUR-009', name: { fr: 'Collier Constellation', en: 'Constellation Necklace' }, category: 'colliers', price: 1680, oldPrice: null, badge: { fr: 'Édition limitée', en: 'Limited' }, img: '1623321673989-830eff0fd59f', materials: { fr: 'Or 18K · 5 diamants lab-grown', en: '18K Gold · 5 lab-grown diamonds' }, lede: { fr: 'Cinq diamants alignés en constellation. Un sertissage griffe d\'une précision d\'horloger.', en: 'Five diamonds set in a constellation. Watchmaker-grade prong setting.' }, options: { metal: ['Or jaune 18K', 'Or blanc 18K'], length: ['40 cm', '42 cm'] }, rating: 5.0, reviews: 14 },
    { id: 'tresor', sku: 'AUR-010', name: { fr: 'Bracelet Trésor', en: 'Trésor Bracelet' }, category: 'bracelets', price: 1050, oldPrice: null, badge: null, img: '1655707063513-a08dad26440e', materials: { fr: 'Or 18K · Maille forçat', en: '18K Gold · Curb chain' }, lede: { fr: 'Maille forçat épaisse, finition polie. Un bracelet de caractère qui s\'affirme seul ou se superpose.', en: 'Heavy curb chain, mirror-polished. A statement bracelet — alone or stacked.' }, options: { size: ['18 cm', '19 cm', '20 cm'] }, rating: 4.9, reviews: 41 },
    { id: 'velours', sku: 'AUR-011', name: { fr: 'Bague Velours', en: 'Velours Ring' }, category: 'bagues', price: 2890, oldPrice: null, badge: { fr: 'Nouveau', en: 'New' }, img: '1605100804763-247f67b3557e', materials: { fr: 'Or 18K · Rubis lab-grown', en: '18K Gold · Lab-grown ruby' }, lede: { fr: 'Le rouge profond du rubis lab-grown, monté sur une bague signature en or 18K.', en: 'The deep red of a lab-grown ruby on our signature 18K gold band.' }, options: { metal: ['Or jaune 18K', 'Or blanc 18K'], size: ['52', '54', '56', '58'] }, rating: 5.0, reviews: 9 },
    { id: 'sautoir', sku: 'AUR-012', name: { fr: 'Sautoir Aurélia', en: 'Aurélia Sautoir' }, category: 'colliers', price: 1380, oldPrice: null, badge: null, img: '1610223515982-5bae48b7c2c2', materials: { fr: 'Or 18K', en: '18K Gold' }, lede: { fr: 'Le sautoir signature. 75 cm de chaîne fine en or massif, à porter long ou doublé.', en: 'The signature sautoir. 75cm of solid gold fine chain — wear long or doubled.' }, options: { metal: ['Or jaune 18K', 'Or blanc 18K'] }, rating: 4.8, reviews: 23 }
  ];

  window.MA_IMG = imgUrl;

  window.MA_CATALOG = CATALOG;

  // -------------------- i18n --------------------
  const I18N = {
    fr: {
      'nav.collection': 'Collection',
      'nav.histoire': 'Atelier',
      'nav.contact': 'Contact',
      'nav.search': 'Rechercher',
      'nav.account': 'Compte',
      'nav.wishlist': 'Favoris',
      'nav.cart': 'Panier',
      'topbar.shipping': 'Livraison offerte au Canada dès 250 $',
      'topbar.returns': 'Retours gratuits sous 30 jours',
      'topbar.warranty': 'Garantie à vie sur l\'or 18K',
      'cta.shop': 'Découvrir la collection',
      'cta.story': 'Notre histoire',
      'cta.add': 'Ajouter au panier',
      'cta.added': 'Ajouté au panier',
      'cta.checkout': 'Passer à la caisse',
      'toast.added': 'a été ajouté à votre panier',
    },
    en: {
      'nav.collection': 'Collection',
      'nav.histoire': 'Atelier',
      'nav.contact': 'Contact',
      'nav.search': 'Search',
      'nav.account': 'Account',
      'nav.wishlist': 'Wishlist',
      'nav.cart': 'Cart',
      'topbar.shipping': 'Free Canadian shipping over $250',
      'topbar.returns': '30-day free returns',
      'topbar.warranty': 'Lifetime warranty on 18K gold',
      'cta.shop': 'Explore the collection',
      'cta.story': 'Our story',
      'cta.add': 'Add to cart',
      'cta.added': 'Added to cart',
      'cta.checkout': 'Proceed to checkout',
      'toast.added': 'has been added to your cart',
    }
  };

  function getLang() { return localStorage.getItem('ma_lang') || 'fr'; }
  function setLang(lang) {
    localStorage.setItem('ma_lang', lang);
    document.documentElement.lang = lang;
    applyI18n();
    document.dispatchEvent(new CustomEvent('langchange', { detail: { lang } }));
  }
  function t(key) { return I18N[getLang()][key] || key; }

  function applyI18n() {
    const lang = getLang();
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.dataset.i18n;
      if (I18N[lang][key]) el.textContent = I18N[lang][key];
    });
    document.querySelectorAll('[data-i18n-aria]').forEach(el => {
      const key = el.dataset.i18nAria;
      if (I18N[lang][key]) el.setAttribute('aria-label', I18N[lang][key]);
    });
    document.querySelectorAll('.lang-switch button').forEach(btn => {
      btn.setAttribute('aria-pressed', btn.dataset.lang === lang ? 'true' : 'false');
    });
  }

  window.MA_LANG = { get: getLang, set: setLang, t };

  // -------------------- Cart (localStorage) --------------------
  function getCart() {
    try { return JSON.parse(localStorage.getItem('ma_cart') || '[]'); }
    catch (e) { return []; }
  }
  function saveCart(cart) {
    localStorage.setItem('ma_cart', JSON.stringify(cart));
    updateCartCount();
    document.dispatchEvent(new CustomEvent('cartchange'));
  }
  function addToCart(productId, options) {
    const cart = getCart();
    const optKey = JSON.stringify(options || {});
    const existing = cart.find(i => i.id === productId && JSON.stringify(i.options || {}) === optKey);
    if (existing) existing.qty += (options?.qty || 1);
    else cart.push({ id: productId, qty: options?.qty || 1, options: options || {} });
    saveCart(cart);
    const product = CATALOG.find(p => p.id === productId);
    if (product) showToast(product.name[getLang()] + ' ' + t('toast.added'));
  }
  function removeFromCart(index) {
    const cart = getCart();
    cart.splice(index, 1);
    saveCart(cart);
  }
  function updateCartItem(index, qty) {
    const cart = getCart();
    if (cart[index]) {
      cart[index].qty = Math.max(1, qty);
      saveCart(cart);
    }
  }
  function cartCount() {
    return getCart().reduce((sum, i) => sum + i.qty, 0);
  }
  function updateCartCount() {
    document.querySelectorAll('[data-cart-count]').forEach(el => {
      const n = cartCount();
      el.textContent = n;
      el.setAttribute('data-count', n);
    });
  }
  window.MA_CART = { get: getCart, add: addToCart, remove: removeFromCart, update: updateCartItem, count: cartCount };

  // -------------------- Wishlist --------------------
  function getWishlist() {
    try { return JSON.parse(localStorage.getItem('ma_wishlist') || '[]'); }
    catch (e) { return []; }
  }
  function toggleWishlist(productId) {
    const list = getWishlist();
    const idx = list.indexOf(productId);
    if (idx > -1) list.splice(idx, 1);
    else list.push(productId);
    localStorage.setItem('ma_wishlist', JSON.stringify(list));
    document.dispatchEvent(new CustomEvent('wishlistchange'));
  }
  window.MA_WISHLIST = { get: getWishlist, toggle: toggleWishlist };

  // -------------------- Toast --------------------
  let toastTimer;
  function showToast(text) {
    let toast = document.querySelector('.toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'toast';
      toast.setAttribute('role', 'status');
      toast.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg><div><div class="toast__title">✦</div><div class="toast__text"></div></div>`;
      document.body.appendChild(toast);
    }
    toast.querySelector('.toast__text').textContent = text;
    toast.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 3500);
  }
  window.MA_TOAST = showToast;

  // -------------------- Format price (CAD) --------------------
  function formatPrice(value) {
    return new Intl.NumberFormat(getLang() === 'fr' ? 'fr-CA' : 'en-CA', {
      style: 'currency', currency: 'CAD', minimumFractionDigits: 0, maximumFractionDigits: 0
    }).format(value);
  }
  window.MA_FMT = formatPrice;

  // -------------------- Theme toggle --------------------
  function getTheme() { return localStorage.getItem('ma_theme') || 'dark'; }
  function setTheme(theme) {
    localStorage.setItem('ma_theme', theme);
    document.documentElement.dataset.theme = theme;
    document.querySelectorAll('[data-theme-toggle]').forEach(b => {
      b.setAttribute('aria-pressed', theme === 'light' ? 'true' : 'false');
    });
  }

  // -------------------- Reveal on scroll --------------------
  function initReveal() {
    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll('.reveal').forEach(el => el.classList.add('is-in'));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('is-in');
          io.unobserve(e.target);
        }
      });
    }, { rootMargin: '-50px 0px', threshold: 0.05 });
    document.querySelectorAll('.reveal').forEach(el => io.observe(el));
  }

  // -------------------- Mobile menu --------------------
  function initMenu() {
    const toggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('.nav');
    if (!toggle || !nav) return;
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open);
    });
  }

  // -------------------- Render product card --------------------
  function productCardHTML(p) {
    const lang = getLang();
    const badge = p.badge ? `<span class="product__badge ${p.id === 'aurore' || p.id === 'velours' ? 'product__badge--new' : ''}">${p.badge[lang]}</span>` : '';
    const isWish = getWishlist().includes(p.id);
    const alt = `${p.name[lang]} — ${p.materials[lang]}`;
    return `
      <a href="produit.html?id=${p.id}" class="product" data-id="${p.id}">
        <div class="product__media">
          ${badge}
          <button class="product__wishlist" aria-pressed="${isWish}" aria-label="Ajouter aux favoris" data-wishlist="${p.id}" type="button" onclick="event.preventDefault();event.stopPropagation();MA_WISHLIST.toggle('${p.id}');this.setAttribute('aria-pressed', this.getAttribute('aria-pressed')==='true'?'false':'true');">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
          </button>
          <img src="${imgUrl(p.img, 600, 750)}" srcset="${imgUrl(p.img, 600, 750)} 600w, ${imgUrl(p.img, 900, 1125)} 900w, ${imgUrl(p.img, 1200, 1500)} 1200w" sizes="(max-width: 600px) 90vw, (max-width: 1024px) 45vw, 30vw" alt="${alt}" loading="lazy" decoding="async" width="600" height="750">
          <div class="product__quick">${lang === 'fr' ? 'Voir le bijou' : 'View piece'}</div>
        </div>
        <div class="product__info">
          <h3 class="product__name">${p.name[lang]}</h3>
          <span class="product__price">${formatPrice(p.price)}</span>
        </div>
        <div class="product__meta">${p.materials[lang]}</div>
      </a>
    `;
  }
  window.MA_RENDER = { card: productCardHTML };

  // -------------------- Cookie banner — Loi 25 --------------------
  // Catégories : essentiels (toujours actifs), préférences, statistiques, marketing
  // Loi 25 art. 8.1 : désactivés par défaut, consentement explicite par finalité
  function getConsent() {
    try { return JSON.parse(localStorage.getItem('ma_consent') || 'null'); }
    catch (e) { return null; }
  }
  function saveConsent(consent) {
    localStorage.setItem('ma_consent', JSON.stringify({ ...consent, date: new Date().toISOString(), version: 1 }));
    hideCookieBanner();
    closeCookiePanel();
  }
  function buildCookieBanner() {
    const banner = document.createElement('div');
    banner.className = 'cookie-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-labelledby', 'cookie-title');
    banner.setAttribute('aria-describedby', 'cookie-desc');
    banner.innerHTML = `
      <div class="cookie-banner__head">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 2l9 4v6c0 5-4 9-9 10-5-1-9-5-9-10V6l9-4z"/><path d="M9 12l2 2 4-4"/></svg>
        <span id="cookie-title">Vos témoins, votre choix.</span>
      </div>
      <p id="cookie-desc">Nous utilisons des témoins (cookies) pour faire fonctionner le site, mémoriser vos préférences et — avec votre accord — mesurer son audience. Vous pouvez accepter, refuser, ou choisir par catégorie. Conforme <strong>Loi 25</strong> (Québec). <a href="confidentialite.html">En savoir plus</a></p>
      <div class="cookie-banner__actions">
        <button class="btn" data-cookie="accept-all">Tout accepter</button>
        <button class="btn btn--ghost" data-cookie="reject-all">Tout refuser</button>
        <a href="#" class="cookie-banner__customize" data-cookie="customize">Personnaliser</a>
      </div>
    `;
    document.body.appendChild(banner);

    const panel = document.createElement('div');
    panel.className = 'cookie-panel';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-modal', 'true');
    panel.setAttribute('aria-labelledby', 'cookie-panel-title');
    panel.innerHTML = `
      <div class="cookie-panel__inner">
        <h2 id="cookie-panel-title">Personnaliser <span class="italic" style="color:var(--gold)">vos témoins</span></h2>
        <p>Conformément à la Loi 25 (Québec), nous activons uniquement les témoins essentiels par défaut. Cochez les autres catégories si vous y consentez.</p>

        <div class="cookie-row">
          <div class="cookie-row__main">
            <div class="cookie-row__title">Essentiels <span style="color:var(--gold);font-size:11px;letter-spacing:0.1em;text-transform:uppercase;margin-left:0.5rem">Toujours actif</span></div>
            <div class="cookie-row__desc">Nécessaires au fonctionnement du site : panier, langue, thème, sécurité. Aucune information personnelle transférée à un tiers.</div>
          </div>
          <label class="toggle"><input type="checkbox" checked disabled aria-label="Témoins essentiels"><span class="toggle__slider"></span></label>
        </div>

        <div class="cookie-row">
          <div class="cookie-row__main">
            <div class="cookie-row__title">Préférences</div>
            <div class="cookie-row__desc">Mémorisent votre liste de favoris (wishlist) et vos choix d'options produit entre deux visites. Stockés sur votre appareil uniquement.</div>
          </div>
          <label class="toggle"><input type="checkbox" id="consent-pref" aria-label="Témoins préférences"><span class="toggle__slider"></span></label>
        </div>

        <div class="cookie-row">
          <div class="cookie-row__main">
            <div class="cookie-row__title">Statistiques</div>
            <div class="cookie-row__desc">Mesure d'audience anonymisée (pages vues, durées). Aide Maison Aurélia à améliorer l'expérience. <strong>Aucun transfert hors Canada.</strong></div>
          </div>
          <label class="toggle"><input type="checkbox" id="consent-stats" aria-label="Témoins statistiques"><span class="toggle__slider"></span></label>
        </div>

        <div class="cookie-row">
          <div class="cookie-row__main">
            <div class="cookie-row__title">Marketing</div>
            <div class="cookie-row__desc">Permet à Maison Aurélia de mesurer l'efficacité de ses campagnes (Google Ads, Meta Ads) et de vous reproposer des pièces vues. Peut impliquer un transfert hors Québec (USA), avec votre accord.</div>
          </div>
          <label class="toggle"><input type="checkbox" id="consent-marketing" aria-label="Témoins marketing"><span class="toggle__slider"></span></label>
        </div>

        <div class="cookie-panel__footer">
          <button class="btn btn--ghost" data-cookie="save-custom">Enregistrer mes choix</button>
          <button class="btn" data-cookie="accept-all">Tout accepter</button>
        </div>
      </div>
    `;
    document.body.appendChild(panel);

    // Bindings
    banner.querySelectorAll('[data-cookie]').forEach(b => {
      b.addEventListener('click', e => {
        e.preventDefault();
        const action = b.dataset.cookie;
        if (action === 'accept-all') saveConsent({ essential: true, preferences: true, statistics: true, marketing: true });
        else if (action === 'reject-all') saveConsent({ essential: true, preferences: false, statistics: false, marketing: false });
        else if (action === 'customize') openCookiePanel();
      });
    });
    panel.querySelectorAll('[data-cookie]').forEach(b => {
      b.addEventListener('click', e => {
        e.preventDefault();
        const action = b.dataset.cookie;
        if (action === 'accept-all') saveConsent({ essential: true, preferences: true, statistics: true, marketing: true });
        else if (action === 'save-custom') saveConsent({
          essential: true,
          preferences: document.getElementById('consent-pref').checked,
          statistics: document.getElementById('consent-stats').checked,
          marketing: document.getElementById('consent-marketing').checked
        });
      });
    });
    panel.addEventListener('click', e => { if (e.target === panel) closeCookiePanel(); });
  }
  function showCookieBanner() {
    let b = document.querySelector('.cookie-banner');
    if (!b) { buildCookieBanner(); b = document.querySelector('.cookie-banner'); }
    setTimeout(() => b.classList.add('is-visible'), 600);
  }
  function hideCookieBanner() {
    const b = document.querySelector('.cookie-banner');
    if (b) b.classList.remove('is-visible');
  }
  function openCookiePanel() {
    const p = document.querySelector('.cookie-panel');
    if (p) p.classList.add('is-open');
  }
  function closeCookiePanel() {
    const p = document.querySelector('.cookie-panel');
    if (p) p.classList.remove('is-open');
  }
  // Lien "Gérer mes témoins" depuis footer / politique
  window.MA_OPEN_COOKIES = function() {
    if (!document.querySelector('.cookie-banner')) buildCookieBanner();
    openCookiePanel();
    return false;
  };

  // -------------------- Init --------------------
  function init() {
    document.documentElement.lang = getLang();
    document.documentElement.dataset.theme = getTheme();
    applyI18n();
    updateCartCount();
    initReveal();
    initMenu();

    // Lang switch
    document.querySelectorAll('.lang-switch button').forEach(btn => {
      btn.addEventListener('click', () => setLang(btn.dataset.lang));
    });

    // Theme toggle
    document.querySelectorAll('[data-theme-toggle]').forEach(btn => {
      btn.addEventListener('click', () => setTheme(getTheme() === 'dark' ? 'light' : 'dark'));
      btn.setAttribute('aria-pressed', getTheme() === 'light' ? 'true' : 'false');
    });

    // Newsletter forms
    document.querySelectorAll('form[data-newsletter]').forEach(f => {
      f.addEventListener('submit', e => {
        e.preventDefault();
        const lang = getLang();
        showToast(lang === 'fr' ? '✦ Merci. Bienvenue chez Aurélia.' : '✦ Thank you. Welcome to Aurélia.');
        f.reset();
      });
    });

    // Cookie banner — affiche si pas de consentement enregistré
    if (!getConsent()) showCookieBanner();

    // Contact form
    document.querySelectorAll('form[data-contact]').forEach(f => {
      f.addEventListener('submit', e => {
        e.preventDefault();
        const lang = getLang();
        alert(lang === 'fr'
          ? '✦ Démo Nextiweb — Votre message a bien été reçu. Sur un site en production, il serait envoyé à l\'équipe Maison Aurélia.'
          : '✦ Nextiweb demo — Your message has been received. On a live site, it would be sent to the Maison Aurélia team.');
        f.reset();
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
