const axios = require('axios');
const cheerio = require('cheerio');

async function fetchTitles(page) {
    const url = `https://www.ilbe.com/list/ilbe?page=${page}&listStyle=list`;

    try {
        // Create a custom Axios instance to disable SSL verification
        const httpsAgent = new (require('https').Agent)({ rejectUnauthorized: false });
        const response = await axios.get(url, { httpsAgent });

        const $ = cheerio.load(response.data);
        const titles = [];
        $('ul.board-body > li').each((_, element) => {
            const titleElement = $(element).find('span.title a.subject');
            const title = titleElement.text().trim();
            const link = titleElement.attr('href');
            if (title && link) {
                titles.push({ title, link: `https://www.ilbe.com${link}` });
            }
        });
        return titles;
    } catch (err) {
        console.error(`Error fetching titles for page ${page}:`, err.message);
        throw err;
    }
}

module.exports = fetchTitles;
