function getCart() {
  return JSON.parse(localStorage.getItem("cakesByNicoleCart")) || [];
}

function saveCart(cart) {
  localStorage.setItem("cakesByNicoleCart", JSON.stringify(cart));
}

function getTotal() {
  let total = 0;

  getCart().forEach(function (item) {
    total += Number(item.price.replace("$", ""));
  });

  return total;
}

function updateCartTotal() {
  const cartTotal = document.getElementById("cartTotal");

  if (cartTotal) {
    cartTotal.textContent = "$" + getTotal().toFixed(2);
  }
}

function addCardToCart(card) {
  const item = {
    name: card.querySelector("h3").textContent.trim(),
    price: card.querySelector("p").textContent.trim(),
    icon: card.querySelector(".cake-icon").textContent.trim()
  };

  const cart = getCart();
  cart.push(item);
  saveCart(cart);
  updateCartTotal();
}

function setupCartButtons() {
  document.querySelectorAll(".product-card button").forEach(function (button) {
    button.addEventListener("click", function () {
      const card = button.closest(".product-card");
      addCardToCart(card);
    });
  });
}

function filterCards(searchText) {
  const cards = document.querySelectorAll(".product-card");
  const search = (searchText || "").toLowerCase().trim();

  cards.forEach(function (card) {
    const name = card.querySelector("h3").textContent.toLowerCase();

    if (search === "" || search === "all cakes" || name.includes(search)) {
      card.style.display = "block";
    } else {
      card.style.display = "none";
    }
  });
}

function setupSearchForms() {
  const homeSearchForm = document.getElementById("homeSearchForm");
  const homeSearchInput = document.getElementById("homeSearchInput");

  if (homeSearchForm && homeSearchInput) {
    homeSearchForm.addEventListener("submit", function (event) {
      event.preventDefault();
      const search = homeSearchInput.value || "All Cakes";
      window.location.href = "cakes.html?search=" + encodeURIComponent(search);
    });
  }

  const cakeSearchForm = document.getElementById("cakeSearchForm");
  const searchInput = document.getElementById("searchInput");

  if (cakeSearchForm && searchInput) {
    cakeSearchForm.addEventListener("submit", function (event) {
      event.preventDefault();
      filterCards(searchInput.value);
    });

    searchInput.addEventListener("input", function () {
      filterCards(searchInput.value);
    });

    const params = new URLSearchParams(window.location.search);
    const search = params.get("search") || "All Cakes";

    searchInput.value = search;
    filterCards(search);
  }
}

function setupMobileDropdown() {
  const departmentButton = document.getElementById("departmentButton");
  const departmentMenu = document.getElementById("departmentMenu");

  if (departmentButton && departmentMenu) {
    departmentButton.addEventListener("click", function () {
      departmentMenu.classList.toggle("show");
    });
  }
}

function renderCart() {
  const cartItems = document.getElementById("cartItems");
  const cartSummary = document.getElementById("cartSummary");

  if (!cartItems || !cartSummary) return;

  const cart = getCart();

  if (cart.length === 0) {
    cartItems.innerHTML = '<p class="empty-cart">Your cart is empty.</p>';
  } else {
    cartItems.innerHTML = cart.map(function (item, index) {
      return `
        <div class="cart-item">
          <div class="cart-item-icon">${item.icon}</div>
          <div>
            <h3>${item.name}</h3>
          </div>
          <p>${item.price}</p>
          <button class="remove-button" type="button" onclick="removeItem(${index})">Remove</button>
        </div>
      `;
    }).join("");
  }

  cartSummary.textContent = "Total: $" + getTotal().toFixed(2);
}

function removeItem(index) {
  const cart = getCart();
  cart.splice(index, 1);
  saveCart(cart);
  renderCart();
  updateCartTotal();
}

function setupCheckout() {
  const checkoutButton = document.getElementById("checkoutButton");

  if (!checkoutButton) return;

  checkoutButton.addEventListener("click", function () {
    const cart = getCart();

    if (cart.length === 0) {
      alert("Please Add a Product to your Cart First!");
      return;
    }

    saveCart([]);

    document.getElementById("cartItems").innerHTML =
      '<p class="order-message">Order completed! 🎉</p>';

    document.getElementById("cartSummary").style.display = "none";
    checkoutButton.style.display = "none";
    updateCartTotal();
  });
}

document.addEventListener("DOMContentLoaded", function () {
  setupCartButtons();
  setupSearchForms();
  setupMobileDropdown();
  renderCart();
  setupCheckout();
  updateCartTotal();
});