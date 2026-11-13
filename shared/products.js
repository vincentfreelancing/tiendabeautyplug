/* ============================================================
   THE BEAUTY PLUG COLLECTIVE — CONFIGURACIÓN Y PRODUCTOS
   Para cambiar el WhatsApp, edita solo WHATSAPP_NUMBER.
   Para agregar un producto, copia una línea del arreglo PRODUCTS.
   Precios en COP (número entero, sin puntos).
   ============================================================ */
window.BP_CONFIG = {
  WHATSAPP_NUMBER: "573115461244",          // +57 311 546 1244 (formato internacional sin "+")
  STORE_NAME: "The Beauty Plug Collective",
  INSTAGRAM_URL: "https://www.instagram.com/tiendabeautyplug/",
  TAGLINE: "Más que belleza, es confianza",
  IMG_BASE: "/images/",                   // ruta absoluta desde la raíz del sitio
  /* Redes sociales: el ícono solo aparece si la URL tiene valor. */
  SOCIAL: {
    instagram: "https://www.instagram.com/tiendabeautyplug/",
    whatsapp:  "https://wa.me/573115461244",
    tiktok:    "https://www.tiktok.com/@tiendabeautyplug",
    facebook:  "https://www.facebook.com/profile.php?id=100072354423027"
  }
};

window.BP_CATEGORIES = [
  { id: "todos",      label: "Todos" },
  { id: "cuerpo",     label: "Cuerpo" },
  { id: "skincare",   label: "Skincare" },
  { id: "maquillaje", label: "Maquillaje" },
  { id: "kits",       label: "Kits" },
  { id: "otros",      label: "Otros" }
];

/* Campos: id, brand, name, variant, desc, size, price, cat, img, kit, flyer */
window.BP_PRODUCTS = [
  // ---------- Cuerpo · Victoria's Secret Whipped ----------
  { id:"vs-whipped-bare-vanilla",   brand:"Victoria's Secret", name:"Whipped Fragrance Lotion", variant:"Bare Vanilla",   desc:"Cálida, dulce y envolvente.",  size:"236 ml", price:85000, cat:"cuerpo", img:"vs-whipped-bare-vanilla.webp",   flyer:"vs-whipped.webp" },
  { id:"vs-whipped-velvet-petals",  brand:"Victoria's Secret", name:"Whipped Fragrance Lotion", variant:"Velvet Petals",  desc:"Floral, suave y delicada.",    size:"236 ml", price:85000, cat:"cuerpo", img:"vs-whipped-velvet-petals.webp",  flyer:"vs-whipped.webp" },
  { id:"vs-whipped-pure-seduction", brand:"Victoria's Secret", name:"Whipped Fragrance Lotion", variant:"Pure Seduction", desc:"Sensual, dulce y atrevida.",   size:"236 ml", price:85000, cat:"cuerpo", img:"vs-whipped-pure-seduction.webp", flyer:"vs-whipped.webp" },
  { id:"vs-whipped-love-spell",     brand:"Victoria's Secret", name:"Whipped Fragrance Lotion", variant:"Love Spell",     desc:"Dulce, frutal y romántica.",   size:"236 ml", price:85000, cat:"cuerpo", img:"vs-whipped-love-spell.webp",     flyer:"vs-whipped.webp" },
  // ---------- Cuerpo · VS Fragrance Lotion ----------
  { id:"vs-lotion-bare-vanilla",  brand:"Victoria's Secret", name:"Fragrance Lotion", variant:"Bare Vanilla",  desc:"Dulce, cálida y envolvente.", size:"236 ml", price:70000, cat:"cuerpo", img:"vs-lotion-bare-vanilla.webp",  flyer:"vs-fragrance-lotion.webp" },
  { id:"vs-lotion-velvet-petals", brand:"Victoria's Secret", name:"Fragrance Lotion", variant:"Velvet Petals", desc:"Floral, suave y delicada.",   size:"236 ml", price:65000, cat:"cuerpo", img:"vs-lotion-velvet-petals.webp", flyer:"vs-fragrance-lotion.webp" },
  { id:"vs-lotion-love-spell",    brand:"Victoria's Secret", name:"Fragrance Lotion", variant:"Love Spell",    desc:"Dulce, frutal y romántica.",  size:"236 ml", price:65000, cat:"cuerpo", img:"vs-lotion-love-spell.webp",    flyer:"vs-fragrance-lotion.webp" },
  // ---------- Cuerpo · VS Shimmer Mist ----------
  { id:"vs-mist-pure-seduction", brand:"Victoria's Secret", name:"Shimmer Fragrance Mist", variant:"Pure Seduction", desc:"Frutal: ciruela jugosa y fresia.",       size:"250 ml", price:85000, cat:"cuerpo", img:"vs-mist-pure-seduction.webp", flyer:"vs-shimmer-mist.webp" },
  { id:"vs-mist-love-spell",     brand:"Victoria's Secret", name:"Shimmer Fragrance Mist", variant:"Love Spell",     desc:"Floral frutal: cerezo y durazno.",       size:"250 ml", price:85000, cat:"cuerpo", img:"vs-mist-love-spell.webp",     flyer:"vs-shimmer-mist.webp" },
  { id:"vs-mist-velvet-petals",  brand:"Victoria's Secret", name:"Shimmer Fragrance Mist", variant:"Velvet Petals",  desc:"Frutal gourmand: flores y almendras.",   size:"250 ml", price:85000, cat:"cuerpo", img:"vs-mist-velvet-petals.webp",  flyer:"vs-shimmer-mist.webp" },
  { id:"vs-mist-bare-vanilla",   brand:"Victoria's Secret", name:"Shimmer Fragrance Mist", variant:"Bare Vanilla",   desc:"Gourmand: vainilla batida y cachemira.", size:"250 ml", price:85000, cat:"cuerpo", img:"vs-mist-bare-vanilla.webp",   flyer:"vs-shimmer-mist.webp" },

  // ---------- Skincare · Beauty Creations Deep Dive ----------
  { id:"deepdive-kit",         brand:"Beauty Creations Skin", name:"Deep Dive Bundle", variant:"Kit 4 productos", desc:"Hidratación profunda para una piel más suave, fresca y luminosa.", size:"4 productos", price:255000, cat:"skincare", kit:true, img:"deepdive-kit.webp", flyer:"deep-dive.webp" },
  { id:"deepdive-serum",       brand:"Beauty Creations Skin", name:"Deep Dive Sérum ácido hialurónico", variant:"", desc:"Mantiene la piel hidratada y con apariencia más suave.", size:"30 ml", price:73700, cat:"skincare", img:"deepdive-serum.webp", flyer:"deep-dive.webp" },
  { id:"deepdive-hidratante",  brand:"Beauty Creations Skin", name:"Deep Dive Hidratante mate sin aceite", variant:"", desc:"Hidrata sin sensación pesada ni grasosa.", size:"50 ml", price:73700, cat:"skincare", img:"deepdive-hidratante.webp", flyer:"deep-dive.webp" },
  { id:"deepdive-crema-noche", brand:"Beauty Creations Skin", name:"Deep Dive Crema de noche", variant:"", desc:"Complementa tu rutina antes de dormir.", size:"50 ml", price:73700, cat:"skincare", img:"deepdive-crema-noche.webp", flyer:"deep-dive.webp" },
  { id:"deepdive-gel-ojos",    brand:"Beauty Creations Skin", name:"Deep Dive Gel contorno de ojos", variant:"", desc:"Con cafeína y ácido hialurónico.", size:"14 ml", price:73700, cat:"skincare", img:"deepdive-gel-ojos.webp", flyer:"deep-dive.webp" },
  // ---------- Skincare · Pore Vida ----------
  { id:"porevida-kit",        brand:"Beauty Creations Skin", name:"Pore Vida Kit completo", variant:"Kit 3 productos", desc:"Rutina para poros y control de grasa.", size:"3 productos", price:192000, cat:"skincare", kit:true, img:"porevida-kit.webp", flyer:"pore-vida.webp" },
  { id:"porevida-serum",      brand:"Beauty Creations Skin", name:"Pore Vida Sérum control de sebo", variant:"", desc:"10% niacinamida + ácido salicílico.", size:"30 ml", price:73700, cat:"skincare", img:"porevida-serum.webp", flyer:"pore-vida.webp" },
  { id:"porevida-exfoliante", brand:"Beauty Creations Skin", name:"Pore Vida Exfoliante líquido AHA", variant:"", desc:"Exfoliación delicada para una piel más lisa.", size:"145 ml", price:73700, cat:"skincare", img:"porevida-exfoliante.webp", flyer:"pore-vida.webp" },
  { id:"porevida-hidratante", brand:"Beauty Creations Skin", name:"Pore Vida Hidratante control de sebo", variant:"", desc:"10% niacinamida. Hidratación ligera.", size:"50 ml", price:73700, cat:"skincare", img:"porevida-hidratante.webp", flyer:"pore-vida.webp" },
  // ---------- Skincare · Refresh & Reset ----------
  { id:"refresh-kit",        brand:"Beauty Creations Skin", name:"Refresh & Reset Kit completo", variant:"Kit 3 productos", desc:"Hidratación, firmeza y piel más radiante.", size:"3 productos", price:192000, cat:"skincare", kit:true, img:"refresh-kit.webp", flyer:"refresh-reset.webp" },
  { id:"refresh-serum",      brand:"Beauty Creations Skin", name:"Refresh & Reset Sérum con péptidos", variant:"", desc:"Mejora la elasticidad y aporta firmeza.", size:"30 ml", price:73700, cat:"skincare", img:"refresh-serum.webp", flyer:"refresh-reset.webp" },
  { id:"refresh-roller",     brand:"Beauty Creations Skin", name:"Refresh & Reset Roller contorno de ojos", variant:"", desc:"Con péptidos. Refresca y desinflama.", size:"14 ml", price:73700, cat:"skincare", img:"refresh-roller.webp", flyer:"refresh-reset.webp" },
  { id:"refresh-hidratante", brand:"Beauty Creations Skin", name:"Refresh & Reset Hidratante con péptidos", variant:"", desc:"Hidratación profunda y piel más firme.", size:"50 ml", price:73700, cat:"skincare", img:"refresh-hidratante.webp", flyer:"refresh-reset.webp" },
  // ---------- Skincare · otros ----------
  { id:"anua-peach-mask", brand:"Anua", name:"Peach 70 + Niacin Brightening Collagen Mask", variant:"Caja x4", desc:"Mascarillas de hidrogel iluminadoras.", size:"4 x 38 g", price:89900, cat:"skincare", img:"anua-peach-mask.webp", flyer:"anua-mask.webp" },
  { id:"ice-roller",      brand:"Ice Roller", name:"Ice Roller facial", variant:"", desc:"Rodillo frío para refrescar el rostro.", size:"", price:16500, cat:"skincare", img:"ice-roller.webp", flyer:"maquillaje-2.webp" },

  // ---------- Maquillaje ----------
  { id:"morphe-jeffree-mist", brand:"Morphe x Jeffree Star", name:"Set & Refresh Mist", variant:"Star-Berry", desc:"Bruma fijadora y refrescante.", size:"79,4 g", price:69000, cat:"maquillaje", img:"morphe-jeffree-mist.webp", flyer:"morphe-mist.webp" },
  { id:"hauslabs-blush",      brand:"Haus Labs", name:"Color Fuse Blush", variant:"Tono rosa coral", desc:"Rubor compacto sin talco, vegano.", size:"5 g", price:139900, cat:"maquillaje", img:"hauslabs-blush.webp", flyer:"haus-labs-blush.webp" },
  { id:"kara-fabulashes-004", brand:"Kara Beauty", name:"Fabulashes 004", variant:"Par", desc:"Efecto 3D con volumen y definición.", size:"1 par", price:14900, cat:"maquillaje", img:"kara-fabulashes-004.webp", flyer:"pestanas.webp" },
  { id:"bc-lashes-maui",      brand:"Beauty Creations", name:"Pestañas Maui", variant:"Par", desc:"Efecto sedoso para una mirada alargada.", size:"1 par", price:14900, cat:"maquillaje", img:"bc-lashes-maui.webp", flyer:"pestanas.webp" },
  { id:"mik-dream-eyeshadow-4",       brand:"MIK Cosmetics", name:"Dream Eyeshadow 4", variant:"", desc:"Sombras de 4 tonos.", size:"", price:10000, cat:"maquillaje", img:"mik-dream-eyeshadow-4.webp", flyer:"maquillaje-1.webp" },
  { id:"mik-dream-highlighter",       brand:"MIK Cosmetics", name:"Dream Highlighter", variant:"", desc:"Iluminador.", size:"", price:12000, cat:"maquillaje", img:"mik-dream-highlighter.webp", flyer:"maquillaje-1.webp" },
  { id:"mik-dream-kit-cejas",         brand:"MIK Cosmetics", name:"Dream Kit de Cejas", variant:"", desc:"Kit para cejas.", size:"", price:12000, cat:"maquillaje", img:"mik-dream-kit-cejas.webp", flyer:"maquillaje-1.webp" },
  { id:"mik-marmol-palette",          brand:"MIK Cosmetics", name:"Marmol Eyeshadow Palette", variant:"", desc:"Paleta de sombras.", size:"", price:12000, cat:"maquillaje", img:"mik-marmol-palette.webp", flyer:"maquillaje-1.webp" },
  { id:"mik-summer-highlighter-blush",brand:"MIK Cosmetics", name:"Summer Highlighter-Blush", variant:"", desc:"Iluminador y rubor.", size:"", price:25000, cat:"maquillaje", img:"mik-summer-highlighter-blush.webp", flyer:"maquillaje-1.webp" },
  { id:"mik-6pan-palette",            brand:"MIK Cosmetics", name:"6-Pan Eyeshadow Palette", variant:"", desc:"Paleta de 6 sombras.", size:"", price:12000, cat:"maquillaje", img:"mik-6pan-palette.webp", flyer:"maquillaje-1.webp" },
  { id:"mik-contour-highlight-blush", brand:"MIK Cosmetics", name:"Contour Highlight Blush", variant:"", desc:"Contorno, iluminador y rubor.", size:"", price:12000, cat:"maquillaje", img:"mik-contour-highlight-blush.webp", flyer:"maquillaje-1.webp" },
  { id:"mik-shiny-sand",              brand:"MIK Cosmetics", name:"Shiny Sand Eyeshadow", variant:"", desc:"Sombras brillantes.", size:"", price:12000, cat:"maquillaje", img:"mik-shiny-sand.webp", flyer:"maquillaje-1.webp" },
  { id:"mik-limpido-mascara",         brand:"MIK Cosmetics", name:"Límpido Mascara Delicate Curly", variant:"", desc:"Pestañas curvas y definidas.", size:"", price:13500, cat:"maquillaje", img:"mik-limpido-mascara.webp", flyer:"maquillaje-2.webp" },
  { id:"thebalm-appetit",       brand:"theBalm", name:"Appétit Eyeshadow Palette", variant:"", desc:"Paleta de sombras.", size:"", price:76000, cat:"maquillaje", img:"thebalm-appetit.webp", flyer:"maquillaje-1.webp" },
  { id:"karite-pigment-primer", brand:"Karité", name:"Pigment Primer", variant:"", desc:"Primer para pigmentos.", size:"12 ml", price:13500, cat:"maquillaje", img:"karite-pigment-primer.webp", flyer:"maquillaje-2.webp" },
  { id:"karite-glitter-primer", brand:"Karité", name:"Glitter Primer", variant:"", desc:"Primer para glitter.", size:"12 ml", price:13500, cat:"maquillaje", img:"karite-glitter-primer.webp", flyer:"maquillaje-2.webp" },
  { id:"eye-eyelash-adhesive",  brand:"Eye", name:"Eyelash Adhesive", variant:"Waterproof clear-white", desc:"Pegante para pestañas a prueba de agua.", size:"7 g", price:16500, cat:"maquillaje", img:"eye-eyelash-adhesive.webp", flyer:"maquillaje-2.webp" },
  { id:"zure-eyeliner",         brand:"Zure", name:"Flawless Eye Liner", variant:"", desc:"Delineador de ojos.", size:"", price:10000, cat:"maquillaje", img:"zure-eyeliner.webp", flyer:"maquillaje-2.webp" },

  // ---------- Otros ----------
  { id:"oki-toilet-seat-cover", brand:"Oki", name:"Toilet Seat Cover", variant:"x20", desc:"Cubre inodoros desechables.", size:"20 unidades", price:4500, cat:"otros", img:"oki-toilet-seat-cover.webp", flyer:"maquillaje-2.webp" }
];
