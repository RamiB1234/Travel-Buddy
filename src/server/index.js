const dotenv = require('dotenv');
dotenv.config();
var path = require('path')
const express = require('express')
const mockAPIResponse = require('./mockAPI.js')

const app = express();

/* Middleware*/
//Here we are configuring express to use body-parser as middle-ware.
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cors for cross origin allowance
const cors = require('cors');
app.use(cors());


app.use(express.static('dist'))

console.log(__dirname)

app.get('/', function (req, res) {
     res.sendFile('dist/index.html')
    //res.sendFile(path.resolve('src/client/views/index.html'))
})

const port = process.env.PORT || 8081

// designates what port the app will listen to for incoming requests
if (process.env.NODE_ENV !== 'test') {
    app.listen(port, function () {
        console.log('Example app listening on port 8081!')
    })
  }

app.get('/getapikeys', function (req, res){
    res.send({weatherKey: process.env.WHEATHER_BIT_API_KEY, pixbayKey: process.env.PIXBAY_API_KEY})
})

module.exports = app;
