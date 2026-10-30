const express = require('express');
const app = express();
const port = 8080;
const MAX = 720

app.use((req,res,next) => {
    res.set('Access-Control-Allow-Origin','*')
    next()
})

const historiques = {
    temp : [], // historiques["temp"] -> tableau température
    lum : []
};

function ajouterValeur(type,valeur){
    const temps = new Date().toLocaleTimeString('fr-FR');

    historiques[type].push([temps,valeur]);
    if(historiques[type].length>MAX){
        historiques[type].shift();
    }
    console.log(`Nouvelle valeur de ${type} ajoutée : à ${temps}, ${valeur}` )
}

function genererMesures(){
    const temp = Math.round((20 + Math.random())*10)/10
    const lum = Math.round(Math.random()*255)
    ajouterValeur('temp',temp)
    ajouterValeur('lum',lum)
}

// pour ne pas avoir un tableau vide les 3 premières secondes
ajouterValeur('temp',20)
ajouterValeur('lum',100)
setInterval(genererMesures,3000)

// si on demande dernière valeur
app.get('/capteurs/:type',(req,res) => {
    const tab = historiques[req.params.type]
    if(!tab){ // si on demande un type qui n'existe pas
        return res.status(404).json('capteur inconnu')
    }
    res.json(tab[tab.length - 1][1])
})
// si on demande n dernières valeurs
app.get('/capteurs/:type/:n',(req,res) => {
    const tab = historiques[req.params.type]
    if(!tab){
        return res.status(404).json('capteur inconnu')
    }
    const nbr = parseInt(req.params.n)
    const envoi = tab.slice(-nbr)
    res.json(envoi)
})
// si on demande moyenne des n dernières valeurs
app.get('/capteurs/:type/:n/moy',(req,res) => {
    const tab = historiques[req.params.type]
    if(!tab){
        return res.status(404).json('capteur inconnu')
    }
    const nbr = parseInt(req.params.n)
    const derniers = tab.slice(-nbr)
    const somme = derniers.reduce((acc,x) => acc + x[1],0)
    const envoi = Math.round(somme*10/derniers.length)/10

    res.json(envoi)
})

app.listen(port, () => console.log(`Nous sommes lancés pour les requêtes sur ${port}`))