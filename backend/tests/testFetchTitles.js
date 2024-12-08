const fetchTitles = require('../services/fetchTitles');

(async () => {
    const PAGE_TO_FETCH = 1; // Change this to test other pages
    try {
        console.log(`Fetching titles from page ${PAGE_TO_FETCH}...`);
        const titles = await fetchTitles(PAGE_TO_FETCH);
        console.log('Fetched Titles:', titles);

        if (titles.length === 0) {
            console.log('No titles were fetched. Check the website structure or connection.');
        } else {
            console.log(`Successfully fetched ${titles.length} titles.`);
        }
    } catch (err) {
        console.error('Error fetching titles:', err.message);
    }
})();
