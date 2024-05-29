let cart = [];

document.addEventListener('DOMContentLoaded', () => {
  loadCart();
  displayCart();
});

function displayCart() {
  const cartContainer = document.getElementById('cart-container');
  const totalPriceSpan = document.getElementById('total-price');
  cartContainer.innerHTML = '';
  let totalPrice = 0;

  cart.forEach(item => {
    const itemContainer = document.createElement('div');
    itemContainer.classList.add('cart-item');
    itemContainer.innerHTML = `
      <img src="${item.imgSrc}" alt="${item.name}" class="cart-item-image">
      <p>${item.name} - Quantity: ${item.quantity}</p>
      <button onclick="increaseQuantity('${item.name}')">+</button>
      <button onclick="decreaseQuantity('${item.name}')">-</button>
      <button onclick="removeFromCart('${item.name}')">Remove</button>
    `;

    cartContainer.appendChild(itemContainer);
    totalPrice += item.price * item.quantity;
  });

  totalPriceSpan.textContent = totalPrice.toFixed(2);
}

function increaseQuantity(productName) {
  const product = cart.find(item => item.name === productName);
  product.quantity++;
  saveCart();
  displayCart();
}

function decreaseQuantity(productName) {
  const product = cart.find(item => item.name === productName);
  if (product.quantity > 1) {
    product.quantity--;
  } else {
    removeFromCart(productName);
  }
  saveCart();
  displayCart();
}

function removeFromCart(productName) {
  cart = cart.filter(item => item.name !== productName);
  saveCart();
  displayCart();
}

function checkout() {
  alert('Checkout items Successfully');
  cart = [];
  saveCart();
  displayCart();
}

function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

function loadCart() {
  const storedCart = localStorage.getItem('cart');
  if (storedCart) {
    cart = JSON.parse(storedCart);
  }
}
// para sa logout Button sa homepage
window.onload = function () {
  document.querySelector('.logout').addEventListener('click', function () {
    window.location.href = "loginform.html";
  });
};