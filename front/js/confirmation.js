let orderId = document.querySelector("#orderId");
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
// ---------- fonction d'initialisation -------------------
function init () {
    orderId.innerHTML = urlParams.get("orderId")
    localStorage.clear()    
}
init()