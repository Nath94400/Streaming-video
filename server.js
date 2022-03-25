const express = require('express')
const fs = require("fs");
const path = require("path");

const app = express()


app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.get("/stream/:id", function (req, res) {
    const path = 'media/' + req.params.id;
    const stat = fs.statSync(path);
    const fileSize = stat.size;
    const range = req.headers.range;

    // Si la requête indique une plage (range) dans les headers le requête
    if (range) {
        // Extraction des indications de la plage, en supprimant les mots superflus
        const parts = range.replace(/bytes=/, "").split("-");

        // Passage du binaire en base 10
        const start = parseInt(parts[0], 10);

        // Si une fin est définie, on l'extrait également. Sinon la fin correspond à la taille du fichier
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

        // Si la plage de début indiquée est supérieure à la taille du fichier, on renvoie une erreur
        if (start >= fileSize) {
            res
                .status(416)
                .send("Requested range not satisfiable\n" + start + " >= " + fileSize);
            return;
        }

        // Création de la portion de la vidéo à envoyer
        const chunksize = end - start + 1;

        // Création du stream (chargement partiel du fichier) local
        const file = fs.createReadStream(path, { start, end });

        // Définition des headers de la réponse
        const head = {
            "Content-Range": `bytes ${start}-${end}/${fileSize}`,
            "Accept-Ranges": "bytes",
            "Content-Length": chunksize,
            "Content-Type": "video/mp4",
        };

        // Envoi du stream local en réponse
        res.writeHead(206, head);
        file.pipe(res);
    }

// Si aucune plage n'est spécifiée, on envoi l'entiereté du fichier (utile pour pouvoir le télécharger)
    else {
        const head = {
            "Content-Length": fileSize,
            "Content-Type": "video/mp4",
        };
        res.writeHead(200, head);
        fs.createReadStream(path).pipe(res);
    }
})

app.get("/video", function (req, res) {
    const path = "video.mp4";
    const stat = fs.statSync(path);
    const fileSize = stat.size;
    const range = req.headers.range;

    // Si la requête indique une plage (range) dans les headers le requête
    if (range) {
        // Extraction des indications de la plage, en supprimant les mots superflus
        const parts = range.replace(/bytes=/, "").split("-");

        // Passage du binaire en base 10
        const start = parseInt(parts[0], 10);

        // Si une fin est définie, on l'extrait également. Sinon la fin correspond à la taille du fichier
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

        // Si la plage de début indiquée est supérieure à la taille du fichier, on renvoie une erreur
        if (start >= fileSize) {
            res
                .status(416)
                .send("Requested range not satisfiable\n" + start + " >= " + fileSize);
            return;
        }

        // Création de la portion de la vidéo à envoyer
        const chunksize = end - start + 1;

        // Création du stream (chargement partiel du fichier) local
        const file = fs.createReadStream(path, { start, end });

        // Définition des headers de la réponse
        const head = {
            "Content-Range": `bytes ${start}-${end}/${fileSize}`,
            "Accept-Ranges": "bytes",
            "Content-Length": chunksize,
            "Content-Type": "video/mp4",
        };

        // Envoi du stream local en réponse
        res.writeHead(206, head);
        file.pipe(res);
    }

// Si aucune plage n'est spécifiée, on envoi l'entiereté du fichier (utile pour pouvoir le télécharger)
    else {
        const head = {
            "Content-Length": fileSize,
            "Content-Type": "video/mp4",
        };
        res.writeHead(200, head);
        fs.createReadStream(path).pipe(res);
    }
})

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.htm'))
})

// Ceci est la dernière instruction du fichier, veillez à la garder tout en bas par la suite
app.listen(3001, function () {
    console.log('Listening on port 3001!')
})

