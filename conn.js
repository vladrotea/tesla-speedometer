document.addEventListener('DOMContentLoaded', function() {
    function connect(position) {
        console.log('Starting connection');
        var ws = new WebSocket("ws://localhost:5678/");
        // Connection opened
        ws.addEventListener('open', function (event) {
            ws.send(position.coords);
        });
        ws.onmessage = function (event) {
            console.log('Data received ' + event.data);
            var data = JSON.parse(event.data);
            hud.drawSpeed(data);
        }
        ws.onclose = function (e) {
            console.log('connection lost');
            document.getElementById("overlay").style.display = "block";
        };
   }

   navigator.geolocation.getCurrentPosition(connect);

}, false);
