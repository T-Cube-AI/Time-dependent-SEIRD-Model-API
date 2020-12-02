const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const fs = require('fs')
const CSVToJson = require('csvtojson')
var router = express.Router()

// global variables
const DATASETS_DIR = path.join(__dirname, '../../../Datasets/Russia')
const PREDICTIONS_DIR = path.join(__dirname, '../../../Predictions/Russia')
const INSIGHTS_DIR = path.join(__dirname, '../../../Insights/Russia')
const russiaRegionsFile = path.join(__dirname, '../../../russia-regions.json')
const viewsDir = path.join(__dirname, '../../views')
const invalidRegionErrorObject = { "message": "Please provide a valid region name" }
var russiaRegions = undefined
var russiaRegionsNames = { regionsInRussia: undefined }
const heatFactorsFile = path.join(__dirname, '../../../russia_heatfactors.json')
const availableEndPoints = { "Endpoints": ["/regions", "/predict", "/past", "/heatfactors", "/insights"] }
var heatfactors = new Object()

// Middleware to parse search params
router.use(bodyParser.json())

// Routes
router.get('/', (req, res) => {
    res.redirect('regions')
})

router.get('/endpoints', (req, res) => {
    res.json(availableEndPoints)
})

router.get('/heatfactors', (req, res) => {
    prepareHeatFactors()
    res.json(heatfactors)
})

router.get('/regions', (req, res) => {
    console.log("RussiaAPI")
    console.log(req.url, req.method)
    console.log("Query: ", req.query)
    res.json(russiaRegionsNames)
})

router.get('/predict/:region', (req, res) => {
    console.log(req.url, req.method)
    console.log("Params: ", req.params)
    let region = req.params.region

    if (!russiaRegionsNames.regionsInRussia.includes(region)) {
        res.status(404).json(invalidRegionErrorObject)
    } else {

        let predictions = getPredictions(region)
        if (predictions == null) {
            // res.sendFile(path.join(viewsDir, 'not_enough_data.html'))
            res.render('not_enough_data')
        } else {
            res.json(predictions)
        }
    }
})

router.get('/predict', (req, res) => {
    console.log(req.query)
    let region = req.query.region

    if (region === undefined) {
        region = "Total"
        let predictions = getPredictions(region)
        if (predictions == null) {
            // res.sendFile(path.join(viewsDir, 'not_enough_data.html'))
            res.render('not_enough_data')
        } else {
            res.json(predictions)
        }
        return
    }
    if (!russiaRegionsNames.regionsInRussia.includes(region)) {
        res.status(404).json(invalidRegionErrorObject)
    } else {
        let predictions = getPredictions(region)
        if (predictions == null) {
            // res.sendFile(path.join(viewsDir, 'not_enough_data.html'))
            res.render('not_enough_data')
        } else {
            res.json(predictions)
        }
    }
})

router.get('/past/:region', (req, res) => {
    let regionName = req.params.region

    if (!russiaRegionsNames.regionsInRussia.includes(regionName)) {
        res.status(404).json(invalidRegionErrorObject)
    } else {
        let pastDataPromise = getPastValues(regionName)
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
    let regionName = req.query.region
    console.log(regionName);

    if (regionName === undefined) {
        regionName = "Total"
        let pastDataPromise = getPastValues(regionName)
        pastDataPromise.then(pastData => {
            if (pastData == null) {
                res.render('not_enough_data')
            } else {
                res.send(pastData)
            }
        }).catch(err => {
            res.render('not_enough_data')
        })
        return
    }
    if (!russiaRegionsNames.regionsInRussia.includes(regionName)) {
        res.status(404).json(invalidRegionErrorObject)
    } else {
        let pastDataPromise = getPastValues(regionName)
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

    if (!russiaRegionsNames.regionsInRussia.includes(state)) {
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

const getPastValues = async (region) => {
    let filename = replaceSpecialCharacters(region)
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


const getRussiaRegions = () => {
    let data = fs.readFileSync(russiaRegionsFile, { encoding: 'utf8' })
    russiaRegions = JSON.parse(data)

    russiaRegionsNames.regionsInRussia = russiaRegions.map(region => region.Region_eng)

    return
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


const getPredictions = (region) => {
    let filename = replaceSpecialCharacters(region)
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

getRussiaRegions()
prepareHeatFactors()

module.exports = router