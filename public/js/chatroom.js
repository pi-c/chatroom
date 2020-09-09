let socket = io();
let messages = document.getElementById('messages');
let msgForm = document.getElementById('msgForm');
let inputBox = document.getElementById('inputBox');
let sendMsg = document.getElementById('sendMsg');
let quitChat = document.getElementById('quitChat');

// enter/鼠标点击发送消息
sendMsg.addEventListener('click', () => {
  socket.emit('chat message', inputBox.value);
  inputBox.value = '';
});
inputBox.addEventListener('keydown', (event) => {

  if (event.keyCode === 13) {
    event.preventDefault()
    console.log(inputBox.value)
    socket.emit('chat message', inputBox.value);
    inputBox.value = '';
  } else {
    return;
  }
})

socket.on('chat message', msg => {
  let li = document.createElement('li')
  li.innerHTML = msg;
  messages.append(li)
})

// 发送退出登录请求
quitChat.addEventListener('click', function () {
  fetch('http://localhost:3000?quit=true', {
      method: 'get',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(data => {
      console.log('已退出')
      window.location.href = data.url
    })
    .catch(err => console.log(err))
})