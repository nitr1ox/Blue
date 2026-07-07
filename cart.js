(function (window) {
  const CART_KEY = "bloommenu_cart";

  function getCart() {
    try {
      const raw = localStorage.getItem(CART_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    updateCartBadges();
    window.dispatchEvent(new CustomEvent("cart:updated", { detail: getCart() }));
  }

  function addToCart(product, qty) {
    qty = qty || 1;
    const cart = getCart();
    const existing = cart.find((i) => i.id === product.id);
    if (existing) {
      existing.qty += qty;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        qty: qty
      });
    }
    saveCart(cart);
    return cart;
  }

  function removeFromCart(id) {
    const cart = getCart().filter((i) => i.id !== id);
    saveCart(cart);
    return cart;
  }

  function updateQty(id, qty) {
    qty = parseInt(qty, 10);
    let cart = getCart();
    if (qty <= 0) {
      cart = cart.filter((i) => i.id !== id);
    } else {
      cart = cart.map((i) => (i.id === id ? { ...i, qty: qty } : i));
    }
    saveCart(cart);
    return cart;
  }

  function clearCart() {
    saveCart([]);
  }

  function getCartCount() {
    return getCart().reduce((sum, i) => sum + i.qty, 0);
  }

  function getSubtotal() {
    return getCart().reduce((sum, i) => sum + i.qty * i.price, 0);
  }

  function getTotals() {
    const subtotal = getSubtotal();
    return { subtotal, total: subtotal };
  }

  function formatPrice(n) {
    return "€" + n.toFixed(2).replace(".", ",");
  }

  function updateCartBadges() {
    const count = getCartCount();
    document.querySelectorAll(".cart-badge").forEach((el) => {
      el.textContent = count;
      el.style.display = count > 0 ? "inline-flex" : "none";
    });
  }

  function placeOrder(customer) {
    const cart = getCart();
    const totals = getTotals();
    const order = {
      id: "BM-" + Math.floor(100000 + Math.random() * 900000),
      date: new Date().toISOString(),
      customer: customer,
      items: cart,
      totals: totals
    };
    console.log("Order placed (simulated):", order);
    try {
      localStorage.setItem("bloommenu_last_order", JSON.stringify(order));
    } catch (e) {}
    clearCart();
    return order;
  }

  window.BloommenuCart = {
    getCart,
    saveCart,
    addToCart,
    removeFromCart,
    updateQty,
    clearCart,
    getCartCount,
    getSubtotal,
    getTotals,
    formatPrice,
    updateCartBadges,
    placeOrder
  };

  document.addEventListener("DOMContentLoaded", updateCartBadges);
})(window);
