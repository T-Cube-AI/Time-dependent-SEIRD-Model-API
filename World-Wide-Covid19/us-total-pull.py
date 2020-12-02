#!/usr/bin/python3

import requests

API_URL = "https://covidtracking.com/api/v1/us/daily.json"
USTotalFile = "./Datasets/US/Total.csv"
fhand = open(USTotalFile, 'w')
fhand.write("Day,Date,Confirmed,Recovered,Deaths\n")
USData = list()


def getData():
    response = requests.get(API_URL)
    jsonData = response.json()
    return jsonData


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


jsonData = getData()
for dayObj in jsonData:
    date = dayObj["date"]
    date = modifyData(dayObj["date"])
    confirmedCases = dayObj["positive"]
    recoveredCases = dayObj["recovered"]
    deaths = dayObj["death"]

    itemsToWrite = [0, date, confirmedCases, recoveredCases, deaths]
    if anyElement(itemsToWrite, lambda x: x == None):
        break
    lineToWrite = ', '.join(list(map(str, itemsToWrite))) + '\n'
    USData.insert(0, lineToWrite)
fhand.writelines(USData)
fhand.close()
