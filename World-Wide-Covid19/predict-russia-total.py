#!/usr/bin/python3

from Model import SEIRD

filename = "./Datasets/Russia/Total.csv"
outfile = "./Predictions/Russia/Total"
populationOfRussia = 146748590

model = SEIRD(filename, populationOfRussia, outfile)
model.final_run()
