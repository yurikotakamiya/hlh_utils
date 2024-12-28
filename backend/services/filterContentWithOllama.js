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
        const chunks = [];

        return new Promise((resolve, reject) => {
            response.data.on('data', (chunk) => {
                try {
                    chunks.push(chunk.toString()); // Collect chunks
                } catch (err) {
                    console.error('Error processing chunk:', chunk.toString());
                }
            });

            response.data.on('end', () => {
                try {
                    const completeResponse = chunks.join(''); // Combine all chunks
                    const lines = completeResponse.split('\n'); // Split into lines
                    for (const line of lines) {
                        if (line.trim()) {
                            const data = JSON.parse(line); // Parse each JSON line
                            if (data.response) {
                                fullResponse += data.response; // Append the response
                            }
                        }
                    }
                    resolve(fullResponse.trim().toLowerCase() === 'relevant');
                } catch (err) {
                    console.error('Error parsing complete response:', err.message);
                    reject(new Error('Failed to parse Ollama response'));
                }
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
