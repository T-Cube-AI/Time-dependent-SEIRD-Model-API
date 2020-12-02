const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const fs = require('fs')
const CSVToJson = require('csvtojson')
var router = express.Router()

// global variables
const PREDICTIONS_DIR = path.join(__dirname, '../../../Predictions/India')
const DATASETS_DIR = path.join(__dirname, '../../../Datasets/India')
const HEAT_FACTORS_DIR = path.join(__dirname, '../../../HeatFactors/India')
const INSIGHTS_DIR = path.join(__dirname, '../../../Insights/India')
const viewsDir = path.join(__dirname, '../../views')
const indiaStateCodeMappingFile = path.join(__dirname, '../../../state_codes.json')
const stateDistrictsMappingFile = path.join(__dirname, '../../../district_wise_population_india.json')
const statesInIndia = { "allStatesInIndia": [] }
const stateAndDistrictsMapping = {}
const invalidStateErrorObject = { "message": "Please provide a valid state name" }
const invalidDistrictErrorObject = { "message": "Please provide a valid district name" }
const availableEndPoints = { "Endpoints": ["/states", "/districts", "/predict", "/past", "/heatfactors", "insights"] }

// Middleware to parse search params
router.use(bodyParser.json())

// Routes
/**
 * @api {get} /countries/India / redirects to /countries/India/states
 * @apiGroup /countries/India
 * @apiSuccess {Object[]} allStatesInIndia list of states
 * @apiSuccessExample {json} Success
 *   HTTP/1.1 200 OK
 *   {"allStatesInIndia":["Andaman and Nicobar Islands","Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chandigarh","Chhattisgarh","Delhi","Dadra and Nagar Haveli and Daman and Diu","Goa","Gujarat","Himachal Pradesh","Haryana","Jharkhand","Jammu and Kashmir","Karnataka","Kerala","Ladakh","Lakshadweep","Maharashtra","Meghalaya","Manipur","Madhya Pradesh","Mizoram","Nagaland","Odisha","Punjab","Puducherry","Rajasthan","Sikkim","Telangana","Tamil Nadu","Tripura","Uttar Pradesh","Uttarakhand","West Bengal"]}
 * @apiErrorExample {json} Failed
 *    HTTP/1.1 500 Internal Server Error
 */
router.get('/', (req, res) => {
    console.log("IndiaAPI")
    console.log(req.url, req.method)
    console.log("Query: ", req.query)
    res.redirect('states')
    // let predictions = getTotalIndianPredictions()
    // res.send(predictions)
})

/**
 * @api {get} /countries/India/endpoints /endpoints available endpoints
 * @apiGroup /countries/India
 * @apiSuccess {Object[]} Endpoints list of endpoints
 * @apiSuccessExample {json} Success
 *   HTTP/1.1 200 OK
 *   {"Endpoints":["/states","/districts","/predict","/past","/heatfactors","insights"]}
 * @apiErrorExample {json} Failed
 *    HTTP/1.1 500 Internal Server Error
 */
router.get('/endpoints', (req, res) => {
    res.json(availableEndPoints)
})

/**
 * @api {get} /countries/India/heatfactors /heatfactors heatfactors
 * @apiGroup /countries/India
 * @apiSuccess {Object[]} state-name heatfactors of each state
 * @apiSuccessExample {json} Success
 *   HTTP/1.1 200 OK
 *   {"Andhra Pradesh":88.05317040951122,"Arunachal Pradesh":0.037153236459709374,"Assam":22.023612945838835,"Bihar":36.22027741083223,"Chhattisgarh":1.506770145310436,"Goa":0.7471928665785996,"Gujarat":2.3323976221928664,"Haryana":1.4820013210039629,"Himachal Pradesh":0,"Jharkhand":8.986955085865258,"Karnataka":33.66908850726552,"Kerala":7.166446499339497,"Madhya Pradesh":1.4696169088507265,"Maharashtra":100,"Manipur":0.8462681638044913,"Meghalaya":0.44996697490092463,"Mizoram":0,"Nagaland":11.29458388375165,"Odisha":8.334709379128137,"Punjab":0.11558784676354028,"Rajasthan":6.34494715984148,"Sikkim":0.4540951122853369,"Tamil Nadu":0,"Telangana":8.623678996036988,"Tripura":0,"Uttar Pradesh":36.253302509907535,"Uttarakhand":0,"West Bengal":20.302179656538968,"Andaman and Nicobar Islands":0,"Chandigarh":1.081571994715984,"Dadra and Nagar Haveli and Daman and Diu":0.22704755614266844,"Jammu and Kashmir":4.049702774108322,"Ladakh":0.11971598414795244,"Lakshadweep":0,"Delhi":2.022787318361955,"Puducherry":1.4365918097754293}
 * @apiErrorExample {json} Failed
 *    HTTP/1.1 500 Internal Server Error
 */
router.get('/heatfactors', (req, res) => {
    let stateName = "Total"
    let heatfactors = getHeatfactors(stateName)
    res.json(heatfactors)
})

/**
 * @api {get} /countries/India/heatfactors/:state /heatfactors/:state heatfactors
 * @apiGroup /countries/India
 * @apiSuccess {Object[]} district-name heatfactors of each district
 * @apiSuccessExample {json} Success
 *   HTTP/1.1 200 OK
 *    {"Ahmednagar":19.609261939218527,"Akola":0,"Amravati":1.3748191027496381,"Aurangabad":1.3314037626628077,"Beed":4.703328509406656,"Bhandara":0,"Buldhana":1.5340086830680173,"Chandrapur":1.186685962373372,"Dhule":2.3589001447178,"Gadchiroli":0.7380607814761216,"Gondia":1.4471780028943562,"Hingoli":0.3328509406657019,"Jalgaon":15.658465991316934,"Jalna":0.08683068017366136,"Kolhapur":34.500723589001446,"Latur":12.547033285094066,"Mumbai":29.507959479015923,"Mumbai Suburban":0,"Nanded":14.790159189580319,"Nandurbar":0.43415340086830684,"Nagpur":59.4356005788712,"Nashik":22.416787264833577,"Osmanabad":5.151953690303908,"Palghar":9.739507959479015,"Parbhani":0,"Pune":100,"Raigad":3.2127351664254706,"Ratnagiri":0,"Sangli":16.70043415340087,"Satara":6.845151953690304,"Sindhudurg":0,"Solapur":8.509406657018815,"Thane":36.38205499276411,"Wardha":0.5209840810419682,"Washim":0,"Yavatmal":2.4167872648335744}
 * @apiErrorExample {json} Failed
 *    HTTP/1.1 500 Internal Server Error
 * @apiErrorExample {json} Failed
 *    HTTP/1.1 404 State Not Found
 */
router.get('/heatfactors/:state', (req, res) => {
    console.log("Params: ", req.params)
    let stateName = req.params.state
    if (!stateName || !statesInIndia.allStatesInIndia.includes(stateName)) {
        res.status(404).json(invalidStateErrorObject)
    } else {
        let heatfactors = getHeatfactors(stateName)
        res.json(heatfactors)
    }
})

/**
 * @api {get} /countries/India/states /states states in India
 * @apiGroup /countries/India
 * @apiSuccess {Object[]} allStatesInIndia list of states
 * @apiSuccessExample {json} Success
 *   HTTP/1.1 200 OK
 *   {"allStatesInIndia":["Andaman and Nicobar Islands","Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chandigarh","Chhattisgarh","Delhi","Dadra and Nagar Haveli and Daman and Diu","Goa","Gujarat","Himachal Pradesh","Haryana","Jharkhand","Jammu and Kashmir","Karnataka","Kerala","Ladakh","Lakshadweep","Maharashtra","Meghalaya","Manipur","Madhya Pradesh","Mizoram","Nagaland","Odisha","Punjab","Puducherry","Rajasthan","Sikkim","Telangana","Tamil Nadu","Tripura","Uttar Pradesh","Uttarakhand","West Bengal"]}
 * @apiErrorExample {json} Failed
 *    HTTP/1.1 500 Internal Server Error
 */
router.get('/states', (req, res) => {
    res.json(statesInIndia)
})


/**
 * @api {get} /countries/India/districts /districts districts of a particular state in India
 * @apiGroup /countries/India
 * @apiParam {string} state
 * @apiSuccess {Object[]} list list of districts
 * @apiSuccessExample {json} Success
 *   HTTP/1.1 200 OK
 *   ["Ahmednagar","Akola","Amravati","Aurangabad","Beed","Bhandara","Buldhana","Chandrapur","Dhule","Gadchiroli","Gondia","Hingoli","Jalgaon","Jalna","Kolhapur","Latur","Mumbai","Mumbai Suburban","Nanded","Nandurbar","Nagpur","Nashik","Osmanabad","Palghar","Parbhani","Pune","Raigad","Ratnagiri","Sangli","Satara","Sindhudurg","Solapur","Thane","Wardha","Washim","Yavatmal"]
 * @apiErrorExample {json} Not Found
 *    HTTP / 404 Not Found
 *      {"message":"Please provide a valid state name"}
 * @apiErrorExample {json} Failed
 *    HTTP/1.1 500 Internal Server Error
 */
router.get('/districts', (req, res) => {
    console.log("Query: ", req.query)
    let stateName = req.query.state
    if (!stateName || !statesInIndia.allStatesInIndia.includes(stateName)) {
        res.status(404).json(invalidStateErrorObject)
    } else {
        res.send(stateAndDistrictsMapping[stateName])
    }
})

router.get('/districts/:state', (req, res) => {
    console.log("Query: ", req.params)
    let stateName = req.params.state
    if (!stateName || !statesInIndia.allStatesInIndia.includes(stateName)) {
        res.status(404).json(invalidStateErrorObject)
    } else {
        // console.log(stateAndDistrictsMapping.stateName)
        res.send(stateAndDistrictsMapping[stateName])
    }
})


/**
 * @api {get} /countries/India/predict
 * @apiGroup /countries/India
 * @apiSuccess {Object[]} overallPredictions 3-week predictions of INDIA
 * @apiSuccessExample {json} Success
 *   HTTP/1.1 200 OK
 *   {"overallPredictions":[{"Week-1":{"predictions":[{"date":"2020-08-07","active":617910,"deaths":42640,"confirmed":2081276},{"date":"2020-08-08","active":630257,"deaths":43611,"confirmed":2142721},{"date":"2020-08-09","active":643280,"deaths":44600,"confirmed":2205823},{"date":"2020-08-10","active":656953,"deaths":45611,"confirmed":2270610},{"date":"2020-08-11","active":671253,"deaths":46642,"confirmed":2337110},{"date":"2020-08-12","active":686162,"deaths":47696,"confirmed":2405355},{"date":"2020-08-13","active":701662,"deaths":48774,"confirmed":2475376}],"total":{"active":701662,"deaths":48774,"confirmed":2475376}}},{"Week-2":{"predictions":[{"date":"2020-08-14","active":717742,"deaths":49876,"confirmed":2547209},{"date":"2020-08-15","active":734389,"deaths":51003,"confirmed":2620886},{"date":"2020-08-16","active":751594,"deaths":52156,"confirmed":2696444},{"date":"2020-08-17","active":769350,"deaths":53336,"confirmed":2773920},{"date":"2020-08-18","active":787651,"deaths":54544,"confirmed":2853352},{"date":"2020-08-19","active":806492,"deaths":55781,"confirmed":2934778},{"date":"2020-08-20","active":825871,"deaths":57047,"confirmed":3018239}],"total":{"active":825871,"deaths":57047,"confirmed":3018239}}},{"Week-3":{"predictions":[{"date":"2020-08-21","active":845785,"deaths":58344,"confirmed":3103775},{"date":"2020-08-22","active":866233,"deaths":59672,"confirmed":3191427},{"date":"2020-08-23","active":887216,"deaths":61033,"confirmed":3281240},{"date":"2020-08-24","active":908734,"deaths":62426,"confirmed":3373254},{"date":"2020-08-25","active":930789,"deaths":63853,"confirmed":3467515},{"date":"2020-08-26","active":953381,"deaths":65314,"confirmed":3564065},{"date":"2020-08-27","active":976515,"deaths":66811,"confirmed":3662953}],"total":{"active":976515,"deaths":66811,"confirmed":3662953}}}]}
 * @apiErrorExample {json} Failed
 *    HTTP/1.1 500 Internal Server Error
 */
router.get('/predict', (req, res) => {
    let predictions = getTotalIndianPredictions()
    res.send(predictions)
})


/**
 * @api {get} /countries/India/predict/:state
 * @apiParam {String} state
 * @apiGroup /countries/India
 * @apiSuccess {Object[]} overallPredictions 3-week predictions of given state
 * @apiSuccessExample {json} Success
 *   HTTP/1.1 200 OK
 *   {"overallPredictions":[{"Week-1":{"predictions":[{"date":"2020-08-07","active":617910,"deaths":42640,"confirmed":2081276},{"date":"2020-08-08","active":630257,"deaths":43611,"confirmed":2142721},{"date":"2020-08-09","active":643280,"deaths":44600,"confirmed":2205823},{"date":"2020-08-10","active":656953,"deaths":45611,"confirmed":2270610},{"date":"2020-08-11","active":671253,"deaths":46642,"confirmed":2337110},{"date":"2020-08-12","active":686162,"deaths":47696,"confirmed":2405355},{"date":"2020-08-13","active":701662,"deaths":48774,"confirmed":2475376}],"total":{"active":701662,"deaths":48774,"confirmed":2475376}}},{"Week-2":{"predictions":[{"date":"2020-08-14","active":717742,"deaths":49876,"confirmed":2547209},{"date":"2020-08-15","active":734389,"deaths":51003,"confirmed":2620886},{"date":"2020-08-16","active":751594,"deaths":52156,"confirmed":2696444},{"date":"2020-08-17","active":769350,"deaths":53336,"confirmed":2773920},{"date":"2020-08-18","active":787651,"deaths":54544,"confirmed":2853352},{"date":"2020-08-19","active":806492,"deaths":55781,"confirmed":2934778},{"date":"2020-08-20","active":825871,"deaths":57047,"confirmed":3018239}],"total":{"active":825871,"deaths":57047,"confirmed":3018239}}},{"Week-3":{"predictions":[{"date":"2020-08-21","active":845785,"deaths":58344,"confirmed":3103775},{"date":"2020-08-22","active":866233,"deaths":59672,"confirmed":3191427},{"date":"2020-08-23","active":887216,"deaths":61033,"confirmed":3281240},{"date":"2020-08-24","active":908734,"deaths":62426,"confirmed":3373254},{"date":"2020-08-25","active":930789,"deaths":63853,"confirmed":3467515},{"date":"2020-08-26","active":953381,"deaths":65314,"confirmed":3564065},{"date":"2020-08-27","active":976515,"deaths":66811,"confirmed":3662953}],"total":{"active":976515,"deaths":66811,"confirmed":3662953}}}]}
 * @apiErrorExample {json} Not Found
 *    HTTP / 404 Not Found
 *      {"message":"Please provide a valid state name"}
 * @apiErrorExample {json} Failed
 *    HTTP/1.1 500 Internal Server Error
 */
router.get('/predict/:state', (req, res) => {
    let stateName = req.params.state

    console.log(req.params)

    if (!stateName || !statesInIndia.allStatesInIndia.includes(stateName)) {
        res.status(404).json(invalidStateErrorObject)
    } else {
        let predictions = getPredictions(stateName)
        if (predictions == null) {
            //res.render('not_enough_data')
            console.log("Not enough data")
            res.status(204).render('not_enough_data')
        } else {
            res.send(predictions)
        }
    }
})


/**
 * @api {get} /countries/India/predict/:state/:district
 * @apiParam {String} state
 * @apiParam {String} district
 * @apiGroup /countries/India
 * @apiSuccess {Object[]} overallPredictions 3-week predictions of given district
 * @apiSuccessExample {json} Success
 *   HTTP/1.1 200 OK
 *   {"overallPredictions":[{"Week-1":{"predictions":[{"date":"2020-08-07","active":617910,"deaths":42640,"confirmed":2081276},{"date":"2020-08-08","active":630257,"deaths":43611,"confirmed":2142721},{"date":"2020-08-09","active":643280,"deaths":44600,"confirmed":2205823},{"date":"2020-08-10","active":656953,"deaths":45611,"confirmed":2270610},{"date":"2020-08-11","active":671253,"deaths":46642,"confirmed":2337110},{"date":"2020-08-12","active":686162,"deaths":47696,"confirmed":2405355},{"date":"2020-08-13","active":701662,"deaths":48774,"confirmed":2475376}],"total":{"active":701662,"deaths":48774,"confirmed":2475376}}},{"Week-2":{"predictions":[{"date":"2020-08-14","active":717742,"deaths":49876,"confirmed":2547209},{"date":"2020-08-15","active":734389,"deaths":51003,"confirmed":2620886},{"date":"2020-08-16","active":751594,"deaths":52156,"confirmed":2696444},{"date":"2020-08-17","active":769350,"deaths":53336,"confirmed":2773920},{"date":"2020-08-18","active":787651,"deaths":54544,"confirmed":2853352},{"date":"2020-08-19","active":806492,"deaths":55781,"confirmed":2934778},{"date":"2020-08-20","active":825871,"deaths":57047,"confirmed":3018239}],"total":{"active":825871,"deaths":57047,"confirmed":3018239}}},{"Week-3":{"predictions":[{"date":"2020-08-21","active":845785,"deaths":58344,"confirmed":3103775},{"date":"2020-08-22","active":866233,"deaths":59672,"confirmed":3191427},{"date":"2020-08-23","active":887216,"deaths":61033,"confirmed":3281240},{"date":"2020-08-24","active":908734,"deaths":62426,"confirmed":3373254},{"date":"2020-08-25","active":930789,"deaths":63853,"confirmed":3467515},{"date":"2020-08-26","active":953381,"deaths":65314,"confirmed":3564065},{"date":"2020-08-27","active":976515,"deaths":66811,"confirmed":3662953}],"total":{"active":976515,"deaths":66811,"confirmed":3662953}}}]}
 * @apiErrorExample {json} Not Found
 *    HTTP / 404 Not Found
 *      {"message":"Please provide a valid district name"}
 * @apiErrorExample {json} Not Found
 *    HTTP / 404 Not Found
 *      {"message":"Please provide a valid state name"}
 * @apiErrorExample {json} Failed
 *    HTTP/1.1 500 Internal Server Error
 */
router.get('/predict/:state/:district', (req, res) => {
    let stateName = req.params.state
    let districtName = req.params.district

    if (!stateName || !statesInIndia.allStatesInIndia.includes(stateName)) {
        res.status(404).json(invalidStateErrorObject)
    } else {
        let districtsInThisState = stateAndDistrictsMapping[stateName]
        if (districtName != null && !districtsInThisState.includes(districtName)) {
            res.status(404).json(invalidDistrictErrorObject)
        } else {
            let predictions = getPredictions(stateName, districtName)
            if (predictions == null) {
                //res.render('not_enough_data')
                console.log("Not enough data")
                res.status(204).render('not_enough_data')
            } else {
                res.send(predictions)
            }
        }
    }
})

router.get('/predict', (req, res) => {
    console.log("Query: ", req.query)
    let stateName = req.query.state
    let districtName = req.query.district
    // console.log(stateName, districtName)

    if (!statesInIndia.allStatesInIndia.includes(stateName)) {
        res.status(404).json(invalidStateErrorObject)
    } else {
        let districtsInThisState = stateAndDistrictsMapping[stateName]
        if (districtName != null && !districtsInThisState.includes(districtName)) {
            res.status(404).json(invalidDistrictErrorObject)
        } else {
            let predictions = getPredictions(stateName, districtName)
            if (predictions == null) {
                //res.render('not_enough_data')
                res.status(204).render('not_enough_data')
            } else {
                res.send(predictions)
            }
        }
    }
})

router.get('/past', (req, res) => {
    let pastDataPromise = getTotalIndianPastData()
    pastDataPromise.then(pastData => {
        if (pastData == null) {
            //res.render('not_enough_data')
            res.status(204).render('not_enough_data')
        } else {
            res.send(pastData)
        }
    }).catch(err => {
        //res.render('not_enough_data')
        res.status(204).render('not_enough_data')
    })
})

router.get('/past/:state', (req, res) => {
    let stateName = req.params.state

    if (!statesInIndia.allStatesInIndia.includes(stateName)) {
        res.status(404).json(invalidStateErrorObject)
    } else {
        let pastDataPromise = getPastValues(stateName)
        pastDataPromise.then(pastData => {
            if (pastData == null) {
                //res.render('not_enough_data')
                res.status(204).render('not_enough_data')
            } else {
                res.send(pastData)
            }
        }).catch(err => {
            //res.render('not_enough_data')
            res.status(204).render('not_enough_data')
        })
    }
})

router.get('/past/:state/:district', (req, res) => {
    console.log("Query: ", req.query)
    let stateName = req.params.state
    let districtName = req.params.district
    // console.log(stateName, districtName)

    if (!statesInIndia.allStatesInIndia.includes(stateName)) {
        res.status(404).json(invalidStateErrorObject)
    } else {
        let districtsInThisState = stateAndDistrictsMapping[stateName]
        if (districtName != null && !districtsInThisState.includes(districtName)) {
            res.status(404).json(invalidDistrictErrorObject)
        } else {
            let pastDataPromise = getPastValues(stateName, districtName)
            pastDataPromise.then(pastData => {
                if (pastData == null) {
                    //res.render('not_enough_data')
                    res.status(204).render('not_enough_data')
                } else {
                    res.send(pastData)
                }
            }).catch(err => {
                //res.render('not_enough_data')
                res.status(204).render('not_enough_data')
            })
        }
    }
})

router.get('/past', (req, res) => {
    console.log("Query: ", req.query)
    let stateName = req.query.state
    let districtName = req.query.district
    // console.log(stateName, districtName)

    if (!statesInIndia.allStatesInIndia.includes(stateName)) {
        res.status(404).json(invalidStateErrorObject)
    } else {
        let districtsInThisState = stateAndDistrictsMapping[stateName]
        if (districtName != null && !districtsInThisState.includes(districtName)) {
            res.status(404).json(invalidDistrictErrorObject)
        } else {
            let pastDataPromise = getPastValues(stateName, districtName)
            pastDataPromise.then(pastData => {
                if (pastData == null) {
                    //res.render('not_enough_data')
                    res.status(204).render('not_enough_data')
                } else {
                    res.send(pastData)
                }
            }).catch(err => {
                //res.render('not_enough_data')
                res.status(204).render('not_enough_data')
            })
        }
    }
})


router.get('/insights', (req, res) => {
    let insights = getTotalIndianInsights()
    res.send(insights)
})


router.get('/insights/:state', (req, res) => {
    let stateName = req.params.state

    console.log(req.params)

    if (!stateName || !statesInIndia.allStatesInIndia.includes(stateName)) {
        res.status(404).json(invalidStateErrorObject)
    } else {
        let insights = getInsights(stateName)
        if (insights == null) {
            //res.render('not_enough_data')
            console.log("Not enough data")
            res.status(204).render('not_enough_data')
        } else {
            res.send(insights)
        }
    }
})

router.get('/insights/:state/:district', (req, res) => {
    let stateName = req.params.state
    let districtName = req.params.district

    if (!stateName || !statesInIndia.allStatesInIndia.includes(stateName)) {
        res.status(404).json(invalidStateErrorObject)
    } else {
        let districtsInThisState = stateAndDistrictsMapping[stateName]
        if (districtName != null && !districtsInThisState.includes(districtName)) {
            res.status(404).json(invalidDistrictErrorObject)
        } else {
            let insights = getInsights(stateName, districtName)
            if (insights == null) {
                //res.render('not_enough_data')
                console.log("Not enough data")
                res.status(204).render('not_enough_data')
            } else {
                res.send(insights)
            }
        }
    }
})

const getPredictions = (state, district) => {
    if (state == null) {
        predictions = null
    } else {
        let stateDir = replaceSpecialCharacters(state)
        stateDir = path.join(PREDICTIONS_DIR, stateDir)

        if (district == null) {
            var predictionsFile = path.join(stateDir, 'total_projections.json')
        } else {
            let filename = replaceSpecialCharacters(district)
            filename += '_projections.json'
            var predictionsFile = path.join(stateDir, filename)
        }
        console.log(predictionsFile)
    }

    try {
        let predictionsString = fs.readFileSync(predictionsFile)
        var predictions = JSON.parse(predictionsString)
    } catch (err) {
        console.log(err)
        predictions = null
    }

    return predictions
}


const getHeatfactors = (statename) => {
    let filename = replaceSpecialCharacters(statename)
    filename = `${filename}.json`
    let heatfactorsFile = path.join(HEAT_FACTORS_DIR, filename)
    // console.log(heatfactorsFile)
    let heatfactors = fs.readFileSync(heatfactorsFile, { encoding: 'utf8' })
    return JSON.parse(heatfactors)
}

const getPastValues = async (state, district) => {
    if (state == null) {
        pastData = null
    } else {
        let stateDir = replaceSpecialCharacters(state)
        stateDir = path.join(DATASETS_DIR, stateDir)

        if (district == null) {
            var pastDataFile = path.join(stateDir, 'total.csv')
        } else {
            let filename = replaceSpecialCharacters(district)
            filename += '.csv'
            var pastDataFile = path.join(stateDir, filename)
        }
        console.log(pastDataFile)
    }

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

const getIndiaStates = () => {
    let data = fs.readFileSync(indiaStateCodeMappingFile, { encoding: 'utf8' })
    let jsonData = JSON.parse(data)

    let stateNames = Object.values(jsonData)
    // Remove unassigned state.(First state in the file)
    stateNames = stateNames.slice(1)
    statesInIndia.allStatesInIndia = stateNames
    return
}

const getTotalIndianPredictions = () => {
    let predictionsFile = path.join(PREDICTIONS_DIR, 'Total_projections.json')

    try {
        let predictionsString = fs.readFileSync(predictionsFile)
        var predictions = JSON.parse(predictionsString)
    } catch (err) {
        console.log(err)
        predictions = null
    }

    return predictions
}


const getTotalIndianInsights = () => {
    let insightsFile = path.join(INSIGHTS_DIR, 'Total.json')

    try {
        let insightsString = fs.readFileSync(insightsFile)
        var insights = JSON.parse(insightsString)
    } catch (err) {
        console.log(err)
        insights = null
    }

    return insights
}

const getTotalIndianPastData = async () => {
    let pastDataFile = path.join(DATASETS_DIR, 'Total.csv')

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

const replaceSpecialCharacters = (filename) => {
    filename = filename.replace(/[ ]+/, ' ')
    filename = filename.replace(/ /g, '-')
    filename = filename.replace('(', '')
    filename = filename.replace('.', '')
    filename = filename.replace(')', '')

    console.log({ filename })
    return filename
}

const getIndiaStatesAndDistricts = () => {
    let data = fs.readFileSync(stateDistrictsMappingFile, { encoding: 'utf8' })
    let jsonData = JSON.parse(data)

    for (stateName of Object.keys(jsonData)) {
        let stateInfo = jsonData[stateName]
        let allDistrictsOfThisState = stateInfo.districts
        let districtNames = allDistrictsOfThisState.map(
            districtObj => districtObj.districtName
        )

        stateAndDistrictsMapping[stateName] = districtNames
    }
}

const getInsights = (state, district) => {
    if (state == null) {
        insights = null
    } else {
        let stateDir = replaceSpecialCharacters(state)
        stateDir = path.join(INSIGHTS_DIR, stateDir)

        if (district == null) {
            var insightsFile = path.join(stateDir, 'total.json')
        } else {
            let filename = replaceSpecialCharacters(district)
            filename += '.json'
            var insightsFile = path.join(stateDir, filename)
        }
        console.log(insightsFile)
    }

    try {
        let insightsString = fs.readFileSync(insightsFile)
        var insights = JSON.parse(insightsString)
    } catch (err) {
        console.log(err)
        insights = null
    }

    return insights
}

getIndiaStates()
getIndiaStatesAndDistricts()

module.exports = router