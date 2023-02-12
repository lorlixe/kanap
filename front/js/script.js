const items = document.getElementById("items")
let itemName
let itemDescription
let article
let photo 
let itemLink
// ---------- fonction d'initialisation -------------------
function init (){
    fetch('http://localhost:3000/api/products')
    .then(function(res) {
        if (res.ok) {
        return res.json();
        }
    })
    .then(function(value) {
        itemDisplay (value)
    })
    .catch(function(err) {
        console.log('Une erreur est survenue')
    });
}


// ---------- fonction permettant d'afficher l'ensemble des produits -------------------

function itemDisplay (array) 
{
    array.forEach((element) =>{
        itemName = document.createElement("h3")
        itemDescription = document.createElement("p")
        article = document.createElement("article")
        photo = document.createElement("img")
        itemLink = document.createElement("a")
        items.append(itemLink)
        itemLink.append(article)
        article.append(photo)
        article.append(itemName)
        article.append(itemDescription)
        photo.src = element.imageUrl
        photo.alt = element.altTxt
        itemName.innerText = element.name
        itemDescription.innerText = element.description
        itemLink.href= "./product.html?id="+ element._id
    })
}

init ()
