var perpage = 2;


$('#messageBtn').click(function() {
    $.ajax({
        type: 'POST',
        url: '/api/comment/post',
        data: {
            contentid: $('#contentId').val(),
            content: $('#messageContent').val()
        },
        success: function(res) {
            console.log(res.data)
            $('#messageContent').val('');
            renderComment(res.data.comments.reverse())

        }
    })
})

function renderComment(comments) {
    $('.messageCount').html(comments.length)
    var html = ''
    for (var i = 0; i < comments.length; i++) {
        html += '<div class="messageBox clearfix"> ' + '<p class="name clearfix"><span class="fl">' + comments[i].username + '</span><span class="fr">' + formatDate(comments[i].postTime) + '</span></p><p class="comment_content">' + comments[i].content + '</p>' + '</div>'
    }
    console.log(html)
    $('.messageList').html(html)
}
// 每次页面重载时获取所有评论
$.ajax({
    type: 'GET',
    url: '/api/comment',
    data: {
        contentid: $('#contentId').val()
    },
    success: function(res) {
        console.log(res.data)
        $('#messageContent').val('');
        renderComment(res.data.reverse())

    }
})

function formatDate(d) {
    var date1 = new Date(d);
    return date1.getFullYear() + '年' + (date1.getMonth() + 1) + '月' + date1.getDate() + '日' + date1.getHours() + ':' + date1.getMinutes() + ':' + date1.getSeconds();
}