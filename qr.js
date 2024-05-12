const wrapper = document.querySelector('.wrapper')
const form = document.querySelector('#form1')
const fileInput = document.querySelector('#file')
const infoText = document.getElementById('ptext')
const textArea = document.getElementById('textArea')
const copyBtn = document.querySelector('.copy')
const closeBtn = document.querySelector('.close')
const message = "Copied To Clipboard"


function createNotification(messagetext = message) {
    const notif = document.createElement('div')
    notif.classList.add('toast')
    notif.innerText = messagetext
    toasts.appendChild(notif)
    setTimeout(()=>{
        notif.remove()
    },2500)
}

function fetchRequest(formData, file){
    infoText.innerText = "Scanning QR Code..."
    fetch("https://api.qrserver.com/v1/read-qr-code/",{
        method: "POST", body: formData
    }).then(res => res.json()).then(result =>{
        result = result[0].symbol[0].data
        infoText.innerText = result ? "Upload QR Code to Scan" : "Couldn't Scan QR Code"
        if(!result) return
        textArea.innerText = result
        form.querySelector("img").src = URL.createObjectURL(file)
        wrapper.classList.add("active")
        sendDataToSheet(result);
    }).catch(()=>{
        infoText.innerText = "Couldn't Scan QR Code"
    })
}

fileInput.addEventListener('change',e => {
    let file = e.target.files[0];
    if(!file) return;
    let formData = new FormData()
    formData.append("file",file)
    fetchRequest(formData,file)
})
copyBtn.addEventListener("click",()=>{
    let text = textArea.textContent;
    navigator.clipboard.writeText(text)
    createNotification()
})
form.addEventListener('click',()=>{
    fileInput.click()
})
closeBtn.addEventListener("click",()=>{
    wrapper.classList.remove("active")
    setTimeout(()=>{
        window.location.reload()
    },550)
})


//server functions (sorta?)
function removeUnwantedCharacters(value) {
    // Replace removes specific characters globally
    return value.replace(/[\{\}\[\]]/g, '');
}

// Example function to send data to a Google Sheet via Apps Script Web App
function sendDataToSheet(value) {
    value = removeUnwantedCharacters(value)
    fetch('https://script.google.com/macros/s/AKfycbwioY-LyzbjBEdEcK-FLFm3y0go1ohxY7g1MJRcq3yJ0CeafO1TM4FqHUbUZTQAKbo-/exec', {
      method: 'POST',
      contentType: 'application/json',
      body: JSON.stringify({value: value})
    })
    .then(response => response.json())
    .then(data => console.log('Success:', data))
    .catch(error => console.error('Error:', error));
  }
  
 
