$(function() {
    var loginBox = $('#login');
    var registerBox = $('#registerBox');
    var userInfo = $('#user-info');

    loginBox.find('a').click(function() {
        // 切换到注册页面
        registerBox.show();
        loginBox.hide();
    })

    registerBox.find('a').click(function() {
            // 切换到登陆页面
            loginBox.show();
            registerBox.hide();
        })
        // 注册
    registerBox.find('button').click(function() {
            $.ajax({
                type: 'post',
                url: '/api/user/register',
                data: {
                    username: registerBox.find('[name="username"]').val(),
                    password: registerBox.find('[name="password"]').val(),
                    repassword: registerBox.find('[name="repassword"]').val()
                },
                dataType: 'json',
                success: function(data) {
                    registerBox.find('.register-message').html(data.message);
                    if (!data.code) {
                        // 注册成功
                        setTimeout(function() {
                            loginBox.show();
                            registerBox.hide();
                        }, 1000);
                    }
                }
            })
        })
        // 登陆
    loginBox.find('button').click(function() {
            $.ajax({
                type: 'post',
                url: '/api/user/login',
                data: {
                    username: loginBox.find('[name="username"]').val(),
                    password: loginBox.find('[name="password"]').val()
                },
                dataType: 'json',
                success: function(data) {
                    loginBox.find('.login-message').html(data.message);
                    if (!data.code) {
                        // 注册成功
                        setTimeout(function() {
                            // loginBox.hide();
                            // registerBox.hide();
                            // userInfo.show();
                            // // 显示登陆用户的信息
                            // userInfo.find('.username').html(data.userInfo.username);
                            // userInfo.find('.info').html('你好，欢迎光临我的博客！');
                            window.location.reload();

                        }, 1000);
                    }
                }
            })
        })
        // 退出
    $('.logoutBtn').click(function() {
        $.ajax({
            type: 'get',
            url: '/api/user/logout',
            success: function(data) {
                if (!data.code) {
                    window.location.reload();
                }
            }
        })
    })
})