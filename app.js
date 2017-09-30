// 应用程序的启动（入口）文件
// 加载express模块
var express = require('express');
// 加载模板
var swig = require('swig');
// 加载数据库模块
var mongoose = require('mongoose');
// 加载body-parser 用来处理post提交过来的数据
var bodyParser = require('body-parser');
// 创建app应用 <==> NodeJs http.createServer()
// 加载cookies模块
var Cookies = require('cookies');
var app = express();

var User = require('./models/User')

// 设置静态文件托管
// 当用户访问的url以/public开始，那么直接返回对应 __dirname + '/public' 下的文件
app.use('/public', express.static(__dirname + '/public'));

// 配置应用模板
// 定义当前应用所使用的模板引擎
// 第一个参数：模板引擎的名称
// 第二个参数：用于解析处理模板内容的方法
app.engine('html', swig.renderFile);
// 设置模板文件存放的目录
// 第一个参数：第一个参数必须是views
// 第二个参数：路径
app.set('views', './views');
// 注册所使用的模板引擎
// 第一个参数必须是view engine
// 第二个参数和app.engine这个方法中定义的模板引擎的名称（第一个参数）是一致
app.set('view engine', 'html');
// 在开发过程中，需要取消模板缓存
swig.setDefaults({
    cache: false
});


// 首页
// 可以有多个函数
// req request对象 保存客户端请求相关的一些数据
// res response对象 服务端输出对象  提供一些服务器输出相关的一些方法
// next 函数 用于执行下一个和路径匹配的函数
// res.send()  发送内容到客户端
/*
app.get('/', function(req, res, next) {
    // res.send('<h1>欢迎我的博客</h1>')
    // 读取views目录下的指定文件，解析并返回给客户端
    // 第一个参数：表示参数的文件，相对于views目录  views/index.html
    // 第二个参数：传递给模板使用的数据
    res.render('index');
})
*/

// bodyParser设置
app.use(bodyParser.urlencoded({
    extended: true
}));

// 设置cookie
app.use(function(req, res, next) {
    req.cookies = new Cookies(req, res);
    req.userInfo = {};

    // 解析登陆用户的cookie信息
    if (req.cookies.get('userInfo')) {
        try {
            req.userInfo = JSON.parse(req.cookies.get('userInfo'));
            // 获取当前登录用户的类型，是否为管理员
            User.findById(req.userInfo._id).then(function(userInfo) {
                req.userInfo.isAdmin = Boolean(userInfo.isAdmin);
                next();
            })
        } catch (e) {
            next();
        }
    } else {
        next();
    }
})


// 根据不同的功能划分模块

app.use('/admin', require('./routers/admin'));
app.use('/api', require('./routers/api'));
app.use('/', require('./routers/main'));

// 链接数据库
mongoose.connect('mongodb://localhost:27018/Blog', function(err) {
    if (err) {
        console.log('数据库连接失败');
    } else {
        console.log('数据库连接成功');
        // 监听http请求
        app.listen(8081);
    }
});

// 用户发送http请求 -> url -> 解析路由 ->找到匹配的规则 -> 执行指定绑定函数,返回对应内容至用户
//  /public ->静态 ->直接读取指定目录下的文件，返回给用户
//  动态 -> 处理业务逻辑，加载模板 -> 解析模板 -> 返回数据给用户