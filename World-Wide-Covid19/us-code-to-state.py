#!/usr/bin/python3

import requests
import json

US_STATES_URL = "https://covidtracking.com/api/states/info"
outfile = "./us-codes-to-states.json"
fhandle = open(outfile, 'w')

response = requests.get(US_STATES_URL)
jsonData = response.json()

codesAndStatesMap = dict()

for stateObject in jsonData:
    stateCode = stateObject["state"]
    stateName = stateObject["name"]
    codesAndStatesMap[stateCode] = stateName
    # codesAndStatesMap[stateName] = stateCode

json.dump(codesAndStatesMap, fhandle)
fhandle.close()
