        // 登陆
        $(document).ready(function() {
            var registerBox = $('#login_cont');
            $('.btn').click(function() {
                $.ajax({
                    type: 'post',
                    url: '/api/user/login',
                    data: {
                        username: registerBox.find('[name="username"]').val(),
                        password: registerBox.find('[name="password"]').val()
                    },
                    dataType: 'json',
                    success: function(data) {
                        console.log(data)
                        if (!data.code) {
                            // 注册成功
                            setTimeout(function() {
                                if (data.userInfo.username == 'admin') {
                                    location.href = '/admin';
                                } else {
                                    $('.warning').text('用户名错误！')
                                }
                            }, 1000);
                        }
                    }
                })
            })
        })