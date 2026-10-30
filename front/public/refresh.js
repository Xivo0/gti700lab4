const API = "http://localhost:8080"

async function maj() {
    const reponse = await fetch(API + "/capteurs/temp")
    const val = await reponse.json()
    console.log(val)
    const element = document.getElementById("temp-actuelle")
    element.textContent = val
}

maj()