// node服务器
// 引入模块
const bodyParser = require('body-parser');
const express = require('express')
const app = express();
const http = require('http').Server(app);
const path = require('path')
const io = require('socket.io')(http);
const url = require('url');
const mysql = require('mysql');
const db = require('./config/db');
const sql = require('./config/sql').sql;
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);

// 创建用户名容器
let chatUser;

// 配置session
app.use(session({
  // name: 'sid',
  secret: 'sessionId', // 用来对session id相关的cookie进行签名
  store: new MySQLStore(db.mysql_user), // 存储session至mysql
  saveUninitialized: true, // 是否自动保存未初始化的会话
  resave: false, // 是否每次都重新保存会话
  cookie: {
    maxAge: 10 * 1000 // 有效期，单位是毫秒
  }
}));

// 配置
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
// 配置静态路径
app.use(express.static(path.join(__dirname, 'public')))


// 建立数据库连接
let userConnection = mysql.createConnection(db.mysql_user);
userConnection.connect((err) => {
  if (err) {
    console.log('错误提示' + err);
    userConnection.end();
    return;
  };
  console.log('用户数据库连接成功');
})

// 登录路由
app.get('/login', (req, res) => {
  let params = url.parse(req.url, true).query;
  if (params.goReg) {
    res.redirect('view/register.html');
  } else {
    res.sendFile(__dirname + '/public/view/login.html')
  }
})

app.post('/login', (req, res) => {
  res.setHeader("Content-Type", "text/html")

  let msg;
  if (req.body.username != '' && req.body.password != '') {
    // 同时查询用户名和密码与输入的是否相同
    userConnection.query(sql.selectUser, [req.body.username, req.body.password], (err, result) => {
      // 如果存在查询结果，则说明用户名密码正确
      if (result[0]) {
        msg = '登录成功';
        console.log(msg)
        req.session.username = result[0].username;
        chatUser = req.session.username;
        console.log(chatUser)
        res.redirect('view/chatroom.html');
      } else {
        msg = '用户名或密码错误'
        console.log(msg)
      };
    })
  } else if (req.body.username == '' && req.body.password == '') {
    msg = '用户名和密码不能为空';
    console.log(msg)
    // res.send(msg);
  }
});

// 注册路由
app.get('/register', (req, res) => {
  let params = url.parse(req.url, true).query;
  console.log(params)
  if (params.goLogin) {
    res.redirect('view/login.html');
  } else {
    res.sendFile(__dirname + '/public/view/register.html')
  }
})
app.post('/register', (req, res) => {
  res.setHeader("Content-Type", "text/html")
  let exist = false;
  let msg;
  // 用户名和密码不为空
  if (req.body.username != '' && req.body.password != '') {
    // 查询所有数据
    userConnection.query(sql.selectAll, (err, result) => {
      // 遍历所有数据
      for (let i of result) {
        // 如果用户名已存在，exist=true
        if (i.username == req.body.username) {
          msg = '用户名已存在'
          console.log(msg)
          return exist = true;
        }
      };
      // 如果exist=false，用户名不存在，执行注册
      if (exist == false) {
        userConnection.query(sql.insert, [req.body.username, req.body.password], (err, result) => {
          msg = `注册成功，用户名为${req.body.username}`;
          console.log(msg)
          res.redirect('view/login.html');
        })
      }
    })
  } else if (req.body.username == '' && req.body.password == '') {
    msg = '用户名和密码不能为空';
    console.log(msg)
    res.send({
      msg: '用户名和密码不能为空'
    })
  }
});

// 聊天室路由
app.get('/', (req, res) => {
  let params = url.parse(req.url, true).query;
  if (!req.session.username || params.quit) {
    res.redirect('view/login.html');
    req.session.destroy()
  } else if (req.session.username) {
    console.log(req.session.username)
    console.log('已登录')
    res.redirect('view/chatroom.html');
  }
})

// 配置socket
io.on('connection', socket => {
  // console.log('一个用户已连接');
  socket.on('chat message', msg => {
    console.log(msg)
    let d = new Date();
    io.emit('chat message', `[${chatUser}]$&nbsp;<span>${d}<span><p>${msg}</p>`)
  });
  // socket.on('disconnect', socket => {
  //   console.log('一个用户已退出')
  // })
})

// 监听
http.listen(3000, () => {
  console.log('visit http://localhost:3000')
})