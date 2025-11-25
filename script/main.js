// Cart array
let cart = [];

// DOM elements
const cartItems = document.getElementById('cart-items');
const totalEl = document.getElementById('total');
const checkoutBtn = document.getElementById('checkout');
const cartSidebar = document.getElementById('cart-sidebar');
const cartOverlay = document.getElementById('cart-overlay');
const closeCartBtn = document.getElementById('close-cart');
const cartToggle = document.getElementById('cart-toggle');
const cartCount = document.getElementById('cart-count');

// Initialize cart from localStorage
function loadCart() {
    const savedCart = localStorage.getItem('beckysPizzaCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCart();
    }
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('beckysPizzaCart', JSON.stringify(cart));
}

// Update cart count in header
function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    // Update cart count on menu page
    const menuCartCount = document.querySelector('#cart-toggle #cart-count');
    if (menuCartCount) {
        menuCartCount.textContent = totalItems;
    }
}

// Add event listeners to "Add to Cart" buttons
function initializeAddToCartButtons() {
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', () => {
            const itemDiv = button.parentElement;
            const name = button.dataset.name;
            const price = parseInt(button.dataset.price);
            const quantityInput = itemDiv.querySelector('.quantity');
            const quantity = parseInt(quantityInput.value);

            // Validate quantity
            if (quantity < 1) {
                quantityInput.value = 1;
                return;
            }

            // Check if item already in cart
            const existingItem = cart.find(i => i.name === name);
            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                cart.push({ name, price, quantity });
            }

            updateCart();
            saveCart();
            openCart();
            
            // Show added animation
            button.textContent = 'Added! ✓';
            button.style.background = '#25D366';
            setTimeout(() => {
                button.textContent = 'Add to Cart';
                button.style.background = '';
            }, 1500);
        });
    });
}

// Update cart display
function updateCart() {
    cartItems.innerHTML = '';
    let total = 0;

    if (cart.length === 0) {
        cartItems.innerHTML = '<li class="empty-cart">Your cart is empty</li>';
    } else {
        cart.forEach((item, index) => {
            const li = document.createElement('li');
            const itemTotal = item.price * item.quantity;
            total += itemTotal;

            li.innerHTML = `
                <div class="cart-item">
                    <div class="cart-item-info">
                        <div class="cart-item-name">${item.name}</div>
                        <div class="cart-item-price">KSh ${item.price} × ${item.quantity}</div>
                    </div>
                    <div class="cart-item-controls">
                        <input type="number" min="1" value="${item.quantity}" class="cart-qty" data-index="${index}">
                        <button class="remove-item" data-index="${index}" title="Remove item">&times;</button>
                    </div>
                </div>
            `;
            cartItems.appendChild(li);
        });
    }

    totalEl.textContent = total.toLocaleString();
    updateCartCount();

    // Quantity change listener
    document.querySelectorAll('.cart-qty').forEach(input => {
        input.addEventListener('change', (e) => {
            const idx = e.target.dataset.index;
            const val = parseInt(e.target.value);
            
            if (val < 1) {
                e.target.value = 1;
                cart[idx].quantity = 1;
            } else {
                cart[idx].quantity = val;
            }
            
            updateCart();
            saveCart();
        });
    });

    // Remove item listener
    document.querySelectorAll('.remove-item').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const idx = e.target.dataset.index;
            cart.splice(idx, 1);
            updateCart();
            saveCart();
        });
    });
}

// Checkout button with WhatsApp integration
checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }

    // Prepare WhatsApp message
    let message = 'Hello Becky\'s Pizza, I would like to place this order:%0A%0A';
    cart.forEach(item => {
        message += `• ${item.name} x${item.quantity} = KSh ${(item.price * item.quantity).toLocaleString()}%0A`;
    });
    
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    message += `%0ATotal: KSh ${total.toLocaleString()}%0A%0A`;
    message += 'Please confirm my order. Thank you! 🍕';

    // WhatsApp link
    const phoneNumber = '254700000000'; // Replace with actual number
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');

    // Optional: Clear cart after order
    // cart = [];
    // updateCart();
    // saveCart();
    // closeCart();
});

// Cart sidebar functions
function openCart() {
    cartSidebar.classList.add('active');
    cartOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeCart() {
    cartSidebar.classList.remove('active');
    cartOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

// Event listeners for cart
if (cartToggle) {
    cartToggle.addEventListener('click', openCart);
}
closeCartBtn.addEventListener('click', closeCart);
cartOverlay.addEventListener('click', closeCart);

// Close cart with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && cartSidebar.classList.contains('active')) {
        closeCart();
    }
});

// Smooth scrolling for category navigation
document.querySelectorAll('.category-nav a').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            targetSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    loadCart();
    initializeAddToCartButtons();
    updateCartCount();
});

// Add to cart animation
function addToCartAnimation(button) {
    const originalText = button.textContent;
    button.textContent = 'Added! ✓';
    button.style.background = '#25D366';
    
    setTimeout(() => {
        button.textContent = originalText;
        button.style.background = '';
    }, 1500);
}