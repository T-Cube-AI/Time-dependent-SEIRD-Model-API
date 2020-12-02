import os

parent = './Datasets/India/'
for state in os.listdir(parent):
    try:
        stateDir = os.path.join(parent, state)
        os.listdir(stateDir)
    except Exception as e:
        print(e)
        continue
    for district in os.listdir(stateDir):
        districtFile = os.path.join(stateDir, district)
        print(districtFile)

        fileData = open(districtFile).readlines()
        length = len(fileData)
        i = 0
        while i < length - 1:
            currentLine = fileData[i]
            nextLine = fileData[i+1]

            currentDate = currentLine.split(',')[1].strip()
            nextDate = nextLine.split(',')[1].strip()

            if currentDate == nextDate:
                fileData.pop(i)
                length -= 1
            fhandler = open(districtFile, 'w')
            fhandler.writelines(fileData)
            fhandler.close()

            i += 1
