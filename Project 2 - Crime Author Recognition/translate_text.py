import json

with open('translations.json', 'r') as f:
    tables = json.load(f)


def translate(text, country):
    country = country.lower()
    if country not in ['us', 'uk']:
        raise ValueError("`country` must be one of ['us', 'uk']")

    conversion = 'us_to_uk' if country == 'uk' else 'uk_to_us'
    for source, target in tables[conversion].items():
        text = text.replace(source, target)

    return text
