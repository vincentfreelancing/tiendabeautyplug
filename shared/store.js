/* The Beauty Plug Collective — lógica compartida de catálogo, carrito y WhatsApp.
   Sin backend: el carrito vive en localStorage y el pedido se envía por wa.me */
(function () {
  "use strict";
  var CFG = window.BP_CONFIG, PRODUCTS = window.BP_PRODUCTS, CATS = window.BP_CATEGORIES;
  var CART_KEY = "bp_cart_v1", CUST_KEY = "bp_customer_v1";
  var byId = {}; PRODUCTS.forEach(function (p) { byId[p.id] = p; });

  function fmt(n) { return "$" + String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, "."); }
  function nProductos(n) { return n + (n === 1 ? " producto" : " productos"); }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function fullName(p) { return p.name + (p.variant && !p.kit ? " – " + p.variant : ""); }
  function load(k, d) { try { return JSON.parse(localStorage.getItem(k)) || d; } catch (e) { return d; } }
  function save(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }

  var cart = load(CART_KEY, {});
  Object.keys(cart).forEach(function (id) { if (!byId[id] || !(cart[id] > 0)) delete cart[id]; });
  var customer = load(CUST_KEY, { nombre: "", ciudad: "", direccion: "", notas: "" });

  function lines() { return Object.keys(cart).map(function (id) { var p = byId[id]; return { p: p, qty: cart[id], sub: p.price * cart[id] }; }); }
  function count() { return lines().reduce(function (a, l) { return a + l.qty; }, 0); }
  function total() { return lines().reduce(function (a, l) { return a + l.sub; }, 0); }

  function setQty(id, q) { q = Math.max(0, Math.min(99, q | 0)); if (q) cart[id] = q; else delete cart[id]; save(CART_KEY, cart); refresh(id); }
  function add(id) { setQty(id, (cart[id] || 0) + 1); toast("Agregado: " + fullName(byId[id])); bump(); }

  function buildMessage() {
    var L = lines(), out = [];
    out.push("¡Hola " + CFG.STORE_NAME + "! 💖");
    out.push("Quiero hacer este pedido:");
    out.push("");
    L.forEach(function (l, i) {
      out.push((i + 1) + ". " + l.p.brand + " · " + fullName(l.p) + (l.p.size ? " (" + l.p.size + ")" : ""));
      out.push("   " + l.qty + " x " + fmt(l.p.price) + " = " + fmt(l.sub));
    });
    out.push("");
    out.push("Productos: " + count());
    out.push("*TOTAL: " + fmt(total()) + " COP*");
    out.push("");
    out.push("👤 Nombre: " + (customer.nombre || "(por confirmar)"));
    out.push("📍 Ciudad: " + (customer.ciudad || "(por confirmar)"));
    out.push("🏠 Dirección: " + (customer.direccion || "(por confirmar)"));
    if (customer.notas) out.push("📝 Notas: " + customer.notas);
    out.push("");
    out.push("¿Me confirman disponibilidad, pago y envío? ¡Gracias! ✨");
    return out.join("\n");
  }
  function waLink(text) { return "https://wa.me/" + CFG.WHATSAPP_NUMBER + (text ? "?text=" + encodeURIComponent(text) : ""); }

  /* ---------- UI ---------- */
  var opts = { layout: "grid", addLabel: "Agregar" }, activeCat = "todos", query = "";
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function norm(s) { return String(s).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""); }
  function matches(p) {
    if (query) { var h = norm([p.brand, p.name, p.variant, p.desc, p.cat, p.kit ? "kit" : "", p.tags || ""].join(" ")).replace(/vanilla/g, "vanilla vainilla").replace(/lashes|pestanas/g, "lashes pestanas").replace(/mist/g, "mist bruma splash"); if (norm(query).split(/\s+/).some(function (w) { return h.indexOf(w) < 0; })) return false; }
    if (activeCat === "todos") return true;
    if (activeCat === "kits") return !!p.kit;
    return p.cat === activeCat && !p.kit;
  }

  function ctrl(p) {
    var q = cart[p.id] || 0;
    if (!q) return '<button class="bp-add" data-add="' + p.id + '" aria-label="Agregar ' + esc(fullName(p)) + '"><span>' + esc(opts.addLabel) + '</span></button>';
    return '<div class="bp-step"><button data-dec="' + p.id + '" aria-label="Quitar uno">−</button><b>' + q + '</b><button data-inc="' + p.id + '" aria-label="Agregar uno">+</button></div>';
  }
  function card(p, i) {
    return '<article class="bp-card' + (p.kit ? " is-kit" : "") + '" data-id="' + p.id + '" style="--i:' + (i % 12) + '">' +
      '<div class="bp-media"><img src="' + CFG.IMG_BASE + p.img + '" alt="' + esc(p.brand + " " + fullName(p)) + '" loading="lazy" width="480" height="600">' +
      (p.kit ? '<span class="bp-badge">Kit completo</span>' : "") +
      (p.flyer ? '<button class="bp-flyer" data-flyer="' + p.flyer + '" aria-label="Ver flyer">Ver flyer</button>' : "") + "</div>" +
      '<div class="bp-info"><p class="bp-brand">' + esc(p.brand) + '</p><h3 class="bp-name">' + esc(p.name) + "</h3>" +
      (p.variant ? '<p class="bp-variant">' + esc(p.variant) + (p.size && !p.kit ? " · " + esc(p.size) : "") + "</p>" : (p.size ? '<p class="bp-variant">' + esc(p.size) + "</p>" : "")) +
      '<p class="bp-desc">' + esc(p.desc) + "</p>" +
      '<div class="bp-row"><span class="bp-price">' + fmt(p.price) + '</span><span class="bp-ctrl" data-ctrl="' + p.id + '">' + ctrl(p) + "</span></div></div></article>";
  }

  function renderPills() {
    var el = $("#bp-pills"); if (!el) return;
    el.innerHTML = CATS.map(function (c) { return '<button class="bp-pill' + (c.id === activeCat ? " is-active" : "") + '" data-cat="' + c.id + '">' + esc(c.label) + "</button>"; }).join("");
  }
  function renderProducts() {
    var el = $("#bp-products"); if (!el) return;
    var list = PRODUCTS.filter(matches), html = "";
    if (opts.layout === "rows" && activeCat === "todos" && !query) {
      CATS.filter(function (c) { return c.id !== "todos"; }).forEach(function (c) {
        var items = PRODUCTS.filter(function (p) { return c.id === "kits" ? !!p.kit : (p.cat === c.id && !p.kit); });
        if (!items.length) return;
        html += '<section class="bp-rowsec" id="sec-' + c.id + '"><div class="bp-rowhead"><h3>' + esc(c.label) + '</h3><span>' + nProductos(items.length) + ' · desliza →</span></div><div class="bp-track">' + items.map(card).join("") + "</div></section>";
      });
    } else {
      html = list.length ? '<div class="bp-grid">' + list.map(card).join("") + "</div>"
        : '<div class="bp-empty">No encontramos productos con “' + esc(query) + '”. Escríbenos por WhatsApp y te ayudamos 💖</div>';
    }
    el.innerHTML = html;
    var c = $("#bp-count"); if (c) c.textContent = nProductos(list.length);
  }

  function renderCart() {
    var L = lines(), n = count(), t = total();
    $$("[data-cart-count]").forEach(function (e) { e.textContent = n; e.classList.toggle("is-zero", !n); });
    $$("[data-cart-noun]").forEach(function (e) { e.textContent = n === 1 ? "producto" : "productos"; });
    $$("[data-cart-total]").forEach(function (e) { e.textContent = fmt(t); });
    var fab = $("#bp-fab"); if (fab) fab.classList.toggle("has-items", n > 0);
    var box = $("#bp-cart-items"); if (!box) return;
    if (!L.length) { box.innerHTML = '<div class="bp-cart-empty"><div class="bp-cart-empty-ico">🛍️</div><p>Tu carrito está vacío.</p><small>Agrega tus favoritos y confirma tu pedido por WhatsApp.</small></div>'; }
    else box.innerHTML = L.map(function (l) {
      return '<div class="bp-line"><img src="' + CFG.IMG_BASE + l.p.img + '" alt=""><div class="bp-line-info"><p class="bp-line-brand">' + esc(l.p.brand) + '</p><p class="bp-line-name">' + esc(fullName(l.p)) + '</p><p class="bp-line-unit">' + fmt(l.p.price) + ' c/u</p><div class="bp-step sm"><button data-dec="' + l.p.id + '" aria-label="Quitar uno">−</button><b>' + l.qty + '</b><button data-inc="' + l.p.id + '" aria-label="Agregar uno">+</button></div></div><div class="bp-line-right"><span class="bp-line-sub">' + fmt(l.sub) + '</span><button class="bp-line-del" data-del="' + l.p.id + '" aria-label="Eliminar">Eliminar</button></div></div>';
    }).join("");
    $("#bp-cart-foot").classList.toggle("is-hidden", !L.length);
    var w = $("#bp-wa"); if (w) w.href = waLink(buildMessage());
  }
  function fillCtrls() { $$("[data-ctrl]").forEach(function (e) { if (byId[e.dataset.ctrl]) e.innerHTML = ctrl(byId[e.dataset.ctrl]); }); }
  function refresh(id) {
    if (id) $$('[data-ctrl="' + id + '"]').forEach(function (e) { e.innerHTML = ctrl(byId[id]); });
    renderCart();
  }

  var toastT;
  function toast(msg) { var t = $("#bp-toast"); if (!t) return; t.innerHTML = '<span class="bp-toast-ico">✓</span><span>' + esc(msg) + "</span>"; t.classList.add("is-on"); clearTimeout(toastT); toastT = setTimeout(function () { t.classList.remove("is-on"); }, 2200); }
  function bump() { var f = $("#bp-fab"); if (!f) return; f.classList.remove("bump"); void f.offsetWidth; f.classList.add("bump"); }
  function openCart() { document.body.classList.add("cart-open"); renderCart(); }
  function closeCart() { document.body.classList.remove("cart-open"); }

  function injectShell() {
    var d = document.createElement("div");
    d.innerHTML =
      '<button id="bp-fab" class="bp-fab" data-open-cart aria-label="Ver carrito"><span class="bp-fab-ico" aria-hidden="true"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 7h12l-1 13H7L6 7z"/><path d="M9 7a3 3 0 0 1 6 0"/></svg><i data-cart-count class="is-zero">0</i></span><span class="bp-fab-txt">Ver carrito</span><span class="bp-fab-total" data-cart-total>$0</span></button>' +
      '<div id="bp-toast" class="bp-toast" role="status" aria-live="polite"></div>' +
      '<div class="bp-overlay" data-close-cart></div>' +
      '<aside id="bp-cart" class="bp-cart" aria-label="Carrito" aria-modal="true" role="dialog"><header class="bp-cart-head"><div><h2>Tu pedido</h2><p><span data-cart-count>0</span> <span data-cart-noun>productos</span></p></div><button class="bp-x" data-close-cart aria-label="Cerrar">×</button></header>' +
      '<div class="bp-cart-body"><div id="bp-cart-items"></div><div id="bp-cart-foot"><div class="bp-totals"><span>Total</span><strong data-cart-total>$0</strong></div>' +
      '<p class="bp-form-title">Tus datos <small>(opcional, nos ayuda a despachar más rápido)</small></p>' +
      '<div class="bp-form"><label><span>Nombre</span><input name="nombre" autocomplete="name" placeholder="Tu nombre"></label><label><span>Ciudad</span><input name="ciudad" autocomplete="address-level2" placeholder="Ej: Bogotá"></label><label class="full"><span>Dirección</span><input name="direccion" autocomplete="street-address" placeholder="Barrio, calle, número"></label><label class="full"><span>Notas</span><input name="notas" placeholder="Algo que debamos saber"></label></div>' +
      '<a id="bp-wa" class="bp-wa" target="_blank" rel="noopener" href="#"><svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2l-.5-.3z"/></svg><span>Confirmar pedido por WhatsApp</span></a>' +
      '<p class="bp-note">El pago y el envío se coordinan por WhatsApp. Envíos a toda Colombia.</p><button class="bp-clear" data-clear>Vaciar carrito</button></div></div></aside>' +
      '<div id="bp-lightbox" class="bp-lightbox" data-close-lb><button class="bp-x" data-close-lb aria-label="Cerrar">×</button><img alt="Flyer del producto"></div>';
    while (d.firstChild) document.body.appendChild(d.firstChild);
    $$(".bp-form input").forEach(function (inp) { inp.value = customer[inp.name] || ""; inp.addEventListener("input", function () { customer[inp.name] = inp.value.trim(); save(CUST_KEY, customer); var w = $("#bp-wa"); if (w) w.href = waLink(buildMessage()); }); });
  }

  function bind() {
    document.addEventListener("click", function (e) {
      var t = e.target.closest("[data-add],[data-inc],[data-dec],[data-del],[data-cat],[data-open-cart],[data-close-cart],[data-clear],[data-flyer],[data-close-lb],[data-wa-hello],#bp-wa");
      if (!t) return;
      if (t.dataset.add) return add(t.dataset.add);
      if (t.dataset.inc) { setQty(t.dataset.inc, (cart[t.dataset.inc] || 0) + 1); return bump(); }
      if (t.dataset.dec) return setQty(t.dataset.dec, (cart[t.dataset.dec] || 0) - 1);
      if (t.dataset.del) return setQty(t.dataset.del, 0);
      if (t.dataset.cat) {
        if (t.tagName === "A") { e.preventDefault(); var cg = $("#catalogo"); if (cg && !(opts.layout === "rows" && !query)) cg.scrollIntoView({ behavior: "smooth" }); }
        activeCat = t.dataset.cat; renderPills();
        if (opts.layout === "rows" && !query && activeCat !== "todos" && $("#sec-" + activeCat)) { activeCat = "todos"; renderPills(); $$(".bp-pill").forEach(function (b) { b.classList.toggle("is-active", b.dataset.cat === t.dataset.cat); }); $("#sec-" + t.dataset.cat).scrollIntoView({ behavior: "smooth", block: "start" }); return; }
        return renderProducts();
      }
      if (t.hasAttribute("data-open-cart")) { e.preventDefault(); return openCart(); }
      if (t.hasAttribute("data-close-lb")) { if (e.target === t || t.classList.contains("bp-x")) $("#bp-lightbox").classList.remove("is-on"); return; }
      if (t.hasAttribute("data-close-cart")) return closeCart();
      if (t.hasAttribute("data-clear")) { if (confirm("¿Vaciar el carrito?")) { cart = {}; save(CART_KEY, cart); renderProducts(); fillCtrls(); renderCart(); } return; }
      if (t.dataset.flyer) { var lb = $("#bp-lightbox"); $("img", lb).src = CFG.IMG_BASE + "flyers/" + t.dataset.flyer; lb.classList.add("is-on"); return; }
      if (t.hasAttribute("data-wa-hello")) { e.preventDefault(); window.open(waLink("¡Hola " + CFG.STORE_NAME + "! 💖 Quiero información sobre sus productos."), "_blank"); return; }
      if (t.id === "bp-wa" && !count()) { e.preventDefault(); }
    });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") { closeCart(); var lb = $("#bp-lightbox"); if (lb) lb.classList.remove("is-on"); } });
    var s = $("#bp-search"); if (s) s.addEventListener("input", function () { query = s.value.trim(); renderProducts(); });
    $$("[data-wa-link]").forEach(function (a) { a.href = waLink(); });
    $$("[data-ig-link]").forEach(function (a) { a.href = CFG.INSTAGRAM_URL; });
    renderSocial();
  }

  var ICONS = {
    instagram: ["Instagram", '<rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="12" r="4.2" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="17.4" cy="6.6" r="1.2" fill="currentColor"/>'],
    whatsapp: ["WhatsApp", '<path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2l-.5-.3z"/>'],
    tiktok: ["TikTok", '<path fill="currentColor" d="M16.6 3c.3 2.2 1.6 3.6 3.9 3.8v2.7c-1.4.1-2.6-.3-3.9-1.1v5.2c0 6.5-7.1 8.5-9.9 3.8-1.8-3-.7-8.3 5.2-8.5v2.9c-.4.1-.9.2-1.3.3-1.3.4-2 1.3-1.8 2.8.4 2.7 5.3 3.5 4.9-1.8V3h2.9z"/>'],
    facebook: ["Facebook", '<path fill="currentColor" d="M13.5 21v-7.5h2.6l.4-3h-3V8.6c0-.9.3-1.5 1.5-1.5h1.6V4.4c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4v2.2H7.8v3h2.6V21h3.1z"/>']
  };
  function renderSocial() {
    var S = CFG.SOCIAL || {};
    $$("[data-social]").forEach(function (box) {
      box.innerHTML = Object.keys(ICONS).filter(function (k) { return S[k]; }).map(function (k) {
        return '<a class="soc soc-' + k + '" href="' + esc(S[k]) + '" target="_blank" rel="noopener" aria-label="' + ICONS[k][0] + '" title="' + ICONS[k][0] + '"><svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">' + ICONS[k][1] + "</svg></a>";
      }).join("");
    });
  }

  window.BP = {
    init: function (o) { for (var k in o) opts[k] = o[k]; injectShell(); renderPills(); renderProducts(); fillCtrls(); renderCart(); bind(); },
    fmt: fmt, buildMessage: buildMessage, waLink: waLink, total: total, count: count, lines: lines,
    _setCart: function (c) { cart = c; save(CART_KEY, cart); renderProducts(); fillCtrls(); renderCart(); }, openCart: openCart
  };
})();
