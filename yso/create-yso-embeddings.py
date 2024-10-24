#!/usr/bin/env python

import os
import sys
import json
from openai import AzureOpenAI

client = AzureOpenAI(
    api_key=os.getenv("AZURE_OPENAI_API_KEY"),
    api_version="2024-02-01",
    azure_endpoint="https://kk-demo.openai.azure.com/",
)

def cdata_to_text(cdata):
    preflabel = cdata['label_fi']
    altlabels = ', '.join(cdata.get('altlabel_fi', []))
    if altlabels:
        return f"{preflabel}; {altlabels}"
    else:
        return preflabel


yso = json.load(sys.stdin)

for uri, cdata in yso.items():
    if cdata['type'] == 'http://www.w3.org/2004/02/skos/core#Collection':
        continue
    text = cdata_to_text(cdata)

    response = client.embeddings.create(
        input=text,
        model="text-embedding-3-large",
    )

    vector = response.data[0].embedding
    output = {'uri': uri, 'label': text, 'embedding': vector}
    json.dump(output, sys.stdout)
    print()
