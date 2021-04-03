replacement = open("./ListPyScripts/List.txt", "r+")
copy = open("./List.json", "r+")
check = False
write = False
existing = False
directories = ["","Content/Images/","Content/Images/Armor/","Content/Images/Backgrounds/","Content/Images/Misc/","Content/Images/Misc/TileOutlines/","Content/Images/Misc/VortexSky/","Content/Images/TownNPCs/","Content/Images/UI/","Content/Images/UI/Bestiary/","Content/Images/UI/CharCreation/","Content/Images/UI/Creative/","Content/Images/UI/MiniMap/","Content/Images/UI/MiniMap/Retro/","Content/Images/UI/WorldGen/"]

for line in replacement:
    text = line.split()
    i=0
    for word in text:  
        if check == True:
            check = False
            filename = word.split('"')
            for directory in directories:
                try:
                    f = open(f"./CalamityTexturePack/{directory}{filename[1]}.png")
                    existing = True
                except Exception:
                    pass

        if write == True:
            if existing == False:
                word = "false"

            if existing == True:
                existing = False
                word = "true"                
            write = False

        if word == '"FileName":':
            check = True
                
        if word == '"Sprited":':
            write = True
                
        if i == 0:
            for j in range(line.find(word)):
                copy.write(" ")
            copy.write(str(word) + " ")
        else:
            copy.write(str(word))
        i+=1
    copy.write("\n")
copy.close