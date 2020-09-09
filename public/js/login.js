let login_username = document.querySelector('#login_username')
let login_password = document.querySelector('#login_password')
let loginBtn = document.querySelector('#loginBtn');
// let goRegister=document.querySelector('#goRegister');

// 点击btn——发送登录请求
loginBtn.addEventListener('click', function () {
  event.preventDefault();
  let content = {
    username: login_username.value,
    password: login_password.value
  };
  fetch('http://localhost:3000/login', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(content)
    })
    .then(data => {
      console.log(data)
      window.location.href = data.url;
    })
    .catch(err => console.log(err))
})

// 点击btn——发送前往注册页面
goRegister.addEventListener('click', function () {
  event.preventDefault();
  fetch('http://localhost:3000/login?goReg=true', {
      method: 'get',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(data => {
      window.location.href = data.url;
    })
    .catch(err => console.log(err))
})