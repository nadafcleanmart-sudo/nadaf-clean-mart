/* ==========================================
   NADAF CLEAN MART
   script.js - Part 1
==========================================*/

let cart = JSON.parse(localStorage.getItem("cart")) || [];
let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

let filteredProducts = [...products];

let currentProduct = null;
let quantity = 1;

/* =========================
   PAGE LOAD
=========================*/

document.addEventListener("DOMContentLoaded", () => {

    displayProducts(filteredProducts);

    updateCartCount();

    startSlider();

});

/* =========================
   DISPLAY PRODUCTS
=========================*/

function displayProducts(productList){

    const container = document.getElementById("featuredProducts");

    if(!container) return;

    container.innerHTML="";

    productList.forEach(product=>{
        console.log(product);

        container.innerHTML += `

        <div class="product-card fade-in">

            <div class="product-image">

            <img src="${product.variants ? product.variants[0].image : product.image}" alt="${product.name}">

            </div>

            <div class="product-content">

                <span class="product-category">
                    ${product.category}
                </span>

                <h3 class="product-name">
                    ${product.name}
                </h3>

                <p class="product-description">
                    ${product.description}
                </p>

                <div class="product-price">

    

   <span class="price">₹${product.variants ? product.variants[0].price : product.price}</span>

</div>

                <div class="product-buttons">

                    <button
                    class="quick-view-btn"
                    onclick="openPopup(${product.id})">

                    Quick View

                    </button>

                    <button
                    class="add-cart-btn"
                    onclick="addToCart(${product.id})">

                    Add Cart

                    </button>

                </div>

            </div>

        </div>

        `;

    });

}

/* =========================
   SEARCH
=========================*/

function searchProducts(){

    const input=document
    .getElementById("searchInput")
    .value
    .toLowerCase();

    filteredProducts=products.filter(product=>{

        return product.name.toLowerCase().includes(input)

        ||

        product.category.toLowerCase().includes(input);

    });

    displayProducts(filteredProducts);

}

function searchCategoryProducts() {

    const input = document
        .getElementById("categorySearchInput")
        .value
        .toLowerCase();

    const filtered = filteredProducts.filter(product =>
        product.name.toLowerCase().includes(input) ||
        product.category.toLowerCase().includes(input)
    );

    displayProducts(filtered);

}


/* =========================
CATEGORY FILTER
=========================*/

function filterCategory(category){

    if(category==="All"){

        filteredProducts=[...products];

    }else{

        filteredProducts=products.filter(product=>

            product.category===category

        );

    }

    displayProducts(filteredProducts);

}

/* =========================
HERO SLIDER
=========================*/

let currentSlide=0;

function startSlider(){

    const slides=document.querySelectorAll(".slide");

    if(slides.length===0) return;

    slides[currentSlide].classList.add("active");

    setInterval(()=>{

        slides[currentSlide].classList.remove("active");

        currentSlide++;

        if(currentSlide>=slides.length){

            currentSlide=0;

        }

        slides[currentSlide].classList.add("active");

    },4000);

}

/* =========================
OPEN PRODUCT POPUP
=========================*/

function openPopup(id){

    currentProduct = products.find(product => product.id === id);

    quantity = 1;

    const selectedVariant = currentProduct.variants
        ? currentProduct.variants[0]
        : null;

    document.getElementById("popupImage").src =
        selectedVariant ? selectedVariant.image : currentProduct.image;

    document.getElementById("popupName").innerHTML =
        currentProduct.name;

    document.getElementById("popupCategory").innerHTML =
        currentProduct.category;

    document.getElementById("popupDescription").innerHTML =
        currentProduct.description;

    document.getElementById("popupPrice").innerHTML =
        "₹" + (selectedVariant ? selectedVariant.price : currentProduct.price);
    


    document.getElementById("quantityText").innerHTML = quantity;

    document.getElementById("popupOverlay").style.display = "flex";

}
function closePopup(){

    document.getElementById("popupOverlay").style.display="none";

}
function increaseQuantity() {

    quantity++;

    document.getElementById("quantityText").innerHTML = quantity;

}

function decreaseQuantity() {

    if (quantity > 1) {

        quantity--;

        document.getElementById("quantityText").innerHTML = quantity;

    }

}

/* ==========================================
   script.js - Part 2
   Cart + Quantity + Cart Sidebar
==========================================*/

/* =========================
   QUANTITY
=========================*/

function increaseQty(){

    quantity++;

    document.getElementById("quantityText")

}

function decreaseQty(){

    if(quantity > 1){

        quantity--;

        document.getElementById("quantityText")
    }

}

/* =========================
   ADD TO CART
=========================*/

function addToCart(id){

    const product = products.find(item => item.id === id);

    if(!product) return;

    const existing = cart.find(item => item.id === id);

    if(existing){

        existing.qty++;

    }else{

        cart.push({

            ...product,

            qty:1

        });

    }

    saveCart();

    updateCartCount();

    renderCart();
    alert("✅ Product Successfully Added To Cart");

}

function addPopupToCart(){

     alert("Popup Add To Cart Clicked");

    if(!currentProduct) return;

    const existing = cart.find(item => item.id === currentProduct.id);

    if(existing){

        existing.qty += quantity;

    }else{

        cart.push({

            ...currentProduct,

            qty:quantity

        });

    }

    saveCart();

    updateCartCount();

    renderCart();

    closePopup();

}

/* =========================
   SAVE CART
=========================*/

function saveCart(){

    localStorage.setItem(

        "cart",

        JSON.stringify(cart)

    );

}

/* =========================
   CART COUNT
=========================*/

function updateCartCount(){

    const count = cart.reduce(

        (total,item)=>total+item.qty,

        0

    );

    const badge=document.getElementById("cartCount");

    if(badge){

        badge.textContent=count;

    }

}

/* =========================
   OPEN CART
=========================*/

function openCart(){

    document.getElementById("cartOverlay").style.display="flex";

    renderCart();

}

function closeCart(){

    document.getElementById("cartOverlay").style.display="none";

}

/* =========================
   RENDER CART
=========================*/

function renderCart(){
    

    const container=document.getElementById("cartItems");

    const totalBox=document.getElementById("cartTotal");

    if(!container || !totalBox) return;

    container.innerHTML="";

    let total=0;

    if(cart.length===0){

        container.innerHTML=`

        <div class="empty-box">

            <i class="fa-solid fa-cart-shopping"></i>

            <h3>Your Cart is Empty</h3>

        </div>

        `;

        totalBox.textContent="₹0";

        return;

    }

    cart.forEach(item=>{

        total += item.price * item.qty;

        container.innerHTML += `

        <div class="cart-item">

            <img src="${item.image}" alt="${item.name}">

            <div class="cart-info">

                <h4>${item.name}</h4>

                <p>₹${item.price}</p>

                <div class="cart-qty">

                    <button onclick="cartMinus(${item.id})">−</button>

                    <span>${item.qty}</span>

                    <button onclick="cartPlus(${item.id})">+</button>

                </div>

            </div>

            <button class="remove-btn"

            onclick="removeCart(${item.id})">

            <i class="fa-solid fa-trash"></i>

            </button>

        </div>

        `;

    });

    totalBox.textContent="₹"+total;

}

/* =========================
   CART PLUS
=========================*/

function cartPlus(id){

    const item=cart.find(p=>p.id===id);

    if(item){

        item.qty++;

    }

    saveCart();

    renderCart();

    updateCartCount();

}

/* =========================
   CART MINUS
=========================*/

function cartMinus(id){

    const item=cart.find(p=>p.id===id);

    if(!item) return;

    item.qty--;

    if(item.qty<=0){

        cart=cart.filter(p=>p.id!==id);

    }

    saveCart();

    renderCart();

    updateCartCount();

}

/* =========================
   REMOVE PRODUCT
=========================*/

function removeCart(id){

    cart=cart.filter(item=>item.id!==id);

    saveCart();

    renderCart();

    updateCartCount();

}


/* ==========================================
   script.js - Part 3
   Wishlist + Profile + Checkout + WhatsApp
==========================================*/

/* =========================
   WISHLIST
=========================*/

function addToWishlist(id){

    const product = products.find(p => p.id === id);

    if(!product) return;

    const exists = wishlist.find(p => p.id === id);

    if(exists){

        alert("Already in Wishlist");

        return;

    }

    wishlist.push(product);

    localStorage.setItem(

        "wishlist",

        JSON.stringify(wishlist)

    );

    renderWishlist();

}

function renderWishlist(){

    const container=document.getElementById("wishlistItems");

    if(!container) return;

    container.innerHTML="";

    if(wishlist.length===0){

        container.innerHTML=`
        <div class="empty-box">
            <i class="fa-solid fa-heart"></i>
            <h3>No Wishlist Items</h3>
        </div>
        `;

        return;

    }

    wishlist.forEach(item=>{

        container.innerHTML+=`

        <div class="cart-item">

            <img src="${item.image}" alt="${item.name}">

            <div class="cart-info">

                <h4>${item.name}</h4>

                <p>₹${item.price}</p>

            </div>

            <button
            class="remove-btn"
            onclick="removeWishlist(${item.id})">

            <i class="fa-solid fa-trash"></i>

            </button>

        </div>

        `;

    });

}

function removeWishlist(id){

    wishlist=wishlist.filter(item=>item.id!==id);

    localStorage.setItem(

        "wishlist",

        JSON.stringify(wishlist)

    );

    renderWishlist();

}

function openWishlist(){

    renderWishlist();

    document.getElementById("wishlistOverlay").style.display="flex";

}

function closeWishlist(){

    document.getElementById("wishlistOverlay").style.display="none";

}

/* =========================
PROFILE
=========================*/

function saveProfile(){

    const profile={

        name:document.getElementById("customerName").value,

        mobile:document.getElementById("customerPhone").value,

        address:document.getElementById("customerAddress").value

    };


    localStorage.setItem(

        "customer",

        JSON.stringify(profile)

    );

}

function loadProfile(){

    const profile=JSON.parse(

        localStorage.getItem("customer")

    );

    if(!profile) return;

    if(document.getElementById("customerName"))
    document.getElementById("customerName").value=profile.name;

    if(document.getElementById("customerPhone"))
    document.getElementById("customerPhone").value=profile.mobile;

    if(document.getElementById("customerAddress"))
    document.getElementById("customerAddress").value=profile.address;

}

function openProfile(){

    loadProfile();

    document.getElementById("profileOverlay").style.display="flex";

}

function closeProfile(){

    document.getElementById("profileOverlay").style.display="none";

}

/* =========================
CHECKOUT
=========================*/

function openCheckout(){

    if(cart.length===0){

        alert("Your cart is empty.");

        return;

    }

    document.getElementById("checkoutOverlay").style.display="flex";

    loadProfile();

}

function closeCheckout(){

    document.getElementById("checkoutOverlay").style.display="none";

}

/* =========================
ORDER ID
=========================*/

function generateOrderId(){

    return "NCM"+Date.now();

}

/* =========================
PLACE ORDER
=========================*/

function placeOrder(){

    

    const name=document.getElementById("customerName").value.trim();

    const mobile = document.getElementById("customerPhone").value.trim();

    const address=document.getElementById("customerAddress").value.trim();

    if(name===""||mobile===""||address===""){

        alert("Please fill all details");

        return;

    }

    saveProfile();

    const orderId=generateOrderId();

    const date=new Date().toLocaleString();

    let total=0;

    let message=`*NADAF CLEAN MART*%0A`;

    message+=`====================%0A`;

    message+=`*Order ID:* ${orderId}%0A`;

    message+=`*Date:* ${date}%0A%0A`;

    message+=`*Customer Details*%0A`;

    message+=`Name : ${name}%0A`;

    message+=`Mobile : ${mobile}%0A`;

    message+=`Address : ${address}%0A%0A`;

    message+=`*Products*%0A`;

    cart.forEach(item=>{

        total+=item.price*item.qty;

        message+=`${item.name}%0A`;

        message+=`Qty : ${item.qty}%0A`;

        message+=`Price : ₹${item.price}%0A%0A`;

    });

    message+=`--------------------%0A`;

    message+=`*Grand Total : ₹${total}*%0A`;

    message+=`Payment Method : Pending%0A`;

    message+=`Delivery Charges : If Applicable Our Team Will Inform You.%0A%0A`;

    message+=`Thank You For Shopping With NADAF CLEAN MART.%0A`;

    const phone="918805520047";   // <-- Replace with your WhatsApp number

    window.open(

        `https://wa.me/${phone}?text=${message}`,

        "_blank"

    );

    const history=JSON.parse(

        localStorage.getItem("orders")

    ) || [];

    history.push({

        orderId,

        date,

        total,

        items:cart

    });

    localStorage.setItem(

        "orders",

        JSON.stringify(history)

    );

    cart=[];

    saveCart();

    updateCartCount();

    renderCart();

    closeCheckout();

}

/* =========================
INITIAL LOAD
=========================*/

window.onload=function(){

    loadProfile();

    renderCart();

    renderWishlist();

    updateCartCount();
    if(localStorage.getItem("openCartAfterRedirect") === "true"){

    localStorage.removeItem("openCartAfterRedirect");

    openCart();

    document.getElementById("repeatOrderPopup").style.display="flex";

}

};
function closeRepeatPopup(){

    document.getElementById("repeatOrderPopup").style.display="none";

}

function goToCheckout(){

    document.getElementById("repeatOrderPopup").style.display="none";

    openCheckout();

}


window.addEventListener("load", function () {
    const preloader = document.getElementById("preloader");
    if (preloader) {
        preloader.style.display = "none";
    }
});



function closeCart(){

    document.getElementById("cartOverlay").style.display="none";

}

document.addEventListener("DOMContentLoaded", function () {

    const cartBtn = document.getElementById("cartBtn");
    const cartOverlay = document.getElementById("cartOverlay");
    const closeCart = document.getElementById("closeCart");

    if (cartBtn) {
        cartBtn.addEventListener("click", function () {
            cartOverlay.style.display = "flex";
        });
    }

    if (closeCart) {
        closeCart.addEventListener("click", function () {
            cartOverlay.style.display = "none";
        });
    }

});

document.addEventListener("DOMContentLoaded", function () {

    const menuBtn = document.getElementById("menuBtn");
    const menuOverlay = document.getElementById("menuOverlay");
    const closeMenu = document.getElementById("closeMenu");

    if (menuBtn) {
        menuBtn.addEventListener("click", function () {
            menuOverlay.style.display = "block";
        });
    }

    if (closeMenu) {
        closeMenu.addEventListener("click", function () {
            menuOverlay.style.display = "none";
        });
    }

});

function openMenu() {
    document.getElementById("menuOverlay").style.display = "block";
}

function closeMenu() {
    document.getElementById("menuOverlay").style.display = "none";
}

function showCartSuccess(){

    const popup = document.getElementById("cartSuccessPopup");

    if(!popup) return;

    popup.style.display = "flex";

    setTimeout(function(){

        popup.style.display = "none";

    },2000);

}

document.getElementById("plusBtn").onclick = increaseQuantity;

document.getElementById("minusBtn").onclick = decreaseQuantity;

document.getElementById("closePopup").onclick = closePopup;
