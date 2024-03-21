var token;

let interval = setInterval(() => {
  chrome.runtime.sendMessage({ check: true}, function(response) {
    if (response == "false") {

    } else {
      console.log(response)
      token = response;
      start(response);
      clearInterval(interval)
    }
  });
}, 1000)

setTimeout(() => {
  window.location.reload();
}, 3600000)

function start(token) {
  const socket = new WebSocket('wss://aws.duplex.snapchat.com/snapchat.gateway.Gateway/WebSocketConnect', [
  'snap-ws-auth',
  token
]);

socket.addEventListener('open', (event) => {
  console.log('WebSocket Connection Opened');
});

socket.addEventListener('message', (event) => {
    event.data.text()
    .then(r => {
        console.log(r)
        sendToBackground(r);
    })
});

socket.addEventListener('error', (error) => {
  console.error('WebSocket Error:', error);
});

socket.addEventListener('close', (event) => {
  console.log('WebSocket Connection Closed');
});
}

function sendToBackground(message) {
    chrome.runtime.sendMessage({contentScriptMessage: message});
}
