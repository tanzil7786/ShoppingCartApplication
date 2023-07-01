const reloder = window.location;
const cartInnerContainer = document.querySelector(".cart-inner-container");
const bills = document.querySelector(".bills");
const total = document.querySelector(".total");
const billingSection = document.querySelector(".billing-section");
const cartEmpty = document.querySelector(".cart-empty");
// const checkout = document.getElementById('checkout');

let cartProduct = [];

//---------------- Get Cart Product from Session storeage-------------------------
async function getCartDetails() {
  try {
    const cartData = JSON.parse(sessionStorage.getItem("cart"));
    return cartData;
  } catch (err) {
    console.log(err);
  }
}

//-------------Update Cart Product on Session storage--------------------------
async function updateCart(cart) {
  sessionStorage.setItem("cart", JSON.stringify(cart));
}

//--------------Display price to the Cart Billing section---------------------
async function displayPrice() {
  bills.innerHTML = "";

  cartProduct.forEach((product) => {
    bills.innerHTML += `
        <div class="billing">
            <span class="qty">1.</span>
            <span class="bill-title">${product.title}</span>
            <span class="amount">$${product.price}</span>
        </div>
        `;
  });
}

//----------Display Total price of the Cart Items to Billing section------------
async function displayTotal() {
  let totalAmount = 0;

  for (let data of cartProduct) {
    totalAmount += parseFloat(data.price);
  }
  totalCost = totalAmount.toFixed(2) * 100;
  console.log(totalCost * 100);

  total.innerHTML = "";

  total.innerHTML = `
        <span class="bold">Total</span><span>Rs ${totalAmount.toFixed(2)}</span>
    `;
}

//---------------------Display Cart in UI-------------------------------
async function displayCart() {
  cartInnerContainer.innerHTML = "";

  cartProduct.forEach((product) => {
    cartInnerContainer.innerHTML += `
        <div class="item-container" >
            <div class="inner-item-container">
            <div class="img-container">
                <img class="item-img" src="${product.image}" alt="${product.description}" />
            </div>
            <div class="item-details">
                <div class="item-title">
                <h3 class="title">
                    Title:
                    <h3>
                    <p class="fullTitle">${product.title}</p>
                </div>
                <div class="price-size">
                <p class="item-price">Price : $${product.price}
                </div>

            </div>
            </div>
            <button class="remove-from-cart" type="submit" id="${product.id}">Remove From Cart</button>
        </div>
    `;

    let removeProduct = document.querySelectorAll(".remove-from-cart");

    for (let i = 0; i < removeProduct.length; ++i) {
      removeProduct[i].addEventListener("click", async (e) => {
        let div = e.target;
        let id = div.getAttribute("id");
        console.log(id);
        let cartItems = await getCartDetails();
        // cartItems = cartItems.filter((cart) => cart.id !== parseInt(id));
        cartItems = checkRepeater(cartItems, id);
        await updateCart(cartItems);
        let cartData = await getCartDetails();
        await displayTotal(cartData);
        reloder.reload();
      });
    }
  });
}

//--------------------------------Handeling Dupilcate removal from cart---------------------------------------------
function checkRepeater(cartItems, id) {
  let a = [];
  let flag = true;
  for (let i = 0; i < cartItems.length; i++) {
    // console.log(cartItems[i].id);
    if (cartItems[i].id == id && flag) {
      flag = false;
    } else {
      a.push(cartItems[i]);
    }
  }
  return a;
}

function getAmount() {
  let totalAmount = 0;

  let cartProduct = JSON.parse(sessionStorage.getItem("cart"));

  if (cartProduct) {
    for (let data of cartProduct) {
      totalAmount += parseFloat(data.price);
    }
    totalCost = totalAmount.toFixed(2) * 100;
    console.log(totalCost * 100);
    return totalCost.toFixed(2);
  }
}

//------------------Load page on Entering to Cart page
async function reload() {
  cartProduct = (await getCartDetails()) || [];

  if (cartProduct.length === 0) {
    billingSection.classList.add("hidden");
    cartEmpty.removeAttribute("hidden");
  } else {
    cartEmpty.classList.add("hidden");
    billingSection.removeAttribute("hidden");
  }
  console.log(cartProduct);
  await displayCart();
  await displayPrice();
  await displayTotal();
}

if (
  sessionStorage.getItem("LogginUserId") &&
  sessionStorage.getItem("MeShopToken")
) {
  window.addEventListener("load", reload);
} else {
  window.location.href = "../index.html";
}
