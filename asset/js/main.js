var audio = document.getElementById('beep');
    var camera = document.getElementById('camera');
    var button = document.getElementById('button');
    var output = document.getElementsByClassName('output')[0];
    var h1 = document.getElementsByTagName('h1')[0];

    document.getElementsByClassName('start')[0].addEventListener('click', main);

    function main() {
        if (camera.classList.contains("hide")) {
            startscanner();
        } else {
            stopscanner();
        }
    }

    // INISIALISASI   
    let scanner = new Instascan.Scanner({
        video: document.getElementById('camera'),
        mirror: false
    });

    // START CAMERA
    function startscanner() {

        output.style.display = "none";

        camera.style.display = "block";
        camera.classList.add("show");
        camera.classList.remove("hide");

        button.classList.add("stop");
        button.classList.remove("start");
        button.innerText = "STOP";

        //GET CAMERA
        Instascan.Camera.getCameras().then(function(cameras) {
            if (cameras.length > 0) {
                // Attempt to find the back camera
                var backCamIndex = cameras.findIndex(cam => cam.name && cam.name.includes('back'));
                scanner.start(cameras[backCamIndex !== -1 ? backCamIndex : 0]);
            } else {
                alert('No cameras found');
            }
        }).catch(function(e) {
            console.error(e);
        });
        

        // SCANNING
        scanner.addListener('scan', function(c) {

            if (c != "NULL") {

                beep.play();
                h1.innerHTML = c;
                sendDataToSheet(c);
                output.style.display = "block";
                stopscanner();

            }

        });
    }

    //STOP CAMERA
    function stopscanner() {
        scanner.stop();
        camera.style.display = "none";

        button.classList.add("start");
        button.classList.remove("stop");

        camera.classList.add("hide");
        camera.classList.remove("show");

        button.innerText = "START";
    }





    
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
  
 
