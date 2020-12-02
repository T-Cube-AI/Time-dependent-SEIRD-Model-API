#!/usr/bin/python3

import json
from Model import SEIRD
import os

DATASET_DIR = "./Datasets/India"
PREDICTIONS_DIR = "./Predictions/India"
LOGS_DIR = "./Logs"

try:
    os.mkdir(LOGS_DIR)
except FileExistsError:
    pass
except Exception as e:
    print(e, "While creating ", LOGS_DIR, "directory")
    quit()

WRONG_DISTRICT_LOG_FILE = LOGS_DIR + "/wrong_districts.csv"
DISTRICTS_WITH_NO_POPULATION_INFO = LOGS_DIR + \
    "/districts_with_no_population_info.csv"
DISTRICTS_WITH_OVERFLOW_ERROR = LOGS_DIR + "/districts_with_overflow.csv"
DISTRICTS_WITH_LESS_DATA = LOGS_DIR + "/districts_with_less_data.csv"

district_wise_population_file = "./district_wise_population_india.json"
fhand = open(district_wise_population_file)
district_wise_population = json.load(fhand)
fhand.close()

wrongDistricts = 0
wrongDistrictsList = list()
wrongDistrictsFHand = open(WRONG_DISTRICT_LOG_FILE, 'w')

noPopulationInfo = 0
noPopulationInfoList = list()
noPopulationInfoFHand = open(DISTRICTS_WITH_NO_POPULATION_INFO, 'w')
noPopulationInfoFHand.write("State, District\n")

overflows = 0
overflowsList = list()
overflowsFHand = open(DISTRICTS_WITH_OVERFLOW_ERROR, 'w')
overflowsFHand.write("State, District, Population\n")

lessData = 0
lessDataList = list()
lessDataFHand = open(DISTRICTS_WITH_LESS_DATA, 'w')
lessDataFHand.write("State, District\n")


def calculateHeatFactor(outputs):
    activeValues = outputs["Active"].values
    firstDayActive = int(activeValues[0])
    lastDayActive = int(activeValues[-1])

    heatFactor = (lastDayActive - firstDayActive) * (100 / lastDayActive)
    heatFactor = 0 if heatFactor < 0 else heatFactor
    return heatFactor


def makeSingleDistrictPredictions(districtObject, state, inDir, outDir):
    global wrongDistricts, noPopulationInfo, overflows, lessData

    foundValidInfo = True
    districtName = districtObject["districtName"]
    print("\tDistrict: ", districtName)
    districtPopulation = districtObject["population"]
    print("State", state, ", District: ", districtName,
          ", Population: ", districtPopulation)
    inFile = inDir + "/" + districtName.replace(" ", "-") + ".csv"
    outFile = outDir + "/" + districtName.replace(" ", "-")
    print("OutFile: ", outFile)
    try:
        fhand = open(inFile)
        fhand.close()
    except FileNotFoundError:
        print("\t\t[!!] File \x1b[31m", inFile,
              "\x1b[0m Doesn't exist. Check spellings properly")
        wrongDistrictsList.append(inFile)
        wrongDistricts += 1
        wrongDistrictsFHand.write(inFile + "\n")
        foundValidInfo = False

    try:
        population = int(districtPopulation)
    except TypeError:
        print("\t\t\x1b[32mCouldn't get the population of ",
              districtName, "\x1b[0m\n")
        noPopulationInfoList.append((state, districtName))
        noPopulationInfo += 1
        noPopulationInfoFHand.write(state + ", " + districtName + "\n")
        foundValidInfo = False

    if foundValidInfo:
        try:
            model = SEIRD(inFile, population, outFile)
            outputs = model.final_run()
            # if flag == None:
            #     print("Less than 10 data samples!")
            #     lessData += 1
            #     lessDataList.append((state, districtName))
            #     lessDataFHand.write(state + ", " + districtName + "\n")
        except ZeroDivisionError:
            print(
                "\t\t\x1b[33mSome Error in Code.. ZeroDivisionError Occured!\x1b[0m")
        except OverflowError:
            print("\t\t\tOverFLow")
            overflowsList.append((state, districtName, population))
            overflows += 1
            overflowsFHand.write(
                state + ", " + districtName + ', ' + str(population) + "\n")
        print()


def makeDistrictPredictions(districts, state, inDir, outDir):
    for dist in districts:
        makeSingleDistrictPredictions(dist, state, inDir, outDir)


def makeStatePredictions(state, inDir, outDir):
    districts = district_wise_population[state]["districts"]
    makeDistrictPredictions(districts, state, inDir, outDir)
    totalPopulation = district_wise_population[state]["totalPopulation"]
    totalObject = {"districtName": "total", "population": totalPopulation}
    makeSingleDistrictPredictions(totalObject, state, inDir, outDir)


def makePredictions(state=None, district=None):
    if state == None:
        for state in district_wise_population:
            state_dir = state.replace(" ", "-")
            outDir = PREDICTIONS_DIR + "/" + state_dir
            try:
                os.mkdir(outDir)
            except FileExistsError:
                pass
            inDir = DATASET_DIR + "/" + state_dir
            makeStatePredictions(state, inDir, outDir)
    else:
        state_dir = state.replace(" ", "-")
        outDir = PREDICTIONS_DIR + "/" + state_dir
        try:
            os.mkdir(outDir)
        except FileExistsError:
            pass
        inDir = DATASET_DIR + "/" + state_dir

        # print("State: ", state)
        if district == None:
            # makeStatePredictions(state, inDir, outDir)
            print("All Districts")
            allDistricts = district_wise_population[state]["districts"]
            for districtObject in allDistricts:
                makeSingleDistrictPredictions(
                    districtObject, state, inDir, outDir)
            totalPopulation = district_wise_population[state]["totalPopulation"]
            totalObject = {"districtName": "total",
                           "population": totalPopulation}
            makeSingleDistrictPredictions(totalObject, state, inDir, outDir)
        else:
            allDistricts = district_wise_population[state]["districts"]
            # print("Predicting", state, district)
            if district == "total":
                totalPopulation = district_wise_population[state]["totalPopulation"]
                totalObject = {"districtName": "total",
                               "population": totalPopulation}
                makeSingleDistrictPredictions(
                    totalObject, state, inDir, outDir)
            for districtObject in allDistricts:
                if districtObject["districtName"] == district:
                    print(district, "found")
                    makeSingleDistrictPredictions(
                        districtObject, state, inDir, outDir)
                    break

    # wrongDistrictsFHand.close()
    # noPopulationInfoFHand.close()
    # overflowsFHand.close()
    # lessDataFHand.close()


def evaluateErrors():
    print("\t\t -=-=-= Errors Info =-=-=-")
    print("There are", wrongDistricts,
          "districts that are not found!. Its logs are written to", WRONG_DISTRICT_LOG_FILE)
    print("There are", noPopulationInfo, "districts with no valid population! Check",
          DISTRICTS_WITH_NO_POPULATION_INFO, "for Logs!")
    print("OverFlowError occured while working with some(", overflows,
          ") districts. Check ", DISTRICTS_WITH_OVERFLOW_ERROR, " for Logs!", sep="")
    print("There are", lessData, "Districts with < 10 data samples. Check",
          DISTRICTS_WITH_LESS_DATA, "for Logs!")


makePredictions()
evaluateErrors()
