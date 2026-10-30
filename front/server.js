const express = require('express')
const path = require('path')
const app = express()
const port = 8889

// définit le dossier public, de là où on enverra les fichiers demandés
app.use(express.static(path.join(__dirname,'public')))

app.get('/affichage',(req,res) => res.sendFile(path.join(__dirname,'public','affichage.html')))
// démarre le serveur
app.listen(port,() => console.log(`On est à l'antenne, sur ${port}`))