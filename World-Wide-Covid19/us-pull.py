#!/usr/bin/python3

import requests
import json
import re

US_URL = "https://covidtracking.com/api/states/daily"
DatasetsDir = './Datasets/US'
statesCodesFile = "./us-codes-to-states.json"

codesAndStatesMap = dict()
filenameToHandlerMap = dict()
stateCodeToDataMap = dict()
doneWithStateData = dict()


def replaceSpecialCharacters(filename):
    filename = re.sub(r'\s+', ' ', filename)
    filename = filename.replace(' ', '-')
    filename = filename.replace('(', '')
    filename = filename.replace('.', '')
    filename = filename.replace(')', '')

    return filename


def prepareCodeAndStates():
    fhandle = open(statesCodesFile)
    codesAndStatesMap = json.load(fhandle)
    headerLine = "Day,Date,Confirmed,Recovered,Deaths\n"

    for stateCode in codesAndStatesMap:
        stateName = codesAndStatesMap[stateCode]
        filename = replaceSpecialCharacters(stateName)
        filename = DatasetsDir + '/' + filename + '.csv'
        fileHandler = open(filename, 'w')
        fileHandler.write(headerLine)
        filenameToHandlerMap[stateCode] = fileHandler
        stateCodeToDataMap[stateCode] = list()
        doneWithStateData[stateCode] = False


def modifyData(date):
    date = str(date)
    i = 0
    newDate = ""
    for char in date:
        newDate += char
        i += 1
        if i == 4 or i == 6:
            newDate += '-'

    return newDate


def anyElement(arr, function):
    for element in arr:
        if function(element):
            return True
    return False


prepareCodeAndStates()
response = requests.get(US_URL)
jsonData = response.json()
# print(jsonData)
print("Fetching Done!")

day = 0
prevDate = None
for stateObject in jsonData:
    stateCode = stateObject["state"]
    date = stateObject["date"]
    date = modifyData(date)
    if prevDate == None or prevDate != date:
        day += 1

    confirmedCases = stateObject["positive"]
    recoveredCases = stateObject["recovered"]
    deaths = stateObject["death"]

    fhandle = filenameToHandlerMap[stateCode]
    itemsToWrite = [day, date, confirmedCases, recoveredCases, deaths]
    if (not doneWithStateData[stateCode]) and (not anyElement(itemsToWrite, lambda x: x == None)):
        lineToWrite = ', '.join(list(map(str, itemsToWrite)))
        lineToWrite += "\n"
        stateCodeToDataMap[stateCode].insert(0, lineToWrite)
    else:
        doneWithStateData[stateCode] = True
    prevDate = date

print("Data prepared!")

for stateCode in filenameToHandlerMap:
    fileHandler = filenameToHandlerMap[stateCode]
    linesToWrite = stateCodeToDataMap[stateCode]
    fileHandler.writelines(linesToWrite)
    fileHandler.close()
print("Data written!")
