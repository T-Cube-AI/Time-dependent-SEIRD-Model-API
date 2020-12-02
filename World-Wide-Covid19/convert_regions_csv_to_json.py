#!/usr/bin/python3

import json
import csv

filename = './russia-regions.csv'
csvData = open(filename).readlines()

outfile = './russia-regions.json'

jsonData = list()

with open(filename, 'r') as csvFile:
    csvReader = csv.DictReader(csvFile, )
    for row in csvReader:
        regionObject = dict(row)
        jsonData.append(regionObject)

with open(outfile, 'w') as outHandler:
    outHandler.write(json.dumps(jsonData, indent=4, ensure_ascii=False))
