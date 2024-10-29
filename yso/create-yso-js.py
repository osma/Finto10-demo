#!/usr/bin/env python

import sys
import json
from collections import defaultdict

YSO_JSON_FILE = 'yso.json'
YSO_LANG_FILES = {
    'et': 'yso-et.tsv',
    'zh': 'yso-zh.tsv'
}

with open(YSO_JSON_FILE) as ysojson:
    yso_in = json.load(ysojson)

translations = defaultdict(dict)

for lang, fname in YSO_LANG_FILES.items():
    with open(fname) as tsvf:
        for line in tsvf:
            if line.strip() == '':
                continue
            uri, term = line.strip().split('\t')
            translations[uri][lang] = term

yso_out = {}

for uri, cdata in yso_in.items():
    for lang, term in translations[uri].items():
        cdata[f"label_{lang}"] = term
    yso_out[uri] = cdata

print("const yso = ", end='')
json.dump(yso_out, sys.stdout)
