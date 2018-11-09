document.addEventListener('DOMContentLoaded', function() {
    var geolocation_options = {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 10000
    };

    document.getElementById("reset-log").onclick = reset_log;
    var ws;

    function reset_log() {
        if(confirm("Are you sure")) {
            var action = new Object();
            action.action = 'logreset';
            msg = JSON.stringify(action);
            ws.send(msg)
        }
    }

    function connect() {
        console.log('Starting connection');
        ws = new WebSocket("wss://192.168.7.2:5678/");
        // Connection opened
        ws.addEventListener('open', function (event) {
            console.log("Socket opened")
            document.getElementById("overlay").style.display = "none";
        });

        ws.onmessage = function (event) {
            console.log('Data received ' + event.data);
            var data = JSON.parse(event.data);
            hud.drawSpeed(data);
        }

        ws.onclose = function (e) {
            console.log('connection lost');
            document.getElementById("overlay").style.display = "block";
            setTimeout(connect(), 1000);
        };
    }

    connect();

    function update_location(position) {
        if(ws.readyState === ws.OPEN) {
            var coords = new Object()
            coords.lat = position.coords.latitude
            coords.long = position.coords.longitude
            message = JSON.stringify(coords)
            console.log(message)
            ws.send(message)
        }
    }

    function location_error(err) {
        console.warn(`ERROR(${err.code}): ${err.message}`);
    }

    navigator.geolocation.watchPosition(update_location, location_error, geolocation_options);

}, false);
