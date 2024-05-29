// Para sa Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAHFvMQc6o_Om5AvcMW7cRvEw4ZoGxYE9Q",
  authDomain: "login-signup-database-9b7a8.firebaseapp.com",
  databaseURL: "https://login-signup-database-9b7a8-default-rtdb.firebaseio.com",
  projectId: "login-signup-database-9b7a8",
  storageBucket: "login-signup-database-9b7a8.appspot.com",
  messagingSenderId: "412421968780",
  appId: "1:412421968780:web:ba0741927c5461fa1afca9",
  measurementId: "G-HRS5KPTZGG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

console.log('Firebase initialized:', app.name);

// code for signup submission form
const signupForm = document.getElementById('signupForm');
if (signupForm) {
  signupForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const username = document.getElementById('signupUsername').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    // Firebase signup
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        return set(ref(database, 'users/' + user.uid), {
          username: username,
          email: email
        });
      })
      .then(() => {
        alert('Signup Successful..');
        window.location.href = 'dashboard.html';
      })
      .catch((error) => {
        console.error('Signup error:', error);
        alert('Signup Failed: Email has Already been used');
      });
  });
}

// function for login submission form
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const email = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {

        const user = userCredential.user;
        console.log('User signed in:', user);
        window.location.href = 'dashboard.html';
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error('Login error: Incorrect Email or Password.',);
        alert('Login Failed: Incorrect Email or Password');
      });
  });
}// End of Sign in and Login

// para sa logout Button sa homepage
window.onload = function () {
  document.querySelector('.logout').addEventListener('click', function () {
    window.location.href = "loginform.html";
  });
};

document.addEventListener('DOMContentLoaded', () => {
  const isWishlistPage = window.location.pathname.includes('wishlist.html');
  const containerSelector = isWishlistPage ? '.main-body' : '.main-body';

  // fetch my json file into the dashboard, cart and wishlist
  if (isWishlistPage) {
    displayWishlist(containerSelector);
  } else {
    fetch('js/products.json')
      .then(response => response.json())
      .then(products => {
        displayProducts(products, containerSelector);
      })
      .catch(error => console.error('Error fetching products:', error));
  }
});

function displayProducts(products, containerSelector) {
  const mainBody = document.querySelector(containerSelector);

  if (mainBody) {
    products.forEach(product => {
      const productCard = document.createElement('div');
      productCard.classList.add('product_card');

      productCard.innerHTML = `
            <div class="product_details">
              <div class="img">
                <img src="${product.imgSrc}" alt="${product.name}">
                <i class="fas fa-heart wishlist-icon"></i>
              </div>
              <div class="text">
                <h2 class="product-name">${product.name}</h2>
                <span>${product.price.toFixed(2)}</span>
              </div>
            </div>
            <div class="product_action">
              <button class="add-to-cart">Add to Cart</button>
            </div>
          `;

      const addToCartButton = productCard.querySelector('.add-to-cart');
      addToCartButton.addEventListener('click', () => addToCartClicked(product));

      const wishlistButton = productCard.querySelector('.wishlist-icon');
      wishlistButton.addEventListener('click', () => addToWishlist(product));

      mainBody.appendChild(productCard);
    });
  }
}

function displayWishlist(containerSelector) {
  const mainBody = document.querySelector(containerSelector);
  const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

  if (mainBody) {
    mainBody.innerHTML = '';
    wishlist.forEach(product => {
      const productCard = document.createElement('div');
      productCard.classList.add('product_card');

      productCard.innerHTML = `
            <div class="product_details">
              <div class="img">
                <img src="${product.imgSrc}" alt="${product.name}">
              </div>
              <div class="text">
                <h2 class="product-name">${product.name}</h2>
                <span>${product.price.toFixed(2)}</span>
              </div>
            </div>
            <div class="product_action">
              <button class="remove-from-wishlist">Remove</button>
            </div>
          `;

      const removeFromWishlistButton = productCard.querySelector('.remove-from-wishlist');
      removeFromWishlistButton.addEventListener('click', () => removeFromWishlist(product.name));

      mainBody.appendChild(productCard);
    });
  }
}

function addToWishlist(product) {
  const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
  if (!wishlist.some(item => item.name === product.name)) {
    wishlist.push(product);
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    alert('Product added to wishlist: ' + product.name);
  } else {
    alert('Product is already in wishlist: ' + product.name);
  }
}

function removeFromWishlist(productName) {
  let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
  wishlist = wishlist.filter(product => product.name !== productName);
  localStorage.setItem('wishlist', JSON.stringify(wishlist));
  displayWishlist('.main-body');
}


function addToCartClicked(product) {
  addToCart(product);
  alert('Product Added to cart: ' + product.name);
}

function addToCart(product) {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const existingProduct = cart.find(item => item.name === product.name);

  if (existingProduct) {
    existingProduct.quantity++;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  localStorage.setItem('cart', JSON.stringify(cart));
  console.log('Cart added the product:', cart);
}

function updateCartIcon() {
  const cartIcon = document.querySelector('.cart span.cart');
  if (cartIcon) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    cartIcon.textContent = cartCount;
  }
}

// para sa search bar
function search() {
  let filter = document.getElementById('searchInput').value.toUpperCase();
  let items = document.querySelectorAll('.product_card');
  let productNames = document.querySelectorAll('.product-name');

  for (let i = 0; i < productNames.length; i++) {
    let productName = productNames[i].innerHTML || productNames[i].innerText || productNames[i].textContent;
    if (productName.toUpperCase().indexOf(filter) > -1) {
      items[i].style.display = "";
    } else {
      items[i].style.display = "none";
    }
  }
}

document.getElementById('searchInput').addEventListener('keyup', search);



