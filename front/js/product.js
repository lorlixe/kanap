// *************  constants nécessaires à l'affichage du produit ************

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const product = urlParams.get('id')
const link = "../html/cart.html"

const ItemImg = document.querySelector(".item__img")
const Img = document.createElement("img")
const itemPrice = document.querySelector("#price")
const itemDescription = document.querySelector("#description")
ItemImg.append(Img)

// *************  constants nécessaires au formulaire ************

const formSection = document.querySelector(".item__content")
const form = document.createElement("form")
const itemContentSettings = document.querySelector(".item__content__settings")
const itemContentAddButton = document.querySelector(".item__content__addButton")

const colorSelect = document.querySelector("#colors")
const addToCart = document.querySelector("#addToCart")
addToCart.setAttribute("type", "submit")

const itemQuantity = document.querySelector("#quantity")

let dataForm = {}

formSection.append(form)
form.append(itemContentSettings)
form.append(itemContentAddButton)


// ************* fonction d'initialisation ************

function init () {
    fetch('http://localhost:3000/api/products/'+product)
    .then(function(res) {
        if (res.ok) {
        return res.json();
        }
    })
    .then(function(value) {
        Img.src = value.imageUrl
        Img.alt = value.altTxt
        itemPrice.innerHTML = value.price
        itemDescription.innerHTML = value.description
        formDisplay(value.colors)
        Cart(value)
    })
    .catch(function(err) {
        console.log('Une erreur est survenue')
    });
}
init ()
// ************* fonction permettant d'afficher la liste des couleurs dans le formulaire***********

function formDisplay (array) 
{
    array.forEach((element) =>{ 
        const formValue = document.createElement("option")
        colorSelect.append(formValue)
        formValue.innerHTML = element
    })   
    
}
// ************* fonction permettant d'enregistrer les élements dans le local storage************//

function Cart(params) {
    form.addEventListener('submit',(e) =>{ 
        e.preventDefault()
        dataForm ={
            alt: params.altTxt,
            id: params._id,
            name: params.name,
            imageUrl:params.imageUrl,
            colors: document.querySelector("#colors").value,
            quantity: Number(document.querySelector("#quantity").value),
        }
        let listItem = JSON.parse(localStorage.getItem("listItem"))
        if(listItem){

            // let article = listItem.find(x => x.id == dataForm.id && x.colors == dataForm.colors);
          
            // if(article){
            //     // je l'ai dans mon local storage donc je dois uniquemeznt changer la quantité
            //     listItem[listItem.indexOf(article)].quantity += dataForm.quantity;                
            // }else{
            //     // je n'ai pas mon article
            //     listItem.push(dataForm)
            // }
            let count = 0
            let countcolor = []
            for(var i=0; i<listItem.length; i++) {
                if(dataForm.id === listItem[i].id) {
                    if(dataForm.colors === listItem[i].colors){
                        listItem[i].quantity = Number(dataForm.quantity) + Number(listItem[i].quantity)
                        countcolor.push(listItem[i].colors)
                    }
                    else{
                        countcolor.push(listItem[i].colors)
                    } 
                }
                if(dataForm.id !== listItem[i].id)  {
                    count++
                }
            }
            localStorage.setItem("countcolor", JSON.stringify(countcolor))
            if(!countcolor.includes(dataForm.colors) || countcolor.length === 0){
                listItem.push(dataForm)
            }
            if (count === listItem.length){
                listItem.push(dataForm)
            }
        }else{
            listItem = []
            listItem.push(dataForm)            
        }
        localStorage.setItem("listItem", JSON.stringify(listItem))
        window.location.href = link;

    })
}

