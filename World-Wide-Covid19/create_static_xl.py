#!/usr/bin/python3

import xlsxwriter
import json
import re
import os

PREDICTIONS_DIR = "./Predictions/US"

usStatesPopulationFile = "./US-population.json"
usStatesPopulation = json.load(open(usStatesPopulationFile))
allTimePredictionsFile = "./Predictions/US/allTimePredictions.xlsx"

try:
    os.remove(allTimePredictionsFile)
    print(f"Removed {allTimePredictionsFile}")
except Exception as e:
    print(e)

workbook = xlsxwriter.Workbook(allTimePredictionsFile)
worksheet = workbook.add_worksheet("All Time US Predictions")

worksheet.write(0, 0, "State Name")
row = 1
col = 1
dateHeader = False


def replaceSpecialCharacters(filename):
    filename = re.sub(r'\s+', ' ', filename)
    filename = filename.replace(' ', '-')
    filename = filename.replace('(', '')
    filename = filename.replace('.', '')
    filename = filename.replace(')', '')

    return filename


# print(usStatesPopulation)
for stateObject in usStatesPopulation:
    stateName = stateObject["State"]
    population = stateObject["Pop"]

    filename = replaceSpecialCharacters(stateName)

    outfile = PREDICTIONS_DIR + '/' + filename + "_projections.json"
    try:
        worksheet.write(row, 0, stateName)
        fhand = open(outfile)
        predictions = json.load(fhand)
        for i in range(3):
            weekObj = predictions["overallPredictions"][i][f"Week-{i+1}"]
            weekPredictions = weekObj["predictions"]
            for dayObj in weekPredictions:
                date = dayObj["date"]
                confirmed = dayObj["confirmed"]
                deaths = dayObj["deaths"]
                # print(date, confirmed, deaths)
                if not dateHeader:
                    worksheet.write(0, col, date)
                worksheet.write(row, col, confirmed)
                col += 1
        dateHeader = True
        row += 1
        col = 1
    except Exception as e:
        print(e)

workbook.close()
