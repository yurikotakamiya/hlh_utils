const fetchCommentsFromHtml = require('../services/fetchComments');
const testHtml = require('./fixtures/comment');

// Example HTML string containing comments (replace with your actual HTML)
// const testHtml = `
// <div class="post-comment-wrap">
//     <div class="comment-group" id="comment_wrap_in">
//         <div id="cmt_11560557964" class="comment-item depth0  head_11560557964" data-depth="0" data-head="11560557964">
//             <div class="comment-item-box">
//                 <span class="global-nick nick">
//                     <a href="javascript:;" title="포인트 : 9,541, 잉여력 29%">
//                         <img src="/img/level2/10.png?v=5" alt="">역사는승자의기록
//                     </a>
//                     <em id="cnt_good_str_11560557964">+6</em>
//                 </span>
//                 <span class="date-line">
//                     <strong>2024.12.08</strong> 21:15:59
//                 </span>
//                 <div class="comment ">
//                     <span class="comment-box">
//                         <span class="cmt" style="word-break: break-word;">
//                             눈끝이 저렇게 올라가는 상은 엄청난 부자상임<br><br>저분 부모의 재력도 장난 아닐거다.
//                         </span>
//                     </span>
//                 </div>
//             </div>
//         </div>
//         <div id="cmt_11560559806" class="comment-item reply-item depth1  head_11560557964" data-depth="1" data-head="11560557964" data-image="https://ncache.ilbe.com/files/attach/cmt/20241208/377678/7651329172/11560559799/32dd73e905b6fb9c7c6c37ba426d18bf_11560559798.jpg">
//             <div class="comment-item-box" style="margin-left:15px">
//                 <span class="global-nick nick">
//                     <a href="javascript:;" title="포인트 : 435,515, 잉여력 86%">
//                         <img src="/img/level2/31.png?v=5" alt="">절대쌍교
//                     </a>
//                     <em id="cnt_good_str_11560559806">+10</em>
//                 </span>
//                 <span class="date-line">
//                     <strong>2024.12.08</strong> 21:27:35
//                 </span>
//                 <div class="comment ">
//                     <span class="comment-image-box">
//                         <span>
//                             <img class="comment-image img-portrait" src="https://ncache.ilbe.com/files/attach/cmt/20241208/377678/7651329172/11560559799/32dd73e905b6fb9c7c6c37ba426d18bf_11560559798.jpg">
//                         </span>
//                     </span>
//                     <span class="comment-box">
//                         <span style="color:rgb(150, 170, 102); margin-right:6px;">@역사는승자의기록</span>
//                     </span>
//                 </div>
//             </div>
//         </div>
//     </div>
// </div>
// `;

// Simulate test for the fetchCommentsFromHtml function
function testFetchComments() {
    console.log('Running test for fetchCommentsFromHtml...');
    const postId = '11560557964'; // Example post ID
    const date = '2024-12-08'; // Example date

    // Call the function with the test HTML
    fetchCommentsFromHtml(testHtml, postId, date);

    console.log(`Test completed. Check the /data/ilbe-comments/${date} directory for results.`);
}

testFetchComments();

