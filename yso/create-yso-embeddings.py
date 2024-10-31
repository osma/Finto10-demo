#!/usr/bin/env python

import os
import sys
import json
from openai import AzureOpenAI

client = AzureOpenAI(
    api_key=os.getenv("AZURE_OPENAI_API_KEY"),
    api_version="2024-02-01",
    azure_endpoint=os.getenv("AZURE_OPENAI_ENDPOINT")
)

def label_to_embedding(label, uri, label_type):
    response = client.embeddings.create(
        input=label,
        model="text-embedding-3-large",
    )

    vector = response.data[0].embedding
    output = {'uri': uri, 'label': label, 'label_type': label_type, 'embedding': vector}
    json.dump(output, sys.stdout)
    print()


yso = json.load(sys.stdin)

for uri, cdata in yso.items():
    if cdata['type'] == 'http://www.w3.org/2004/02/skos/core#Collection':
        continue

    # preflabel
    label_to_embedding(cdata['label_fi'], uri, 'pref')
    # altlabels
    for altlabel in cdata.get('altlabel_fi', []):
        label_to_embedding(altlabel, uri, 'alt')
