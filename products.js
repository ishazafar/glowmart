// ==================== FIREBASE PRODUCTS ====================
// Products are now fetched from Firebase Firestore
let products = []; // Will be populated from Firebase
let productsLoaded = false;

// Import Firebase functions
import { db, collection, getDocs, query, where } from '/firebase/firebase.js';

// ==================== FETCH PRODUCTS FROM FIREBASE ====================
async function fetchProductsFromFirebase() {
  try {
    const productsRef = collection(db, 'products');
    const snapshot = await getDocs(productsRef);
    
    products = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      products.push({
        id: doc.id,
        name: data.name,
        price: data.price,
        image: data.image,
        category: data.category
      });
    });
    
    productsLoaded = true;
    console.log(`✅ Loaded ${products.length} products from Firebase`);
    return products;
  } catch (error) {
    console.error('❌ Error fetching products from Firebase:', error);
    // Fallback to empty array if Firebase fails
    products = [];
    productsLoaded = true;
    return products;
  }
}

// ==================== UTILITY ====================
function getProductById(id) {
  return products.find(p => p.id === id);
}

// ==================== TRACK BEST SELLERS ====================
function increaseProductCount(id) {
  let counts = JSON.parse(localStorage.getItem("productCounts")) || {};
  if (!counts[id]) counts[id] = 0;
  counts[id]++;
  localStorage.setItem("productCounts", JSON.stringify(counts));
}

function renderBestSellers() {
  const container = document.getElementById("best-sellers-container");
  if (!container) return;

  const counts = JSON.parse(localStorage.getItem("productCounts")) || {};
  const sorted = Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    //.slice(0,5)  // optional: top 5 only
    .map(item => item[0]);

  let html = `<div class="product-grid">`;
  sorted.forEach(id => {
    const p = getProductById(id);
    if (p) {
      html += `
        <div class="product-card">
          <img src="${p.image}" alt="${p.name}">
          <h3>${p.name}</h3>
          <p>₨${p.price}</p>
          <button onclick="addToCart('${p.id}')">Add to Cart</button>
        </div>
      `;
    }
  });
  html += "</div>";
  container.innerHTML = html;
}

// ==================== ADD TO CART ====================
function addToCart(id) {
  const product = getProductById(id);
  if (!product) return alert("Product not found!");

  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const existing = cart.find(p => p.id === id);
  if (existing) existing.qty += 1;
  else cart.push({ ...product, qty: 1 });

  localStorage.setItem("cart", JSON.stringify(cart));

  // Track Best Sellers
  increaseProductCount(id);
  renderBestSellers();

  alert(`${product.name} added to cart!`);
}

// ==================== RENDER CATEGORY PRODUCTS ====================
function renderProducts(category, containerId, headingText) {
  const container = document.getElementById(containerId);
  if (!container) return;

  let filtered = products.filter(p => p.category === category);
  
  if (filtered.length === 0) {
    container.innerHTML = `<h2>${headingText}</h2><div class="empty-state"><p>No products found in this category.</p></div>`;
    return;
  }
  
  let html = `<h2>${headingText}</h2><div class="product-grid">`;
  filtered.forEach(p => {
    html += `
      <div class="product-card">
        <img src="${p.image}" alt="${p.name}">
        <h3>${p.name}</h3>
        <p>₨${p.price.toLocaleString()}</p>
        <button onclick="addToCart('${p.id}')">Add to Cart</button>
      </div>
    `;
  });
  html += "</div>";
  container.innerHTML = html;
}

// ==================== PAGE LOAD ====================
window.addEventListener("DOMContentLoaded", async () => {
  // Show loading state if containers exist
  const containers = document.querySelectorAll("[data-category]");
  if (containers.length > 0) {
    containers.forEach(c => {
      c.innerHTML = '<p style="text-align:center; padding:20px;">Loading products...</p>';
    });
  }

  // Fetch products from Firebase
  await fetchProductsFromFirebase();

  // Render products for each category container
  containers.forEach(c => {
    const cat = c.getAttribute("data-category");
    const heading = c.getAttribute("data-heading") || cat;
    renderProducts(cat, c.id, heading);
  });

  // Render best sellers if container exists
  renderBestSellers();
});

// Export functions and products for use in other files
window.getProductById = getProductById;
window.addToCart = addToCart;
window.fetchProductsFromFirebase = fetchProductsFromFirebase;
window.products = products; // Export products array
