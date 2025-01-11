const axios = require('axios');

/**
 * Send a prompt to the Ollama API and handle streamed responses.
 * @param {string} prompt - The prompt to send to Ollama.
 * @param {string} model - The model to use (e.g., 'llama3.2:1b').
 * @returns {Promise<string>} - The full response from Ollama.
 */
async function youtubeTranscribeWithOllama(prompt, model = 'llama3.2:1b') {
    try {
        const response = await axios.post(
            'http://ollama:11434/api/generate',
            { model, prompt },
            {
                headers: { 'Content-Type': 'application/json' },
                responseType: 'stream',
            }
        );

        let fullResponse = '';
        const chunks = [];

        return new Promise((resolve, reject) => {
            response.data.on('data', (chunk) => {
                try {
                    chunks.push(chunk.toString());
                } catch (err) {
                    console.error('Error processing chunk:', chunk.toString());
                }
            });

            response.data.on('end', () => {
                try {
                    const completeResponse = chunks.join('');
                    const lines = completeResponse.split('\n');
                    for (const line of lines) {
                        if (line.trim()) {
                            const data = JSON.parse(line); // Parse each JSON line
                            if (data.response) {
                                fullResponse += data.response;
                            }
                        }
                    }
                    resolve(fullResponse.trim());
                } catch (err) {
                    console.error('Error parsing complete response:', err.message);
                    reject(new Error('Failed to parse Ollama response'));
                }
            });

            response.data.on('error', (err) => {
                console.error('Error while streaming response from Ollama:', err.message);
                reject(new Error('Failed to stream response'));
            });
        });
    } catch (err) {
        console.error('Error communicating with Ollama:', err.message);
        throw new Error('Failed to communicate with Ollama');
    }
}

module.exports = youtubeTranscribeWithOllama;
