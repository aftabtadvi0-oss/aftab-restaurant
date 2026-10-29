// Owner's WhatsApp number: country code + number, no "+" or spaces
const WHATSAPP_NUMBER = "916301117210";
const PHONE_DISPLAY = "+91 63011 17210";
const PHONE_TEL = "tel:+916301117210";

// ============ PASTE YOUR GOOGLE MAPS LINK HERE ============
// 1. Open your restaurant in Google Maps, tap Share, then copy the link.
// 2. Put that link between the quotes below. Example:
//    const MAPS_LINK = "https://maps.app.goo.gl/abc123";
//    You can also write your full address instead: "Street No. 1, Hyderabad 500005"
const MAPS_LINK = "Street No. 1, Gulshan-e-Iqbal Colony, Hyderabad, Telangana 500005";

// 3. (Optional, best looking) In Google Maps choose Share > Embed a map,
//    copy the link inside src="..." and paste it here. Leave "" to skip.
const MAPS_EMBED = "";
// ==========================================================

const menu = [
  { name: "Chicken Dum Biryani", desc: "Full · with raita & mirchi ka salan", price: 320, cat: "biryani", img: "images/biryani.jpg" },
  { name: "Mutton Dum Biryani", desc: "Full · slow-cooked kacchi style", price: 420, cat: "biryani", img: "images/mutton-biryani.jpg" },
  { name: "Special Habib Biryani", desc: "Family pack · serves 4", price: 999, cat: "biryani", img: "images/special-biryani.jpg" },
  { name: "Egg Biryani", desc: "Full", price: 220, cat: "biryani", img: "images/egg-biryani.jpg" },
  { name: "Hyderabadi Haleem", desc: "Mutton · fried onions & lemon", price: 280, cat: "curry", img: "images/haleem.jpg" },
  { name: "Mutton Marag", desc: "Spiced bone broth", price: 300, cat: "curry", img: "images/mutton-marag.jpg" },
  { name: "Chicken Korma", desc: "Rich cashew gravy", price: 260, cat: "curry", img: "images/chicken-korma.jpg" },
  { name: "Butter Naan", desc: "Tandoor fresh", price: 40, cat: "curry", img: "images/butter-naan.jpg" },
  { name: "Chicken 65", desc: "Hyderabadi style", price: 240, cat: "starter", img: "images/chicken-65.jpg" },
  { name: "Tala Hua Gosht", desc: "Pan-fried mutton", price: 340, cat: "starter", img: "images/tala-hua-gosht.jpg" },
  { name: "Seekh Kebab", desc: "4 pcs", price: 260, cat: "starter", img: "images/seekh-kebab.jpg" },
  { name: "Double Ka Meetha", desc: "Saffron bread pudding", price: 120, cat: "sweet", img: "images/double-ka-meetha.jpg" },
  { name: "Qubani Ka Meetha", desc: "Apricot dessert with cream", price: 140, cat: "sweet", img: "images/qubani-ka-meetha.jpg" },
  { name: "Irani Chai", desc: "With Osmania biscuit", price: 30, cat: "sweet", img: "images/irani-chai.jpg" },
];

const waLink = (msg) => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;

// Each dish: photo on top, name, price directly under the photo, then order button
function render(cat) {
  const list = document.getElementById("menu-list");
  list.innerHTML = menu
    .filter((i) => cat === "all" || i.cat === cat)
    .map(
      (i, idx) => `
      <article class="dish" style="animation-delay:${idx * 40}ms">
        <div class="dish-photo"><img src="${i.img}" alt="${i.name}" loading="lazy" /></div>
        <h3>${i.name}</h3>
        <small>${i.desc}</small>
        <p class="dish-price">₹${i.price}</p>
        <a class="add" href="${waLink(`Hi Habib Restaurant, I want to order: ${i.name} (₹${i.price})`)}" target="_blank" rel="noopener">Order on WhatsApp</a>
      </article>`
    )
    .join("");
}

document.querySelectorAll(".tab").forEach((tab) =>
  tab.addEventListener("click", () => {
    document.querySelector(".tab.active").classList.remove("active");
    tab.classList.add("active");
    render(tab.dataset.cat);
  })
);

// Fallback: any element still using data-wa gets a real WhatsApp link (no popups)
document.querySelectorAll("[data-wa]").forEach((el) => {
  if (!el.getAttribute("href")) el.setAttribute("href", waLink(el.dataset.wa));
  if (!el.getAttribute("target")) el.setAttribute("target", "_blank");
  el.setAttribute("rel", "noopener");
});

// Scroll reveal
const io = new IntersectionObserver((entries) =>
  entries.forEach((en) => en.isIntersecting && en.target.classList.add("show"))
);
document.querySelectorAll("section:not(.hero)").forEach((s) => {
  s.classList.add("reveal");
  io.observe(s);
});

document.getElementById("year").textContent = new Date().getFullYear();
render("all");

// ---- Google Maps: "Get Directions" button + embedded map ----
function mapsEmbedSrc() {
  if (MAPS_EMBED) return MAPS_EMBED;
  const link = MAPS_LINK.trim();
  if (!link) return "";
  if (/^https:\/\/(www\.)?google\.[^/]*\/maps\/embed\?/i.test(link)) return link;
  const at = link.match(/@(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/);
  if (at) return `https://www.google.com/maps?q=${at[1]},${at[2]}&z=16&output=embed`;
  const q = link.match(/[?&](?:q|destination)=([^&]+)/);
  if (q) return `https://www.google.com/maps?q=${q[1]}&z=16&output=embed`;
  if (/^(https?:\/\/|maps\.app\.goo\.gl|goo\.gl)/i.test(link)) return "";
  return `https://www.google.com/maps?q=${encodeURIComponent(link)}&z=16&output=embed`;
}

const mapsBtn = document.getElementById("maps-btn");
const mapsFrame = document.getElementById("maps-frame");
const mapsEmpty = document.getElementById("maps-empty");
const mapsSrc = mapsEmbedSrc();

const mapsLink = MAPS_LINK.trim();
const mapsHref = !mapsLink
  ? ""
  : /^https?:\/\//i.test(mapsLink)
    ? mapsLink
    : `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(mapsLink)}`;

if (mapsBtn) {
  if (mapsHref) mapsBtn.href = mapsHref;
  else mapsBtn.style.display = "none";
}
if (mapsFrame && mapsSrc) {
  mapsFrame.src = mapsSrc;
  if (mapsEmpty) mapsEmpty.style.display = "none";
}

// Solid nav bar once you scroll, so cards never sit under the transparent header
const nav = document.querySelector(".nav");
const setNav = () => nav.classList.toggle("solid", window.scrollY > 40);
setNav();
window.addEventListener("scroll", setNav, { passive: true });
