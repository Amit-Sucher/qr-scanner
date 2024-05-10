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

function fetchRequest(formData, file) {
    infoText.innerText = "Scanning QR Code...";
    fetch("https://api.qrserver.com/v1/read-qr-code/", {
        method: "POST",
        body: formData,
    })
        .then((res) => res.json())
        .then((result) => {
            result = result[0].symbol[0].data;
            infoText.innerText = result ? "Upload QR Code to Scan" : "Couldn't Scan QR Code";
            if (!result) return;
            textArea.innerText = result;
            form.querySelector("img").src = URL.createObjectURL(file);
            wrapper.classList.add("active");

            // Send the scanned data to the Google Apps Script web app
            const webAppUrl = 'https://script.google.com/macros/s/AKfycbz5ROBrSaOuUJRJuj6wpKE7Bslmb1M5bRTOc5rSiHYHYMouABZdicSDopC-insL1ECd/exec'; // Replace with the actual URL
            fetch(webAppUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ qr: result }),
            })
            .then((response) => response.json())
            .then((data) => {
                if (data.status === 'success') {
                    console.log("Successfully added QR data to the Google Sheet.");
                } else {
                    console.error("Failed to add QR data to the Google Sheet:", data.message);
                }
            })
            .catch((error) => {
                console.error("Error sending data to the web app:", error);
            });
        })
        .catch(() => {
            infoText.innerText = "Couldn't Scan QR Code";
        });
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