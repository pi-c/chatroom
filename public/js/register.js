let register_username = document.querySelector('#register_username')
let register_password = document.querySelector('#register_password')
let regBtn = document.querySelector('#regBtn');
let goLogin = document.querySelector('#goLogin');

// 点击btn发送注册请求
regBtn.addEventListener('click', function () {
  event.preventDefault();
  let content = {
    username: register_username.value,
    password: register_password.value
  };
  fetch('http://localhost:3000/register', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(content)
    })
    .then(data => {
      //
    })
    .catch(err => console.log(err))
})

// 点击btn——发送前往登录页面
goLogin.addEventListener('click', function () {
  event.preventDefault();
  fetch('http://localhost:3000/register?goLogin=true', {
      method: 'get',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(data => {
      console.log(data.url)
      window.location.href = data.url;
    })
    .catch(err => console.log(err))
})