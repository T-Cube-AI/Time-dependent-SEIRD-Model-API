#!/usr/bin/python3

import requests

API_URL = "https://api.covid19api.com/dayone/country/russia"

HEADER_LINE = "Day,Date,Confirmed,Recovered,Deaths\n"
filename = "./Datasets/Russia/Total.csv"
fHandler = open(filename, "w")
fHandler.write(HEADER_LINE)


def modifyDate(dateString):
    return dateString.split('T')[0]


def getData():
    response = requests.get(API_URL)
    jsonData = response.json()

    return jsonData


jsonData = getData()
startDate = "2020-04-01"
startDateFound = False

for dayObject in jsonData:
    date = dayObject["Date"]
    date = modifyDate(date)
    if date == startDate:
        startDateFound = True
    if not startDateFound:
        continue
    confirmedCases = dayObject["Confirmed"]
    recoveredCases = dayObject["Recovered"]
    deaths = dayObject["Deaths"]
    itemsToWrite = ["0", date, confirmedCases,
                    recoveredCases, str(deaths) + "\n"]
    lineToWrite = ', '.join(list(map(str, itemsToWrite)))
    fHandler.write(lineToWrite)

fHandler.close()
