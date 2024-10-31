#!/usr/bin/env python

import os
import sys
import json

from qdrant_client import QdrantClient
from qdrant_client.http.models import Distance, VectorParams


COLLECTION_NAME = 'yso'
BATCH_SIZE = 64


client = QdrantClient(
    "https://qdrant.ext.kk-test.k8s.it.helsinki.fi",
    api_key=os.getenv("QDRANT_API_KEY"),
    port=443
)

if client.collection_exists(COLLECTION_NAME):
    client.delete_collection(collection_name=COLLECTION_NAME)

client.create_collection(
    collection_name=COLLECTION_NAME,
    vectors_config=VectorParams(size=3072, distance=Distance.DOT),
)

vectors = []
payload = []

print("Reading embeddings from stdin and processing...")

for line in sys.stdin:
    rec = json.loads(line)
    vectors.append(rec['embedding'])
    payload.append({'uri': rec['uri'], 'label': rec['label'], 'label_type': rec['label_type']})

print(f"Got {len(payload)} embeddings. Uploading using batch size {BATCH_SIZE}...")

client.upload_collection(
    collection_name=COLLECTION_NAME,
    vectors=vectors,
    payload=payload,
    parallel=True,
    wait=True,
    batch_size=BATCH_SIZE
)

print("All done.")
