#!/usr/bin/python3

import json
import re
from computeInsightsFunction import computeInsights

PREDICTIONS_DIR = './Predictions/US'
DATASETS_DIR = './Datasets/US'
INSIGHTS_DIR = './Insights/US'

usStatesPopulationFile = "./US-population.json"
usStatesPopulation = json.load(open(usStatesPopulationFile))
stateToHeatFactorsMap = dict()
totalUSObject = {'State': 'Total'}
usStatesPopulation.append(totalUSObject)


def replaceSpecialCharacters(filename):
    filename = re.sub(r'\s+', ' ', filename)
    filename = filename.replace(' ', '-')
    filename = filename.replace('(', '')
    filename = filename.replace('.', '')
    filename = filename.replace(')', '')

    return filename


def currentValues(filename):
    fhandle = open(filename)
    data = fhandle.readlines()
    lastLine = data[-1]
    lastData = lastLine.split(',')
    confirmed = int(lastData[2])
    recovered = int(lastData[3])
    deaths = int(lastData[4])

    return confirmed, recovered, deaths


def projectionValues(filename):
    fhandle = open(filename)
    data = json.load(fhandle)
    predictions = data['overallPredictions']
    lastWeek = predictions[2]['Week-3']["predictions"]
    lastData = lastWeek[-1]
    confirmed = lastData["confirmed"]
    deaths = lastData["deaths"]

    return confirmed, deaths


for stateObject in usStatesPopulation:
    stateName = stateObject["State"]
    filename = replaceSpecialCharacters(stateName)

    infile = DATASETS_DIR + '/' + filename + '.csv'
    outfile = PREDICTIONS_DIR + '/' + filename + '_projections.json'
    insightsFile = INSIGHTS_DIR + '/' + filename + '.json'
    try:
        currentConfirmed, currentRecovered, currentDeaths = currentValues(
            infile)
        projectedConfirmed, projectedDeaths = projectionValues(outfile)
        currentInsights = computeInsights(currentConfirmed, currentDeaths)
        projectedInsights = computeInsights(
            projectedConfirmed, projectedDeaths)
        insightsObject = {
            "Current": currentInsights,
            "Projected": projectedInsights,
        }
        insightsFileHandle = open(insightsFile, 'w')
        json.dump(insightsObject, insightsFileHandle)
        insightsFileHandle.close()
    except Exception as e:
        print(stateName, e)
