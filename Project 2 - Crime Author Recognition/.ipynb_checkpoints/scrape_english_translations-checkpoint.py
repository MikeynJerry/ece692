import requests
from bs4 import BeautifulSoup
import json

r = requests.get('http://www.tysto.com/uk-us-spelling-list.html')
soup = BeautifulSoup(r.text, 'html.parser')

uk_table, us_table = soup.find('tr', class_='Body').find_all('td')
uk_table = uk_table.text.replace(' ', '').replace('\n', ' ').split()
us_table = us_table.text.replace(' ', '').replace('\n', ' ').split()

tables = {
    'uk_to_us': {},
    'us_to_uk': {}
}

for uk_word, us_word in zip(uk_table, us_table):
    tables['uk_to_us'][uk_word] = us_word
    tables['us_to_uk'][us_word] = uk_word

with open('translations.json', 'w+') as f:
    json.dump(tables, f)