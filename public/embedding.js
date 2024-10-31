async function getEmbedding(text) {

  try {
    // Set up the fetch options
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': azureApiKey,
      },
      body: JSON.stringify({
        input: text,
      }),
    };

    const response = await fetch(azureEndpoint + "openai/deployments/" + embeddingModel + "/embeddings?api-version=2024-06-01", options);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result.data[0].embedding;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}


async function searchNearbyVectors(embeddingVector, limit = 20) {
  try {
    const response = await fetch(qdrantEndpoint + '/collections/' + collectionName + '/points/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': qdrantApiKey,
      },
      body: JSON.stringify({
        vector: embeddingVector,
        params: {
          hnsw_ef: 128,
          exact: false,
        },
        limit: limit,
        with_payload: true
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.result;
  } catch (error) {
    console.error('Error searching nearby vectors:', error);
    throw error;
  }
}
