document.addEventListener('DOMContentLoaded', function() {
    function connect(position) {
        console.log('Starting connection');
        var ws = new WebSocket("wss://192.168.7.2:5678/");
        // Connection opened
        ws.addEventListener('open', function (event) {
            document.getElementById("overlay").style.display = "none";
            ws.send('(' + 46.7667 + ', ' + 23.6 + ')');
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
    navigator.geolocation.getCurrentPosition(connect);

}, false);
