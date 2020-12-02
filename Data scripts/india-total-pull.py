#!/usr/bin/python3

import requests

API_URL = "https://api.covid19india.org/data.json"

HEADER_LINE = "Day,Date,Confirmed,Recovered,Deaths\n"
filename = "/home/opc/World-Wide-API/Datasets/India/Total.csv"
fHandler = open(filename, "w")
fHandler.write(HEADER_LINE)

monthToIndexMap = {
    "January": "01",
    "February": "02",
    "March": "03",
    "April": "04",
    "May": "05",
    "June": "06",
    "July": "07",
    "August": "08",
    "September": "09",
    "October": "10",
    "November": "11",
    "December": "12"
}


def modifyDate(dateString):
    date, month = dateString.split()
    monthIndex = monthToIndexMap[month]
    newDate = "2020-" + str(monthIndex) + "-" + date

    return newDate


def getData():
    response = requests.get(API_URL)
    jsonData = response.json()

    return jsonData


jsonData = getData()
timeSeries = jsonData["cases_time_series"]

for dayObject in timeSeries:
    date = dayObject["date"]
    date = modifyDate(date)
    confirmedCases = dayObject["totalconfirmed"]
    recoveredCases = dayObject["totalrecovered"]
    deaths = dayObject["totaldeceased"]
    fHandler.write(', '.join(
        ["0", date, confirmedCases, recoveredCases, deaths + "\n"]))

fHandler.close()
