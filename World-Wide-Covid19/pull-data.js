const fetch = require('node-fetch')

const RUSSIA_URL = "http://covid19.bvn13.com/stats/all"

var getData = async () => {
    response = await fetch(RUSSIA_URL)
    jsonData = await response.json()
    console.log(jsonData)
}

getData()