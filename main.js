// ====== PRODUCTS ARRAY ======
const products = [
  { id: "p1", name: "Alif Ahlam Herbs Infused Hair Oil", price: 950, img: "images/haircare/Alif%20Ahlam%20Herbs%20Infused%20Hair%20Oil.jpeg" },
  { id: "p2", name: "Rivaj Hair Oil", price: 780, img: "images/haircare/Rivaaj%20hair%20oil.jpeg" },
  { id: "p3", name: "RIVAJ Hair Oil & Shampoo", price: 1250, img: "images/haircare/RIVAJ%20HAIR%20OIL%20and%20SHAMPOO.jpeg" },
  { id: "p4", name: "Kemei Hair Straightener", price: 2800, img: "images/haircare/Kemei%20Hair%20Straightener.jpeg" },
  { id: "p5", name: "Brushes Straightener", price: 1950, img: "images/haircare/Brushes%20Straightener.jpeg" },
  { id: "p6", name: "Hair Dryer & Volumizer", price: 3200, img: "images/haircare/hair%20dryer%20and%20volumizer.jpeg" },
  { id: "p7", name: "Remington Sleek & Curl", price: 4500, img: "images/haircare/Remington%20Sleek%20and%20Curl.jpeg" },
  { id: "p8", name: "Keratin Hair Mask & Hair Food Oil", price: 1150, img: "images/haircare/Keratin%20Hair%20Mask%20and%20Hair%20Food%20Oil.jpeg" },
  { id: "p9", name: "Derma Roller", price: 950, img: "images/haircare/Derma%20Roller.jpeg" },
  { id: "p10", name: "Hair Care Combo Deal", price: 2999, img: "images/haircare/hair%20deal.jpeg" },
  { id: "p11", name: "Winter Special Deal", price: 2450, img: "images/haircare/WINTER%20SPECIAL%20DEAL.jpeg" },
  { id: "p12", name: "Fit me & Huda Beauty Deal", price: 2499, img: "images/makeup/Fit%20me%20&%20huda%20beauty%20deal.jpeg" },
  { id: "p13", name: "Madam Nail Polishes", price: 1200, img: "images/makeup/Madam%20nail%20polishes.jpeg" },
  { id: "p14", name: "WP Black Deal(313)", price: 2099, img: "images/makeup/wp_black_deal_313.jpeg" },
  { id: "p15", name: "Huda Beauty Deal", price: 3499, img: "images/makeup/Huda%20beauty%20deal.jpeg" },
  { id: "p16", name: "Huda Beauty Pallet", price: 1099, img: "images/makeup/Huda%20beauty%20pallet.jpeg" },
  { id: "p17", name: "Kashee's Special Deal", price: 2150, img: "images/makeup/kashees_special_deal.jpeg" },
  { id: "p18", name: "Mega Deal of Huda Beauty", price: 4999, img: "images/makeup/Mega%20deal%20of%20huda%20beauty.jpeg" },
  { id: "p19", name: "Peel Off Nail Paints", price: 1600, img: "images/makeup/Peel%20off%20nail%20paints.jpeg" },
  { id: "p20", name: "Pixi Blushes", price: 920, img: "images/makeup/Pixi%20Blushes.jpeg" },
  { id: "p21", name: "Hang Fang Lipsticks", price: 1599, img: "images/makeup/Hang%20fang%20lipsticks.jpeg" },
  { id: "p22", name: "Elegant Rose Perfume", price: 1450, img: "images/perfumes/Elegant%20Rose%20Perfume.jpeg" },
  { id: "p23", name: "Citrus Splash Perfume", price: 1150, img: "images/perfumes/Citrus%20Splash%20Perfume.jpeg" },
  { id: "p24", name: "Midnight Musk", price: 1700, img: "images/perfumes/Midnight%20Musk.jpeg" },
  { id: "p25", name: "Vanilla Whisper", price: 1320, img: "images/perfumes/Vanilla%20Whisper.jpeg" },
  { id: "p26", name: "Ocean Breeze", price: 1100, img: "images/perfumes/Ocean%20Breeze.jpeg" },
  { id: "p27", name: "Spicy Amber", price: 1650, img: "images/perfumes/Spicy%20Amber.jpeg" },
  { id: "p28", name: "Lemon Glow", price: 980, img: "images/perfumes/Lemon%20Glow.jpeg" },
  { id: "p29", name: "Mystic Lavender", price: 1200, img: "images/perfumes/Mystic%20Lavender.jpeg" },
  { id: "p30", name: "Golden Sandal", price: 1800, img: "images/perfumes/Golden%20Sandal.jpeg" }
];

// ====== CART & BADGE ======
let cart = JSON.parse(localStorage.getItem('cart')) || [];
const badge = document.getElementById('cartCountBadge');

function updateCartBadge() {
  const totalItems = cart.reduce((sum, item) => sum + (item.qty || 0), 0);
  badge.style.display = totalItems > 0 ? 'inline-block' : 'none';
  badge.textContent = totalItems;
}

// ====== ADD TO CART WITH CLICK TRACKING ======
function addToCart(name, price) {
  const existing = cart.find(item => item.name === name);
  existing ? existing.qty++ : cart.push({ name, price, qty: 1 });
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartBadge();

  // Click tracking
  let clicks = JSON.parse(localStorage.getItem('clicks')) || {};
  clicks[name] = (clicks[name] || 0) + 1;
  localStorage.setItem('clicks', JSON.stringify(clicks));
  updateBestResellers();

  // Success message
  const card = Array.from(document.querySelectorAll('.product')).find(p => p.querySelector('h3').innerText === name);
  if (card) {
    const msg = document.createElement('div');
    msg.className = 'msg';
    msg.innerText = 'Successfully added to cart!';
    card.appendChild(msg);
    setTimeout(() => { msg.style.opacity = 0; setTimeout(() => msg.remove(), 500); }, 2000);
  }
}

// ====== BEST RESELLERS ======
function updateBestResellers() {
  const clicks = JSON.parse(localStorage.getItem('clicks')) || {};
  const bestContainer = document.querySelector('.best-sellers-container');
  if (!bestContainer) return;

  bestContainer.innerHTML = "";
  const sorted = Object.entries(clicks).sort((a, b) => b[1] - a[1]);
  sorted.slice(0, 5).forEach(([name]) => {
    const product = products.find(p => p.name === name);
    if (product) {
      const div = document.createElement('div');
      div.className = 'product';
      div.innerHTML = `
        <div class="img-wrap"><img src="${product.img}" alt="${product.name}"></div>
        <h3>${product.name}</h3>
        <p>Rs. ${product.price}</p>
        <button onclick="addToCart('${product.name.replace(/'/g,"\\'")}', ${product.price})">Add to Cart</button>
      `;
      bestContainer.appendChild(div);
    }
  });
}

// ====== SEARCH FILTER FUNCTION ======
const searchInput = document.getElementById('navSearchInput');
const productRows = document.querySelectorAll('.products-container, .best-sellers-container'); 

searchInput.addEventListener('input', () => {
  const query = searchInput.value.toLowerCase();
  productRows.forEach(row => {
    const cards = row.querySelectorAll('.product');
    cards.forEach(card => {
      const title = card.querySelector('h3').innerText.toLowerCase();
      card.style.display = title.includes(query) ? 'block' : 'none';
    });
  });
});

// ====== INIT ON PAGE LOAD ======
document.addEventListener("DOMContentLoaded", () => {
  updateBestResellers();
  updateCartBadge();
});
