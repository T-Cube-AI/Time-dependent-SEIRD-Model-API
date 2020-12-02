#!/usr/bin/python3

import json
import re
import os
from computeInsightsFunction import computeInsights

PREDICTIONS_DIR = './Predictions/India/'
DATASETS_DIR = './Datasets/India/'
INSIGHTS_DIR = './Insights/India/'

district_wise_population_file = "./district_wise_population_india.json"
fhand = open(district_wise_population_file)
district_wise_population = json.load(fhand)
fhand.close()


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


for stateName in district_wise_population:
    stateDirName = stateName.replace(' ', '-')
    insightsStateDirName = INSIGHTS_DIR + stateDirName
    try:
        os.mkdir(insightsStateDirName)
    except FileExistsError:
        pass
    except Exception as e:
        print(e)
        print("Couldn't create state directory")
        continue
    districtsOfThisState = district_wise_population[stateName]["districts"]

    districtsOfThisState.append({"districtName": "total"})
    for districtObject in districtsOfThisState:
        districtName = districtObject["districtName"]
        filename = districtName.replace(' ', '-')
        infile = DATASETS_DIR + stateDirName + '/' + filename + '.csv'
        outfile = PREDICTIONS_DIR + stateDirName + '/' + filename + '_projections.json'
        insightsFile = INSIGHTS_DIR + stateDirName + '/' + filename + '.json'
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
            print(f"Couldn't find {stateName} -> {districtName} ", e)


####### CODE REPETETION ############
filename = "Total"
infile = DATASETS_DIR + '/' + filename + '.csv'
outfile = PREDICTIONS_DIR + '/' + filename + '_projections.json'
insightsFile = INSIGHTS_DIR + '/' + filename + '.json'

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
### NO TIME>>> SHOULD MAKE A FINCTION FOR INSIGHTS CALCULATION ######
