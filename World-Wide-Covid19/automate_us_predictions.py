#!/usr/bin/python3

from US_Model import SEIRD
import re
import json

DATASETS_DIR = "./Datasets/US"
PREDICTIONS_DIR = "./Predictions/US"
INSIGHTS_DIR = "./Insights/US"

usStatesPopulationFile = "./US-population.json"
usStatesPopulation = json.load(open(usStatesPopulationFile))
stateToHeatFactorsMap = dict()
usHeatFactorsFile = "./us_heatfactors.json"

usTotalPredictionsFile = PREDICTIONS_DIR + '/Total_projections.json'
firstDayTotalActive = None

with open(usTotalPredictionsFile) as f:
    data = json.load(f)
    ############ 7 days ###############
    # firstDayTotalActive = data["predictions"][0]["active"]
    ############ 21 days ###############
    firstDayTotalActive = data["overallPredictions"][0]["Week-1"]["predictions"][0]["confirmed"]


def normalize(arr):
    if arr == []:
        return []
    small = min(arr)
    large = max(arr)

    normalizedArr = list()
    for x in arr:
        try:
            norm = (x - small)/(large - small)
        except ZeroDivisionError:
            norm = 0
        normalizedArr.append(norm)

    return normalizedArr


def replaceSpecialCharacters(filename):
    filename = re.sub(r'\s+', ' ', filename)
    filename = filename.replace(' ', '-')
    filename = filename.replace('(', '')
    filename = filename.replace('.', '')
    filename = filename.replace(')', '')

    return filename


def makePredictions(infile, population, outfile):
    model = SEIRD(infile, population, outfile)
    errors = model.final_run()

    return errors


def calculateHeatFactor(outputs):
    firstConfirmed = int(outputs[0:1]["Confirmed"])
    lastConfirmed = int(outputs[20:21]["Confirmed"])
    # print(firstConfirmed, lastConfirmed)
    heatFactor = (lastConfirmed - firstConfirmed) * (1)/firstDayTotalActive
    heatFactor = 0 if heatFactor < 0 else heatFactor

    return heatFactor


def computeInsights(confrimed, deaths, active=None):
    insights = dict()
    cfr = (deaths / confrimed) * 100
    insights["cfr"] = cfr
    if active != None:
        ifr = (deaths / active) * 100
        insights["ifr"] = ifr

    return insights


# print(usStatesPopulation)
for stateObject in usStatesPopulation:
    stateName = stateObject["State"]
    population = stateObject["Pop"]

    filename = replaceSpecialCharacters(stateName)
    infile = DATASETS_DIR + '/' + filename + '.csv'

    outfile = PREDICTIONS_DIR + '/' + filename
    try:
        outputs = makePredictions(infile, population, outfile)
        # print(outputs)
        heatFactor = calculateHeatFactor(outputs)
        print(stateName, heatFactor)
        stateToHeatFactorsMap[stateName] = heatFactor
    except Exception as e:
        print(e)


normalizedHeatFactors = normalize(list(stateToHeatFactorsMap.values()))
stateToHeatFactorsMap = {x: y*100 for x, y in zip(
    list(stateToHeatFactorsMap.keys()), normalizedHeatFactors)}
with open(usHeatFactorsFile, 'w') as f:
    json.dump(stateToHeatFactorsMap, f)
