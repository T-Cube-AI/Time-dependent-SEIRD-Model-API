#!/usr/bin/python3

import requests


def getNextDate(currentDate):
    year, month, day = currentDate.split('-')
    month = int(month)
    day = int(day)

    if (year % 400 == 0):
        leap_year = True
    elif (year % 100 == 0):
        leap_year = False
    elif (year % 4 == 0):
        leap_year = True
    else:
        leap_year = False

    if month in (1, 3, 5, 7, 8, 10, 12):
        month_length = 31
    elif month == 2:
        if leap_year:
            month_length = 29
        else:
            month_length = 28
    else:
        month_length = 30

    if day < month_length:
        day += 1
    else:
        day = 1
        if month == 12:
            month = 1
            year += 1
        else:
            month += 1

    return "-".join([year, str(month), str(day)])


def getAPIUrl(date):
    return "https://raw.githubusercontent.com/covid19india/api/gh-pages/v4/data-" + date + ".json"


def getData(url):
    response = requests.get(url)
    jsonData = response.json()
    return jsonData
