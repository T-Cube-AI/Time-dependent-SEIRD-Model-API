#!/usr/bin/python3

from Model import SEIRD

infile = "./Datasets/Moscow.csv"
outfile = './Predictions/Moscow'
population = 12692466

model = SEIRD(infile, population, outfile)
errors = model.final_run()
print(errors)
