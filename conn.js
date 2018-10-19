document.addEventListener('DOMContentLoaded', function() {
    console.log('Starting connection');
    var ws = new WebSocket("ws://localhost:5678/");
    ws.onmessage = function (event) {
        console.log('Data received ' + event.data);
        var data = JSON.parse(event.data);
        hud.drawSpeed(data.speed, data.assistance, data.torque, data.heart);
    }
}, false);
