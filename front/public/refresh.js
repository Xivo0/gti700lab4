const API = "http://localhost:8080"
const NB = 30

function majColonne(type, actuelle, moyenne, historique) {
    console.log(type)
    console.log(actuelle)
    console.log(historique)
    console.log(moyenne)
    const element = document.getElementById(`${type}-actuelle`)
    element.textContent = actuelle
}


async function lire(route) {
    const reponse = await fetch(API + route)
    if (!reponse.ok) {
        throw Error(reponse.status + ":" + reponse.statusText);
    }
    const val = await reponse.json()
    return val
}


async function maj() {
    const erreur = document.getElementById("erreur")

    try {
        for (const type of ['temp', 'lum']) {

            const [actuelle, historique, moyenne] = await Promise.all([
                lire(`/capteurs/${type}`),
                lire(`/capteurs/${type}/${NB}`),
                lire(`/capteurs/${type}/${NB}/moy`)
            ])

            majColonne(type, actuelle, moyenne, historique)
        }

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
setInterval(maj, 3000)