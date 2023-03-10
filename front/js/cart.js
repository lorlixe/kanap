

const totalQuantity = document.getElementById("totalQuantity")
const totalPrice = document.getElementById("totalPrice")
const btnOrder = document.getElementById("order")
const form = document.querySelector("form")
const cartItems = document.querySelector("#cart__items")
const link = "confirmation.html"

let allItems = 0
let globalPrice = 0
let dataForm = {}
let article
let cartItemImg
let Img
let cartItemContent
let cartItemContentDescription
let ItemName
let ItemColor
let ItemPrice
let settings
let quantity
let QuantityInput
let Delete
let DeleteItem
// -------------- fonction d'initialisation ----------

function init (){
  fetch('http://localhost:3000/api/products')
  .then(function(res) {
      if (res.ok) {
      return res.json();
      }
  })
  .then(function(data) {
    let allCartItem = localStorage.getItem("listItem")
    allCartItem = JSON.parse(allCartItem)
    if (allCartItem){
      itemCartDisplay(allCartItem, data)
    }
    order(allCartItem)
  })
  
  .catch(function(err) {
      console.log(err)
  })
}
init ()

// -------------- fonction pour afficher tous les éléments du panier ----------

function itemCartDisplay(array, data) 
{  
  array.forEach(element => {
    article = document.createElement("article")
    article.setAttribute("class", "cart__item")
    cartItems.append(article)

    cartItemImg = document.createElement("div")
    cartItemImg.setAttribute("class","cart__item__img")
    article.append(cartItemImg)

    Img = document.createElement("img")
    cartItemImg.append(Img)

    cartItemContent = document.createElement("div")
    cartItemContent.setAttribute("class", "cart__item__content")
    article.append(cartItemContent)

    cartItemContentDescription = document.createElement("div")
    cartItemContentDescription.setAttribute("class", "cart__item__content__description")
    cartItemContent.append(cartItemContentDescription)

    ItemName = document.createElement("h2")
    cartItemContentDescription.append(ItemName)

    ItemColor = document.createElement("p")
    cartItemContentDescription.append(ItemColor)

    ItemPrice = document.createElement("p")
    ItemPrice.setAttribute("class", "cart__item__price")
    cartItemContentDescription.append(ItemPrice)


    settings = document.createElement("div")
    settings.setAttribute("class", "cart__item__content__settings")
    article.append(settings)

    quantity = document.createElement("div")
    quantity.setAttribute("class", "cart__item__content__settings__quantity")
    settings.append(quantity)

    QuantityInput = document.createElement("input")
    QuantityInput.setAttribute("class", "itemQuantity")
    QuantityInput.setAttribute("type", "number")
    QuantityInput.setAttribute("name", "itemQuantity")
    QuantityInput.setAttribute("min", "1")
    QuantityInput.setAttribute("max", "100")
    QuantityInput.setAttribute("value", "00")
    quantity.append(QuantityInput)

    Delete = document.createElement("div")
    Delete.setAttribute("class", "cart__item__content__settings__delete")
    settings.append(Delete)

    DeleteItem = document.createElement("p")
    DeleteItem.setAttribute("class", "deleteItem")
    Delete.append(DeleteItem)
    DeleteItem.innerHTML = "supprimer"
    

    Img.src = element.imageUrl
    Img.alt = element.alt
    ItemName.innerHTML =  element.name
    ItemColor.innerHTML = element.colors
    QuantityInput.value = element.quantity
    data.forEach(item => {
      if (item._id == element.id) {
        ItemPrice.innerHTML = item.price*QuantityInput.value +" €"
        globalPrice += item.price*QuantityInput.value
        let elementPrice = item.price*QuantityInput.value
    // -------------- Changer la quantité  ----------
        QuantityInput.addEventListener('change',(e) => {
          let parentElement = e.target.closest('.cart__item');
          ItemPrice = parentElement.querySelector('.cart__item__price')
          globalPrice -= elementPrice
          let itemChange= array.find(x => x.id == element.id && x.colors == element.colors)
          console.log(itemChange)
          allItems -= itemChange.quantity
          array[array.indexOf(itemChange)].quantity = e.target.valueAsNumber;
          console.log(itemChange.quantity)
          if (itemChange.quantity == 0) {
            let itemToRemove = array.find(x => x.id == element.id );
            let index = array.indexOf(itemToRemove);
            array.splice(index, 1);
            parentElement.remove()
            displayform (globalPrice)
            console.log("supp")
          }
          elementPrice = itemChange.quantity*item.price
          ItemPrice.innerHTML = item.price*e.target.valueAsNumber +" €"
          globalPrice += elementPrice
          allItems += (itemChange.quantity)
          totalQuantity.innerHTML = allItems
          totalPrice.innerHTML = globalPrice
          localStorage.setItem("listItem", JSON.stringify(array))
        })
       // -------------- Supprimer un element du panier ----------
        DeleteItem.addEventListener('click',(e) =>{  
          e.preventDefault() 
          let parentElement = e.target.closest('.cart__item');
          let itemToRemove = array.find(x => x.id == element.id );
          let index = array.indexOf(itemToRemove);
          array.splice(index, 1);
          parentElement.remove()
          displayform (globalPrice)
          console.log("supp")
          localStorage.setItem("listItem", JSON.stringify(array))
        })
      }
    });



    
    localStorage.setItem("listItem", JSON.stringify(array))
    
    allItems += element.quantity

    totalQuantity.innerHTML = allItems
    totalPrice.innerHTML = globalPrice
  }); 
}

function supp(){
  
}
// -------------- afficher le formulaire ----------

function displayform (globalPrice){
  if(globalPrice<=0) {
    let x = document.querySelector(".cart__order")
    x.style.display = "none";
    }
}

// -------------- Valider le panier ----------
function order(allCartItem) {
  displayform (globalPrice)
  form.addEventListener('submit',(e) =>{  
    e.preventDefault()
    let order = {
      contact: {
        firstName: document.querySelector("#firstName").value,
        lastName:  document.querySelector("#lastName").value,
        address: document.querySelector("#address").value,
        city: document.querySelector("#city").value,
        email: document.querySelector("#email").value
      },  
      products: []
    }
    // ------------Validation des champs------------
    let isValid = true;
    if(!(/^[a-zA-Z ]+$/).test(document.getElementById("firstName").value)) {
      alert("Le champ prénom ne doit pas contenir de chiffre");
      isValid = false;
    }
    if(!(/^[a-zA-Z ]+$/).test(document.getElementById("lastName").value)) {
      alert("Le champ nom ne doit pas contenir de chiffre");
      isValid = false;
    }
    if(!(/^[a-zA-Z ]+$/).test(document.getElementById("city").value)) {
      alert("Le champ ville ne doit pas contenir de chiffre");
      isValid = false;
    }
    if(!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/).test(document.getElementById("email").value)) {
      isValid = false;
      console.log(isValid)
      alert("Cet email n'est pas valide, veuillez respecter ce format exemple@mail.com");
    }
    if(isValid) {
      console.log("envoyé")
      allCartItem.forEach(item => {
        order.products.push(item.id);
      });
      // -------------- Envoyer le formulaire----------
      fetch('http://localhost:3000/api/products/order', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(order)
      })
      .then((res) => res.json())
      .then((data) => {
      console.log(data.orderId)
      localStorage.setItem("orderId", data.orderId);
      window.location.href = link+"?orderId="+data.orderId;
      })
    }
  });
}



