#!/usr/bin/python3

import json
import os

HEAT_FACTORS_DIR = "./HeatFactors/India"
PREDICTIONS_DIR = "./Predictions/India"
indiaTotalPredictionsFile = PREDICTIONS_DIR + '/Total_projections.json'
firstDayTotalActive = None

with open(indiaTotalPredictionsFile) as f:
    data = json.load(f)
    ############ 7 days ###############
    # firstDayTotalActive = data["predictions"][0]["active"]
    ############ 21 days ###############
    firstDayTotalActive = data["overallPredictions"][0]["Week-1"]["predictions"][0]["active"]

district_wise_population_file = "./district_wise_population_india.json"
fhand = open(district_wise_population_file)
district_wise_population = json.load(fhand)
fhand.close()


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


def calculateHeatFactor(predictions, stateTotal=None):
    global firstDayTotalActive

    ############ 7 days ##############
    # firstDayActive = int(predictions["predictions"][0]["active"])  # 7 days
    # lastDayActive = int(predictions["predictions"][-1]["active"])  # 7 days
    ##################################

    ############ 21 days ###############
    try:
        firstDayActive = int(predictions["overallPredictions"]
                             [0]["Week-1"]["predictions"][0]["active"])
        lastDayActive = int(predictions["overallPredictions"]
                            [0]["Week-1"]["predictions"][-1]["active"])  # 7 days
    except KeyError:
        print("-------------------------------------------------")
        return 0
    ##################################

    if stateTotal == None:
        denominator = firstDayTotalActive
    else:
        denominator = stateTotal

    heatFactor = (lastDayActive - firstDayActive) * (1 / denominator)
    heatFactor = 0 if heatFactor < 0 else heatFactor
    return heatFactor


stateToHeatFactorMap = dict()
for stateName in district_wise_population:
    state = stateName.replace(" ", "-")
    predictionsStateDir = f'{PREDICTIONS_DIR}/{state}'
    stateTotalPredictionsFile = f'{predictionsStateDir}/total_projections.json'
    try:
        stateTotalPredictions = json.load(
            open(stateTotalPredictionsFile))
    except FileNotFoundError:
        print(f"\x1b[34mCould not load the predictions of {stateName}\x1b[0m")
        continue
    heatFactor = calculateHeatFactor(stateTotalPredictions)

    ############ 7 days ##############
    # stateTotal = stateTotalPredictions["predictions"][0]["active"]

    ############ 21 days ###############
    stateTotal = stateTotalPredictions["overallPredictions"][0]["Week-1"]["predictions"][0]["active"]

    stateToHeatFactorMap[stateName] = heatFactor
    # print(stateName, heatFactor)

    districtToHeatFactorMap = dict()
    districtsInThisState = district_wise_population[stateName]["districts"]

    for districtObject in districtsInThisState:
        districtName = districtObject["districtName"]
        print(f'{stateName} => {districtName}')
        district = districtName.replace(" ", "-")
        districtPredictionsFile = f'{predictionsStateDir}/{district}_projections.json'
        try:
            districtPredictions = json.load(
                open(districtPredictionsFile))
        except FileNotFoundError:
            print(
                f"\x1b[34mCould not load the predictions of {stateName}=>{districtName}\x1b[0m")
            continue

        heatFactor = calculateHeatFactor(
            districtPredictions, stateTotal=stateTotal)
        # print("\t", districtName, heatFactor)
        districtToHeatFactorMap[districtName] = heatFactor

    normalizedHeatFactors = normalize(list(districtToHeatFactorMap.values()))
    districtToHeatFactorMap = {x: y*100 for x, y in zip(
        list(districtToHeatFactorMap.keys()), normalizedHeatFactors)}

    stateHeatFactorsFile = f'{HEAT_FACTORS_DIR}/{state}.json'
    with open(stateHeatFactorsFile, 'w') as f:
        json.dump(districtToHeatFactorMap, f)

totalHeatFactorsFile = f'{HEAT_FACTORS_DIR}/Total.json'
normalizedHeatFactors = normalize(list(stateToHeatFactorMap.values()))
stateToHeatFactorMap = {x: y*100 for x, y in zip(
    list(stateToHeatFactorMap.keys()), normalizedHeatFactors)}
with open(totalHeatFactorsFile, 'w') as f:
    json.dump(stateToHeatFactorMap, f)
