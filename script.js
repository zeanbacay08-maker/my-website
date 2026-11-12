const products = [
  {id:1,name:"VisionX Air",price:3499,description:"Lightweight design with Bluetooth audio and voice control.",color:""},
  {id:2,name:"VisionX Camera",price:4299,description:"Capture everyday moments with a built-in hands-free camera.",color:"purple"},
  {id:3,name:"VisionX Classic",price:2999,description:"A timeless frame with smart connectivity for daily use.",color:"sand"}
];
let cart = [];
const money = amount => "₱" + amount.toLocaleString("en-PH");
const productGrid = document.getElementById("productGrid");

productGrid.innerHTML = products.map(p => `
  <article class="product-card">
    <div class="product-art ${p.color}"><div class="product-glasses">◉━━◉</div></div>
    <div class="product-info">
      <div class="product-top"><h3>${p.name}</h3><span class="price">${money(p.price)}</span></div>
      <p>${p.description}</p>
      <button class="button primary add-button" data-id="${p.id}">Add to cart +</button>
    </div>
  </article>`).join("");

productGrid.addEventListener("click", e => {
  const button = e.target.closest(".add-button");
  if (!button) return;
  addToCart(Number(button.dataset.id));
});

function addToCart(id) {
  const existing = cart.find(item => item.id === id);
  if (existing) existing.quantity++;
  else cart.push({id,quantity:1});
  renderCart();
  openCart();
}
function changeQuantity(id, amount) {
  const item = cart.find(item => item.id === id);
  if (!item) return;
  item.quantity += amount;
  if (item.quantity <= 0) cart = cart.filter(item => item.id !== id);
  renderCart();
}
function removeItem(id) {
  cart = cart.filter(item => item.id !== id);
  renderCart();
}
function getTotal() {
  return cart.reduce((sum,item) => sum + products.find(p => p.id === item.id).price * item.quantity,0);
}
function renderCart() {
  const count = cart.reduce((sum,item) => sum + item.quantity,0);
  document.getElementById("cartCount").textContent = count;
  document.getElementById("cartTotal").textContent = money(getTotal());
  document.getElementById("checkoutTotal").textContent = money(getTotal());
  const container = document.getElementById("cartItems");
  if (!cart.length) {
    container.innerHTML = '<p class="empty-cart">Your cart is empty. Find your perfect pair!</p>';
    return;
  }
  container.innerHTML = cart.map(item => {
    const p = products.find(product => product.id === item.id);
    return `<div class="cart-item">
      <div><b>${p.name}</b><small>${money(p.price)} each</small>
      <div class="quantity-controls"><button data-action="minus" data-id="${p.id}">−</button><span>${item.quantity}</span><button data-action="plus" data-id="${p.id}">+</button></div></div>
      <div><b>${money(p.price * item.quantity)}</b><br><button class="remove-item" data-action="remove" data-id="${p.id}">Remove</button></div>
    </div>`;
  }).join("");
}
document.getElementById("cartItems").addEventListener("click",e => {
  const btn=e.target.closest("button[data-action]"); if(!btn)return;
  const id=Number(btn.dataset.id);
  if(btn.dataset.action==="plus")changeQuantity(id,1);
  if(btn.dataset.action==="minus")changeQuantity(id,-1);
  if(btn.dataset.action==="remove")removeItem(id);
});
const drawer=document.getElementById("cartDrawer"), overlay=document.getElementById("cartOverlay");
function openCart(){drawer.classList.add("show");overlay.classList.add("show");drawer.setAttribute("aria-hidden","false")}
function closeCart(){drawer.classList.remove("show");overlay.classList.remove("show");drawer.setAttribute("aria-hidden","true")}
document.getElementById("openCart").addEventListener("click",openCart);
document.getElementById("closeCart").addEventListener("click",closeCart);
overlay.addEventListener("click",closeCart);
document.getElementById("checkoutButton").addEventListener("click",()=>{
  if(!cart.length){alert("Your cart is empty. Please add a product first.");return;}
  closeCart();document.getElementById("checkoutModal").classList.add("show");
});
document.getElementById("closeCheckout").addEventListener("click",()=>document.getElementById("checkoutModal").classList.remove("show"));
document.getElementById("checkoutModal").addEventListener("click",e=>{if(e.target.id==="checkoutModal")e.currentTarget.classList.remove("show")});
document.getElementById("checkoutForm").addEventListener("submit",e=>{
  e.preventDefault();
  const name=document.getElementById("buyerName").value.trim();
  const orderNumber="VX"+Math.floor(10000+Math.random()*90000);
  document.getElementById("checkoutFeedback").textContent=`Thank you, ${name}! Demo order ${orderNumber} has been created. This is not a real purchase.`;
  cart=[];renderCart();e.target.reset();
});
document.getElementById("contactForm").addEventListener("submit",e=>{
  e.preventDefault();
  document.getElementById("contactFeedback").textContent="Thank you! Your demo message has been recorded on this page.";
  e.target.reset();
});
document.getElementById("menuToggle").addEventListener("click",()=>document.getElementById("navLinks").classList.toggle("open"));
document.querySelectorAll("#navLinks a").forEach(a=>a.addEventListener("click",()=>document.getElementById("navLinks").classList.remove("open")));
renderCart();
