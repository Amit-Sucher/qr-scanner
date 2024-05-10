// Selectors for DOM elements
const wrapper = document.querySelector('.wrapper');
const form = document.querySelector('#form1');
const fileInput = document.querySelector('#file');
const infoText = document.getElementById('ptext');
const textArea = document.getElementById('textArea');
const copyBtn = document.querySelector('.copy');
const closeBtn = document.querySelector('.close');

const message = "Copied To Clipboard";
const apiKey = "AIzaSyAGxFE-F8ARrcK1taKNc_z7bO67Re0oVFo"; // Replace with your actual API key
const spreadsheetId = "1uLD1ZknVpRXH1K5TL5XP-7ddqs7LkaO9s2dscOMR888"; // Replace with your spreadsheet ID
const range = "Sheet1!A1"; // Adjust to your needs

// Function to create a notification
function createNotification(messagetext = message) {
    const notif = document.createElement('div');
    notif.classList.add('toast');
    notif.innerText = messagetext;
    toasts.appendChild(notif);

    setTimeout(() => {
        notif.remove();
    }, 2500);
}

// Function to send scanned QR data to Google Sheets
async function appendToGoogleSheet(data) {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}:append?valueInputOption=RAW&key=${apiKey}`;
    const values = [[data]];
    const requestBody = { values };

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestBody),
        });
        const result = await response.json();

        if (response.ok) {
            console.log("Successfully appended data to Google Sheets:", result);
        } else {
            console.error("Error appending data:", result);
        }
    } catch (error) {
        console.error("Error writing to Google Sheets:", error);
    }
}

// Function to scan the QR code and append data
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

            // Append scanned QR data to Google Sheets
            appendToGoogleSheet(result);
        })
        .catch(() => {
            infoText.innerText = "Couldn't Scan QR Code";
        });
}

// Event listeners for scanning and copying
fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    fetchRequest(formData, file);
});

copyBtn.addEventListener("click", () => {
    const text = textArea.textContent;
    navigator.clipboard.writeText(text);
    createNotification();
});

form.addEventListener('click', () => {
    fileInput.click();
});

closeBtn.addEventListener("click", () => {
    wrapper.classList.remove("active");
    setTimeout(() => {
        window.location.reload();
    }, 550);
});
