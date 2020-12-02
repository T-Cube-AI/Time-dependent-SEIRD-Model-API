const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const path = require('path')
const fs = require('fs')
const russiaRouter = require('./Routes/Russia/russia_api')
const USRouter = require('./Routes/US/us_api')
const indiaRouter = require('./Routes/India/india_api')

app = express()

//Set View Engine
app.set('view engine', 'ejs')
app.set('views', 'views')

// global variables
PORT = 3000
const availableCountriesObject = { availableCountries: ["Russia", "US", "Peru", "India"] }

// Middleware to parse search params
app.use(bodyParser.json())

// Middleware to resolve cors!
app.use(cors())

// Include Css files
app.use(express.static(path.join(__dirname, '/assets')))


// Routes
app.get('/', (req, res) => {
    console.log(req.url, req.method)
    console.log("Query: ", req.query)
    // res.sendFile(path.join(__dirname, 'views/homepage.html'))
    res.render('homepage')
})

/**
 * @api {get} /countries List the available countries
 * @apiGroup /countries
 * @apiSuccess {Object[]} availableCountries countries' list
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 200 OK
 *    {
 *      "availableCountries": ["Russia","US","Peru","India"]
 *    }
 * @apiErrorExample {json} Failed
 *    HTTP/1.1 500 Internal Server Error
 */
app.get('/countries/', (req, res) => {
    console.log(req.url, req.method)
    console.log("Params: ", req.params)
    res.json(availableCountriesObject)
})

app.use('/countries/Russia', russiaRouter)
app.use('/countries/US', USRouter)
app.use('/countries/India', indiaRouter)

/**
 * @api {get} /countries/:country Access particular country
 * @apiGroup /countries
 * @apiSuccess {Object[]} list list of regions or states
 * @apiSuccessExample {json} Success
 *   HTTP/1.1 200 OK
 *   {
 *     "states/regions": [.... .... ....]
 *   }
 * @apiErrorExample {json} Failed
 *    HTTP/1.1 404 Not Found
 */
app.get('/countries/:country', (req, res) => {
    console.log(req.url, req.method)
    console.log("Params: ", req.params)
    let country = req.params.country
    if (availableCountriesObject.availableCountries.includes(country)) {
        // res.sendFile(path.join(__dirname, 'views/not_enough_data.html'))
        res.render('not_enough_data')
    } else {
        // res.sendFile(path.join(__dirname, 'views/404.html'))
        res.render('404')
    }
})

// 404 page
app.use((req, res) => {
    // res.status(404).sendFile(path.join(__dirname, 'views/404.html'))
    res.render('404')
})

var server = app.listen(PORT, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("Example app listening at http://<%s>:%s", host, port)
})
