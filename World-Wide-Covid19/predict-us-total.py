#!/usr/bin/python3

from US_Model import SEIRD

filename = "./Datasets/US/Total.csv"
outfile = "./Predictions/US/Total"
populationOfUS = 329340000

model = SEIRD(filename, populationOfUS, outfile)
model.final_run()
