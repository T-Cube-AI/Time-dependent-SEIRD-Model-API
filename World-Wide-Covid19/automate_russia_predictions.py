#!/usr/bin/python3

from Model import SEIRD
import re
import json

DATASETS_DIR = "./Datasets/Russia"
PREDICTIONS_DIR = "./Predictions/Russia"
INSIGHTS_DIR = "./Insights/Russia"

regions_filename = "./russia-regions.json"
regionsFileHandler = open(regions_filename)
regionsData = json.load(regionsFileHandler)
russiaHeatFactorsFile = "./russia_heatfactors.json"
stateToHeatFactorsMap = dict()

russiaTotalPredictionsFile = PREDICTIONS_DIR + '/Total_projections.json'
firstDayTotalActive = None

with open(russiaTotalPredictionsFile) as f:
    data = json.load(f)
    ############ 7 days ###############
    # firstDayTotalActive = data["predictions"][0]["active"]
    ############ 21 days ###############
    firstDayTotalActive = data["overallPredictions"][0]["Week-1"]["predictions"][0]["active"]


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


def calculateHeatFactor(outputs, population):
    activeValues = outputs["Active"].values
    firstDayActive = int(activeValues[0])
    lastDayActive = int(activeValues[-1])

    heatFactor = (lastDayActive - firstDayActive) * (1 / firstDayTotalActive)
    heatFactor = 0 if heatFactor < 0 else heatFactor
    return heatFactor


def replaceSpecialCharacters(filename):
    filename = re.sub(r'\s+', ' ', filename)
    filename = filename.replace(' ', '-')
    filename = filename.replace('(', '')
    filename = filename.replace('.', '')
    filename = filename.replace(')', '')

    return filename


def computeInsights(confrimed, deaths, active=None):
    insights = dict()
    cfr = (deaths / confrimed) * 100
    insights["cfr"] = cfr
    if active != None:
        ifr = (deaths / active) * 100
        insights["ifr"] = ifr

    return insights


def makePredictions(infile, population, outfile):
    model = SEIRD(infile, population, outfile)
    output = model.final_run()

    return output


for regionObject in regionsData:
    regionName = regionObject["Region_eng"]
    inFile = replaceSpecialCharacters(regionName)
    inFile += ".csv"
    inFile = DATASETS_DIR + '/' + inFile

    outFile = replaceSpecialCharacters(regionName)
    outfile = PREDICTIONS_DIR + '/' + outFile
    population = regionObject["Population"]

    try:
        outputs = makePredictions(inFile, int(population), outfile)
        heatFactor = calculateHeatFactor(outputs, int(population))
        print(regionName, heatFactor)
        stateToHeatFactorsMap[regionName] = heatFactor
    except Exception as e:
        print(e)


normalizedHeatFactors = normalize(list(stateToHeatFactorsMap.values()))
stateToHeatFactorsMap = {x: y*100 for x, y in zip(
    list(stateToHeatFactorsMap.keys()), normalizedHeatFactors)}
with open(russiaHeatFactorsFile, 'w') as f:
    json.dump(stateToHeatFactorsMap, f)
