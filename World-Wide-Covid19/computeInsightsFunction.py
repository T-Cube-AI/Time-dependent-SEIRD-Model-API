#!/usr/bin/python3


def computeInsights(confrimed, deaths, active=None):
    insights = dict()

    cfr = (deaths / confrimed) * 100
    insights["cfr"] = cfr
    if active != None:
        ifr = (deaths / active) * 100
        insights["ifr"] = ifr

    return insights
