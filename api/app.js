const express = require('express')
const fs = require('fs')
const fsPath = require('fs-path')
const crypto = require('crypto')
const http = require('https')

const app = express()

const makeImgFile = (filePath, fileData) => {
  fsPath.writeFile(filePath, fileData, 'base64', (err) => {
    if (err) throw err
  })
  fs.appendFile(filePath, 'base64', (err) => {
    if (err) throw err
    console.log(`Data was added to ${filePath}`)
  })
}

const getGiphyImages = (cb) => {
    console.log('CALLING getGiphyImages!')
    let giphyKeywordList = ["happy", "fun", "funny", "meme", "stupid", "lol"],
        giphyResultLimit = 25,
        giphyKeyword = giphyKeywordList[Math.floor(Math.random()*giphyKeywordList.length)],
        giphyUri = `https://api.giphy.com/v1/gifs/search?api_key=${process.env.GIPHY_TOKEN}&q=${giphyKeyword}&limit=${giphyResultLimit}&offset=0&rating=G&lang=en` 

    http.get(giphyUri, (res) => {
      let body = '';

      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        let response = JSON.parse(body),
            uniqueGifs = response.data[Math.floor(Math.random()*response.data.length)]
            cb(uniqueGifs)
            console.log(`Going for ${giphyUri}`)
            console.log(`Random gif ${uniqueGifs}`)
      });
    });     
}

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    next()
});

app.get('/', (req, res) => res.send('Hello World!'))

app.post('/saveImage', (req, res) => {
    let dataReceived = ''

    req.on('data', (data) => dataReceived += data)
    
    req.on('end', () => {
        // Grab Base64 image data from file  
        let imagePath = 'api/images/' 
        let base64Data = dataReceived.replace(/^data:image\/png;base64,/, "")
        let imageId = crypto.randomBytes(20).toString('hex')
        let imageFileNameDest = `${imagePath}${imageId}.png`

        console.log(`Making image file ${imageFileNameDest}`)

        // Build base64 into png
        makeImgFile(imageFileNameDest, base64Data)

        getGiphyImages((returnedGif) => {
          console.log(`Sending this back ${returnedGif}`)
          res.send(JSON.stringify(returnedGif))
        })

        // Grab URLs for Giphy images
        //let imageListURLs = getGiphyImages()
    })
})

app.listen(4000, () => console.log('Example app listening on port 4000!'))
