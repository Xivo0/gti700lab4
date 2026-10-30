const API = "http://localhost:8080"

async function maj() {
    const erreur = document.getElementById("erreur")

    try{
        const reponse = await fetch(API + "/capteurs/temp")    

        if(!reponse.ok){
            throw Error(reponse.status + ":" + reponse.statusText);
        }

        const val = await reponse.json()
        console.log(val)
        const element = document.getElementById("temp-actuelle")
        element.textContent = val

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