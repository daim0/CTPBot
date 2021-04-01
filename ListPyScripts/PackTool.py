replacement = open("./ListPyScripts/List.txt", "r+")
copy = open("./List.json", "r+")
check = False
write = False
missing = False
existing = False

for line in replacement:
    text = line.split()
    i=0
    for word in text:  
        if check == True:
            check = False
            filename = word.split('"')
            try:
                f = open(f"./CalamityTexturePack/Content/Images/{filename[1]}.png")
                existing = True
            except Exception:
                missing = True                        
        
        if write == True:
            if missing == True:
                missing = False
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