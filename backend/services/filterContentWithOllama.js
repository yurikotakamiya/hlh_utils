const axios = require('axios');

async function filterContentWithOllama(content, keywords) {
    const prompt = `
You are a relevance classifier for the following topics: ${keywords.join(', ')}.
Determine if the following content is relevant to any of these topics:
---
${content}
---
Respond with "relevant" or "not relevant".
    `;

    try {
        const response = await axios.post(
            'http://ollama:11434/api/generate',
            {
                model: 'llama3.2:1b',
                prompt: prompt,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                },
                responseType: 'stream', // Handle streamed response
            }
        );

        let fullResponse = '';
        response.data.on('data', (chunk) => {
            const data = JSON.parse(chunk.toString());
            if (data.response) {
                fullResponse += data.response;
            }
        });

        return new Promise((resolve, reject) => {
            response.data.on('end', () => {
                resolve(fullResponse.trim().toLowerCase() === 'relevant');
            });
            response.data.on('error', (err) => {
                console.error('Error while streaming response from Ollama:', err.message);
                reject(new Error('Failed to filter content'));
            });
        });
    } catch (err) {
        console.error('Error filtering content with Ollama:', err.message);
        throw new Error('Failed to filter content');
    }
}

module.exports = filterContentWithOllama;
