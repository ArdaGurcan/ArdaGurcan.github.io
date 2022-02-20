from bs4 import BeautifulSoup
import requests

f = open("./dictionary.txt", "r")
tr = open("./tr_50k.txt", "r")
# get URL
# page = requests.get("https://en.wiktionary.org/wiki/Wiktionary:Frequency_lists/Turkish_WordList_40K")
 
# scrape webpage
# soup = BeautifulSoup(page.content, 'html.parser')
 
# display scrapped data
# words = soup.find_all("span", attrs={"lang":"tr"})
dictionary = f.read()
words = tr.readlines()
words = [k.split(" ")[0] for k in words]
print(words[:50])
fiveLettered = []

for word in words:
    try:
        word = word.replace('î', 'i').replace('â', 'a').replace('û', 'u').replace('i', 'İ').replace('ı','I').upper()
    except:
        print(word)
    if len(word) == 5 and word in dictionary:
        fiveLettered.append(word)
print(len(fiveLettered))
print(fiveLettered)
c = open("./common.txt", "w")

for w in fiveLettered:
    c.write(w+"\n")
c.close()
