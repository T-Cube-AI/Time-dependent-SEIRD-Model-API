const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const fs = require('fs')
var router = express.Router()
const CSVToJson = require('csvtojson')

// global variables
const PREDICTIONS_DIR = path.join(__dirname, '../../../Predictions/US')
const DATASETS_DIR = path.join(__dirname, '../../../Datasets/US')
const INSIGHTS_DIR = path.join(__dirname, '../../../Insights/US')
const viewsDir = path.join(__dirname, '../../views')
const usPopulationFile = path.join(__dirname, '../../../US-population.json')
var statesInUS = { "statesInUS": undefined }
const invalidStateErrorObject = { "message": "Invalid state!" }
var heatfactors = new Object()
const heatFactorsFile = path.join(__dirname, '../../../us_heatfactors.json')

const availableEndPoints = { "Endpoints": ["/states", "/predict", "/past", "/heatfactors", "/insights"] }

// Middleware to parse search params
router.use(bodyParser.json())

// Routes
router.get('/', (req, res) => {
    console.log("US API")
    console.log(req.url, req.method)
    console.log("Query: ", req.query)
    res.redirect('states')
})

router.get('/endpoints', (req, res) => {
    res.json(availableEndPoints)
})

router.get('/heatfactors', (req, res) => {
    prepareHeatFactors()
    res.json(heatfactors)
})

router.get('/states', (req, res) => {
    res.json(statesInUS)
})

router.get('/predict/:state', (req, res) => {
    console.log(req.url, req.method)
    console.log("Params: ", req.params)
    let state = req.params.state

    if (!statesInUS.statesInUS.includes(state)) {
        res.status(404).json(invalidStateErrorObject)
    } else {

        let predictions = getPredictions(state)
        if (predictions == null) {
            // res.sendFile(path.join(viewsDir, 'not_enough_data.html'))
            res.render('not_enough_data')
        } else {
            res.json(predictions)
        }
    }
})

router.get('/predict', (req, res) => {
    let state = req.query.state

    if (state === undefined) {
        state = "Total"
    }

    if (!statesInUS.statesInUS.includes(state) && state != "Total") {
        res.status(404).json(invalidStateErrorObject)
    } else {
        let predictions = getPredictions(state)
        if (predictions == null) {
            // res.sendFile(path.join(viewsDir, 'not_enough_data.html'))
            res.render('not_enough_data')
        } else {
            res.json(predictions)
        }
    }
})

router.get('/past/:state', (req, res) => {
    let stateName = req.params.state

    if (!statesInUS.statesInUS.includes(stateName)) {
        res.status(404).json(invalidStateErrorObject)
    } else {
        let pastDataPromise = getPastValues(stateName)
        pastDataPromise.then(pastData => {
            if (pastData == null) {
                res.render('not_enough_data')
            } else {
                res.send(pastData)
            }
        }).catch(err => {
            res.render('not_enough_data')
        })
    }
})

router.get('/past', (req, res) => {
    let state = req.query.state

    if (state === undefined) {
        state = "Total"
    }

    if (!statesInUS.statesInUS.includes(state) && state != "Total") {
        res.status(404).json(invalidStateErrorObject)
    } else {
        let pastDataPromise = getPastValues(state)
        pastDataPromise.then(pastData => {
            if (pastData == null) {
                res.render('not_enough_data')
            } else {
                res.send(pastData)
            }
        }).catch(err => {
            res.render('not_enough_data')
        })
    }
})


router.get('/insights', (req, res) => {
    let state = "Total"
    let insights = getInsights(state)
    if (insights == null) {
        // res.sendFile(path.join(viewsDir, 'not_enough_data.html'))
        res.render('not_enough_data')
    } else {
        res.json(insights)
    }
})

router.get('/insights/:state', (req, res) => {
    console.log(req.url, req.method)
    console.log("Params: ", req.params)
    let state = req.params.state

    if (!statesInUS.statesInUS.includes(state)) {
        res.status(404).json(invalidStateErrorObject)
    } else {
        let insights = getInsights(state)
        if (insights == null) {
            // res.sendFile(path.join(viewsDir, 'not_enough_data.html'))
            res.render('not_enough_data')
        } else {
            res.json(insights)
        }
    }
})


const getPastValues = async (state) => {
    let filename = replaceSpecialCharacters(state)
    filename = path.join(DATASETS_DIR, filename)
    let pastDataFile = filename + '.csv'
    console.log(pastDataFile)

    try {
        pastData = await CSVToJson().fromFile(pastDataFile)
        pastData = pastData.slice(-7)
        pastData.map(obj => {
            confirmedCases = parseInt(obj["Confirmed"])
            recoveredCases = parseInt(obj["Recovered"])
            deaths = parseInt(obj["Deaths"])
            date = obj["Date"]

            obj["confirmed"] = confirmedCases
            obj["active"] = confirmedCases - recoveredCases - deaths
            obj["deaths"] = deaths
            obj["date"] = date

            delete obj["Day"]
            delete obj["Date"]
            delete obj["Confirmed"]
            delete obj["Recovered"]
            delete obj["Deaths"]
        })
        // console.log(pastData)
    } catch (err) {
        console.log(err)
        pastData = null
    }

    return pastData
}

const getUSStates = () => {
    let data = fs.readFileSync(usPopulationFile, { encoding: 'utf8' })
    let statesInfoUS = JSON.parse(data)
    let allStatesInUS = statesInfoUS.map(stateObj => stateObj.State)

    statesInUS["statesInUS"] = allStatesInUS

    return allStatesInUS
}

const getInsights = (state) => {
    let filename = replaceSpecialCharacters(state)
    filename = path.join(INSIGHTS_DIR, filename)
    let insightsFile = filename + '.json'
    console.log(insightsFile)

    try {
        let InsightsString = fs.readFileSync(insightsFile)
        var insights = JSON.parse(InsightsString)
    } catch (err) {
        console.log(err)
        insights = null
    }

    return insights
}

const replaceSpecialCharacters = (filename) => {
    filename = filename.replace(/[ ]+/, ' ')
    filename = filename.replace(/ /g, '-')
    filename = filename.replace('(', '')
    filename = filename.replace('.', '')
    filename = filename.replace(')', '')

    console.log({ filename })
    return filename
}

const getPredictions = (state) => {
    let filename = replaceSpecialCharacters(state)
    filename = path.join(PREDICTIONS_DIR, filename)
    let predictionsFile = filename + '_projections.json'
    console.log(predictionsFile)

    try {
        let predictionsString = fs.readFileSync(predictionsFile)
        var predictions = JSON.parse(predictionsString)
    } catch (err) {
        console.log(err)
        predictions = null
    }

    return predictions
}

const prepareHeatFactors = () => {
    let data = fs.readFileSync(heatFactorsFile, { encoding: 'utf8' })
    heatfactors = JSON.parse(data)
}

getUSStates()
prepareHeatFactors()

module.exports = router