#!/usr/bin/python3

import requests
import json
import re

RUSSIA_URL = "http://covid19.bvn13.com/stats/all"
DatasetsDir = './Datasets/Russia'
regions_filename = "./russia-regions.json"

russia_regions_mapping = None  # I'll assign later.
fileToHandlerMap = dict()


def getData():
    response = requests.get(RUSSIA_URL)
    jsonData = response.json()

    return jsonData


def mapRussianNameToEnglish(russinaName):
    for regionObject in russia_regions_mapping:
        if regionObject["Region"] == russinaName:
            return regionObject["Region_eng"]


def prepareRussiaRegions():
    global russia_regions_mapping
    with open(regions_filename) as regionsHandler:
        russia_regions_mapping = json.load(regionsHandler)


def replaceSpecialCharacters(filename):
    filename = re.sub(r'\s+', ' ', filename)
    filename = filename.replace(' ', '-')
    filename = filename.replace('(', '')
    filename = filename.replace('.', '')
    filename = filename.replace(')', '')

    return filename


def prepareFileHandlers():
    headerLine = "Day,Date,Confirmed,Recovered,Deaths\n"
    global russia_regions_mapping
    for regionObject in russia_regions_mapping:
        regionName = regionObject["Region_eng"]
        filename = replaceSpecialCharacters(regionName)
        filename += ".csv"
        fileHandler = open(DatasetsDir + '/' + filename, 'w')
        fileHandler.write(headerLine)
        fileToHandlerMap[regionName] = fileHandler


prepareRussiaRegions()
prepareFileHandlers()
# print(russia_regions_mapping)

jsonData = getData()
regionsInRussian = jsonData["regions"]
progress = jsonData["progress"]
# print(regionsInRussian)
day = 0
startDate = "2020-05-05"
foundStartDate = False
prevDate = None
for dayObject in progress:
    datetime = dayObject["datetime"]
    date = datetime.split("T")[0]

    if prevDate != None and prevDate == date:
        continue
    prevDate = date

    if date == startDate:
        foundStartDate = True

    if not foundStartDate:
        continue

    # print(date)
    timeSeries = dayObject["stats"]

    day += 1
    for regionObject in timeSeries:
        previousDay = regionObject["previous"]
        russianRegion = regionObject["region"]
        englishRegion = mapRussianNameToEnglish(russianRegion)
        if englishRegion == None:
            continue

        activeCases = regionObject["sick"] + previousDay['sick']
        recoveredCases = regionObject["healed"] + previousDay['healed']
        deaths = regionObject["died"] + previousDay['died']
        # print("\t", russianRegion, englishRegion, activeCases, recoveredCases, deaths)
        fileHandler = fileToHandlerMap[englishRegion]
        thingsToBeWritten = [day, date, activeCases, recoveredCases, deaths]
        line = ', '.join(list(map(str, thingsToBeWritten)))
        fileHandler.write(line + '\n')
