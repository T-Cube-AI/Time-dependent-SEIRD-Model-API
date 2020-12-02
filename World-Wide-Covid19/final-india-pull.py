#!/usr/bin/python3

import requests
import json
import os
import datetime

PARENT_DIR = "./Datasets/India"
HEADER_STRING = "Day,Date,Confirmed,Recovered,Deaths\n"


def modifyDate(date_str):
    # date_string 14-Mar-20
    # output: 2020-04-14
    months = {
        "Jan": '01',
        "Feb": '02',
        "Mar": '03',
        "Apr": '04',
        "May": '05',
        "Jun": '06',
        "Jul": '07',
        "Aug": '08',
        "Sep": '09',
        "Oct": '10',
        "Nov": '11',
        "Dec": '12'
    }
    date, month, year = date_str.split('-')

    year += '20'
    new_date = "-".join([year, months[month], date])
    return new_date


def parseCasesInfo(casesInfo):
    try:
        confirmed = casesInfo["confirmed"]
    except:
        confirmed = 0
    try:
        recovered = casesInfo["recovered"]
    except:
        recovered = 0
    try:
        deaths = casesInfo["deceased"]
    except:
        deaths = 0

    return confirmed, recovered, deaths


def stateCodes():
    API_URL = "https://api.covid19india.org/state_district_wise.json"

    filename = "state_codes.json"

    response = requests.get(API_URL)
    states = response.json()

    state_codes = dict()
    for state in states:
        # name = state.replace(' ', '-')
        code = states[state]['statecode']
        state_codes[code.lower()] = state

    fhand = open(filename, 'w')
    json.dump(state_codes, fhand)
    fhand.close()


def statesData():
    STATE_API_URL = "https://api.covid19india.org/states_daily.json"
    codes_file = "./state_codes.json"
    fhand = open(codes_file)

    all_states = dict()

    state_codes = json.load(fhand)
    fhand.close()

    for code in state_codes:
        state_name = state_codes[code]
        all_states[state_name] = list()

    response = requests.get(STATE_API_URL)
    data = response.json()

    states_info = data["states_daily"]

    for day_data in states_info:
        date = day_data['date']
        status = day_data['status']
        for key in day_data:
            if key in ["date", "status", "dd", "tt"]:
                continue

            state_name = state_codes[key]
            if status == "Confirmed":
                all_states[state_name].append(dict())

            new_date = modifyDate(date)
            all_states[state_name][-1]["Date"] = new_date
            try:
                previous = all_states[state_name][-2][status]
            except:
                previous = 0
            try:
                current = int(day_data[key])
            except:
                current = 0
            all_states[state_name][-1][status] = (current + previous)

    # print(all_states)

    json_states_file = "all_states_time_series.json"
    fhand = open(json_states_file, 'w')

    json.dump(all_states, fhand)
    fhand.close()

    fhand = open(json_states_file)
    data = json.load(fhand)
    day = 1
    for state in data:
        dir_name = state.replace(' ', '-')
        filename = dir_name + "/total.csv"
        try:
            os.mkdir(PARENT_DIR + '/' + dir_name)
        except FileExistsError:
            pass
        except Exception as e:
            print(e, "occured while creating ", PARENT_DIR + '/' + dir_name)
        filename = PARENT_DIR + '/' + filename
        fhand = open(filename, 'w')
        fhand.write(HEADER_STRING)

        for info in data[state]:
            date = info["Date"]
            recovered = info["Recovered"]
            confirmed = info["Confirmed"]
            deaths = info["Deceased"]

            line = ', '.join(
                list(map(str, [day, date, confirmed, recovered, deaths])))
            line += '\n'
            fhand.write(line)
            day += 1
        fhand.close()


def districtsData():
    DISTRICT_API_URL = "https://raw.githubusercontent.com/covid19india/api/gh-pages/v4/data-all.json"
    startDate = "2020-04-21"
    codes_file = "./state_codes.json"
    fhand = open(codes_file)

    state_codes = json.load(fhand)
    fhand.close()

    response = requests.get(DISTRICT_API_URL)
    jsonData = response.json()

    filenameToDataMap = dict()

    startDateFound = False
    for date in jsonData:
        if startDate == date:
            startDateFound = True
        if startDateFound:
            print(date)
            dayData = jsonData[date]
            for stateCode in dayData:
                if stateCode in ["TT", "tt"]:
                    continue
                stateName = state_codes[stateCode.lower()]
                print("\t", stateName)
                dir_name = stateName.replace(' ', '-')
                try:
                    os.mkdir(PARENT_DIR + '/' + dir_name)
                except FileExistsError:
                    # print("Dir Exists")
                    pass
                except Exception as e:
                    print(e, "occured while creating ",
                          PARENT_DIR + '/' + dir_name, "directory")
                    quit()

                # print(stateName, stateCode, dayData[stateCode])
                if "districts" not in dayData[stateCode]:
                    print(
                        f"\x1b[37mDistricts Data on {date} not available for {stateName}\x1b[0m")
                    continue
                districtsInfo = dayData[stateCode]["districts"]
                for district in districtsInfo:
                    print("\t\t", district)
                    if "total" not in districtsInfo[district]:
                        print(
                            f"Cases info for {stateName} => {district} on {date} isn't available")
                        continue
                    casesInfo = districtsInfo[district]["total"]
                    confirmed, recovered, deaths = parseCasesInfo(casesInfo)
                    itemsToWrite = [0, date, confirmed, recovered, deaths]
                    lineToWrite = ', '.join(list(map(str, itemsToWrite)))
                    print("\t\t\t", lineToWrite)

                    filename = district
                    filename = filename.replace('*', '')
                    filename = filename.replace(' ', '-')
                    filename = dir_name + '/' + filename
                    filename = PARENT_DIR + '/' + filename + ".csv"

                    if filename not in filenameToDataMap:
                        filenameToDataMap[filename] = [lineToWrite + '\n']
                    else:
                        filenameToDataMap[filename].append(lineToWrite + '\n')

    for filename in filenameToDataMap:
        data = filenameToDataMap[filename]
        lastLine = data[-1]
        lastDate = lastLine.split(', ')[1].strip()
        today = str(datetime.datetime.today()).split()[0]
        print(lastDate, today)
        if lastDate == today:
            data.pop()
        fhand = open(filename, 'w')
        fhand.write(HEADER_STRING)
        fhand.writelines(data)


def retrieve():
    stateCodes()
    statesData()
    districtsData()


retrieve()
