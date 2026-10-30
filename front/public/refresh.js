const API = "http://localhost:8080"
const NB = 30

async function lire(route){
    const reponse = await fetch(API + route)
    if(!reponse.ok){
        throw Error(reponse.status + ":" + reponse.statusText);
    }
    const val = await reponse.json()
    return val
}


async function maj() {
    const erreur = document.getElementById("erreur")

    try{
        const actuelle = await lire("/capteurs/temp")
        const historique = await lire(`/capteurs/temp/" + ${NB}`)
        const moyenne = await lire(`/capteurs/temp/${NB}/moy`)
        console.log(actuelle)
        console.log(historique)
        console.log(moyenne)
        const element = document.getElementById("temp-actuelle")
        element.textContent = actuelle

        const heure = document.getElementById("maj-heure")
        heure.textContent = new Date().toLocaleTimeString('fr-FR')

        erreur.textContent = ""

    } 
    catch (err) {
        erreur.textContent = "Données indisponibles"
        console.error(err)
    }

}

maj()
setInterval(maj,3000)