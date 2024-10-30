async function chatLLM(prompt) {
    try {
        const response = await fetch(azureEndpoint + "openai/deployments/" + chatModel + "/chat/completions?api-version=2024-06-01", {
            method: 'POST',
            headers: {
                'api-key': azureApiKey,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: chatModel,
                messages: [{ role: 'user', content: prompt }],
                max_tokens: 150,
                temperature: 0.7,
                top_p: 1,
                stream: false
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data.choices[0].message.content;
    } catch (error) {
        console.error('There was a problem with the Azure OpenAI API call:', error);
        alert('An error occurred while processing your request.');
    }
}

const INTENT_PROMPT = `Your task is to classify the user intent into categories and for some categories, extract the relevant keyword, with the category and keyword separated by a colon. The user input is usually in Finnish. The categories are show, search, suggest, home and unknown. You should respond only with the string category:keyword, no explanations.

Example input for the show category:
- näytä käsite ilmastonmuutos
- näytä ilmastonmuutos
- avaa ilmastonmuutos
- onko ilmastonmuutos sanastossa

Output for these inputs should be:
show:ilmastonmuutos

Example input for the search category:
- hae aasialaiset kulttuurit
- hae hakusanalla aasialaiset kulttuurit
- etsi aasialaiset kulttuurit

Output for these inputs should be:
search:aasialaiset kulttuurit

Example input for the suggest category:
- ehdotan uutta käsitettä perustulo
- ehdotan käsitettä perustulo
- ehdotan että lisätään perustulo

Output for these inputs should be:
suggest:perustulo

Example input for the home category:
- mene etusivulle
- näytä etusivu
- mene alkuun

Output for these inputs should be:
home

For any input that doesn't match any of the above categories, the output should be:
unknown

Now classify the following input:
`;

async function parseIntent(input) {
    const prompt = INTENT_PROMPT + input;
    const response = await chatLLM(prompt);
    console.log(response);

    if (!response.includes(":")) {
        // If there's no colon, return an object with only the action
        return {
            action: response.trim()
        };
    } else {
        // If there's a colon, proceed with the original logic
        const [action, keyword] = response.split(':');

        return {
            action: action.trim(),
            keyword: keyword.trim()
        };
    }
}
