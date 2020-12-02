#!/usr/bin/python3

import json
import re
from computeInsightsFunction import computeInsights

PREDICTIONS_DIR = './Predictions/Russia'
DATASETS_DIR = './Datasets/Russia'
INSIGHTS_DIR = './Insights/Russia'

regions_filename = "./russia-regions.json"
regionsFileHandler = open(regions_filename)
regionsData = json.load(regionsFileHandler)
totalRussiaObject = {'Region_eng': 'Total'}
regionsData.append(totalRussiaObject)


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
    active = lastData["active"]
    deaths = lastData["deaths"]

    return confirmed, active, deaths


for regionObject in regionsData:
    regionName = regionObject["Region_eng"]
    filename = replaceSpecialCharacters(regionName)

    infile = DATASETS_DIR + '/' + filename + ".csv"
    outfile = PREDICTIONS_DIR + '/' + filename + '_projections.json'
    insightsFile = INSIGHTS_DIR + '/' + filename + '.json'
    try:
        currentConfirmed, currentRecovered, currentDeaths = currentValues(
            infile)
        projectedConfirmed, projectedActive, projectedDeaths = projectionValues(
            outfile)

        currentActive = currentConfirmed - currentDeaths - currentRecovered

        currentInsights = computeInsights(
            currentConfirmed, currentDeaths, currentActive)

        projectedInsights = computeInsights(
            projectedConfirmed, projectedDeaths, projectedActive)

        insightsObject = {
            "Current": currentInsights,
            "Projected": projectedInsights,
        }
        insightsFileHandle = open(insightsFile, 'w')
        json.dump(insightsObject, insightsFileHandle)
        insightsFileHandle.close()
    except Exception as e:
        print(regionName, e)
