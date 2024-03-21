var done = false;
var t = "false"

function decode(text) {
  const words = text.split(/[^a-zA-Z0-9_.]+/);

  const filterWords = words.filter(word => word.length > 3);

  return filterWords[6]
}

function decode1(text) {
  const words = text.split(/[^a-zA-Z0-9_.]+/);

  const filterWords = words.filter(word => word.length > 3);

  return filterWords[12]+"-"+filterWords[13]+"-"+filterWords[14]+"-"+filterWords[15]+"-"+filterWords[16]
}

chrome.webRequest.onBeforeSendHeaders.addListener(
  function(details) {
    if (!done) {
      console.log(details.requestHeaders)
      let g = details.requestHeaders[1]["value"].split('rer ')[1]
      t = g;
      done = true;
    }
  },
  {urls: ["https://web.snapchat.com/messagingcoreservice.MessagingCoreService/BatchDeltaSync"]},
  ["blocking", "requestHeaders"]
);

function inArray(string, array) {
  let result = false;
  for (let i = 0; i<array.length; i++) {
    if (string == array[i]) {
      result = true;
    }
  }
  return result;
}

function ia(string, array) {
  let result = false;
  for (let i = 0; i<array.length; i++) {
    if (string.includes(array[i])) {
      result = true;
    }
  }
  return result;
}

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if (request.contentScriptMessage) {
        console.log(utf8ToBase64(request.contentScriptMessage));
        if (request.contentScriptMessage.includes('presence')) {
          let r = request.contentScriptMessage;
          send(r)
        }
      } else {
        sendResponse(t)
      }
    }
  );

  function utf8ToBase64(utf8String) {
    const encoded = btoa(unescape(encodeURIComponent(utf8String)));
    return encoded;
  }
  
url = "" // put discord webhook in here

function send(message) {
  let now = new Date();
  let timeOptions = { hour: 'numeric', minute: '2-digit', hour12: true };

  let formattedTime = now.toLocaleTimeString('en-US', timeOptions);
    const dataToSend = {
        content: `**${decode(message)}** has been detected in a chat in channel **${decode1(message)}** at time **${formattedTime}**`,
        username: 'Presence Detected'
      };
      
      fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      })
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then(data => {
          console.log('Message sent successfully:', data);
        })
        .catch(error => {
          console.error('Error sending message to Discord:', error.message);
        });
}
