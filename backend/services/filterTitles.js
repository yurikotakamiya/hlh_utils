const keywords = ['금리', '코인', '건강', '금융', '시장', '19', 'manhwa', '인공지능', '개발'];

function filterTitles(titles) {
    return titles.filter((post) =>
        keywords.some((keyword) => post.title.includes(keyword))
    );
}

module.exports = filterTitles;
