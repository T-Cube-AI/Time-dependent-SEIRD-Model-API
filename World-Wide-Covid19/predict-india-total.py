#!/usr/bin/python3

from Model import SEIRD

filename = "./Datasets/India/Total.csv"
outfile = "./Predictions/India/Total"
populationOfIndia = 1380722955

model = SEIRD(filename, populationOfIndia, outfile)
model.final_run()
