var hud = (function(){
    var self = {};
    var time_of_day = 'day'
    var color = {
        'day' : {
            'symbol_color' : "#000",
            'second_symbol_color' : '#333',
            'background_color' : 'rgba(255, 255, 255, .9)'
        },
        'night' : {
            'symbol_color' : "#FFF",
            'second_symbol_color' : '#333',
            'background_color' : 'rgba(0, 0, 0, .9)'
        }
    }
    var width = 505;
    var height = 505;

    var c = document.getElementById("canvas");
    c.width = width;
    c.height = height;

    var ctx = c.getContext("2d");

    //Rescale the size
    ctx.scale(1,1);

    var speedGradient = ctx.createLinearGradient(0, width, 0, 0);
    speedGradient.addColorStop(0, '#00b8fe');
    speedGradient.addColorStop(1, '#41dcf4');

    var rpmGradient = ctx.createLinearGradient(0, width, 0, 0);
    rpmGradient.addColorStop(0, '#f7b733');
    rpmGradient.addColorStop(1, '#fc4a1a');
    //rpmGradient.addColorStop(1, '#EF4836');

    function drawNeedle(rotation) {
        ctx.lineWidth = 2;

        ctx.save();
        ctx.translate(250, 250);
        ctx.rotate(rotation);
        ctx.strokeRect(-130 / 2 + 170, -1 / 2, 135, 1);
        ctx.restore();

        rotation += Math.PI / 180;
    }

    function drawMiniNeedle(rotation, width, speed) {
        ctx.lineWidth = width;

        ctx.save();
        ctx.translate(250, 250);
        ctx.rotate(rotation);
        ctx.strokeStyle = "#333";
        ctx.fillStyle = "#333";
        ctx.strokeRect(-20 / 2 + 220, -1 / 2, 20, 1);
        ctx.restore();

        let x = (250 + 180 * Math.cos(rotation));
        let y = (250 + 180 * Math.sin(rotation));

        ctx.font = "20px MuseoSans_900-webfont";
        ctx.fillText(speed, x, y);

        rotation += Math.PI / 180;
    }

    function calculateSpeedAngle(x, a, b) {
        let degree = (a - b) * (x) + b;
        let radian = (degree * Math.PI) / 180;
        return radian <= 1.45 ? radian : 1.45;
    }

    function calculateRPMAngel(x, a, b) {
        let degree = (a - b) * (x) + b;
        let radian = (degree * Math.PI ) / 180;
        return radian
    }

    function draw_assistance_level(level) {
        ctx.font = "70px MuseoSans_900-webfont";
        ctx.fillStyle = color[time_of_day].symbol_color;
        ctx.fillText(level, 250, 460);

        ctx.font = "50px MuseoSans_900-webfont";
        ctx.fillStyle = color[time_of_day].second_symbol_color;
        if (level > 0) 
            ctx.fillText(level - 1, 210, 460);
        if (level < 5) 
            ctx.fillText(level + 1, 290, 460);
    }

    function drawSpeedo(socketData) {
        speed = socketData.speed;
        gear = socketData.assistance;
        rpm = socketData.torque;
        heartbeat = socketData.heart;
        topSpeed = 60
        time_of_day = socketData.tod;

        if (speed == undefined) {
            return false;
        } else {
            speed = Math.floor(speed);
            rpm = rpm;
        }

        ctx.clearRect(0, 0, width, height);

        ctx.beginPath();
        ctx.fillStyle = color[time_of_day].background_color;
        ctx.arc(250, 250, 240, 0, 2 * Math.PI);
        ctx.fill();
        ctx.save()
            ctx.restore();
        ctx.fillStyle = color[time_of_day].symbol_color;
        ctx.stroke();

        ctx.beginPath();
        ctx.strokeStyle = "#333";
        ctx.lineWidth = 10;
        ctx.arc(250, 250, 100, 0, 2 * Math.PI);
        ctx.stroke();

        ctx.beginPath();
        ctx.lineWidth = 1;
        ctx.arc(250, 250, 240, 0, 2 * Math.PI);
        ctx.stroke();
         

        ctx.font = "70px MuseoSans_900-webfont";
        ctx.textAlign = "center";
        ctx.fillText(speed, 250, 270);

        ctx.font = "15px MuseoSans_900-webfont";
        ctx.fillText("km/h", 250, 295);

        //draw heartbeat
        ctx.fillStyle = "#A40707"
        ctx.font = "40px MuseoSans_900-webfont"
        ctx.textAlign = "center"
        ctx.fillText(heartbeat, 250, 60)
        ctx.stroke()

        draw_assistance_level(gear)
            ctx.fillStyle = color[time_of_day].symbol_color;

        // Speed scale % lines
        for (var i = 5; i <= Math.ceil(topSpeed / 10) * 10; i += 5) {
            console.log();
            var speed_angle = calculateSpeedAngle(i / topSpeed, 80.07888, 34.3775) * Math.PI
                drawMiniNeedle(speed_angle, i % 10 == 0 ? 3 : 1, i%10 == 0 ? i : '');
        }

        var max_torque = 700;
        for (var i = 0; i <= max_torque; i += 50) {
            var division_angle = calculateRPMAngel(i / max_torque, -22.9183, 22.9183) * Math.PI;
            drawMiniNeedle(division_angle, i % 100 == 0 ? 3 : 1, i % 100 == 0 ? i : '');
        }

        var speed_indicator_angle = calculateSpeedAngle(speed / topSpeed, 83.07888, 34.3775) * Math.PI
            var torque_indicator_angle =  calculateRPMAngel(rpm / max_torque, -22.9183, 22.9183) * Math.PI

        // draw speed fill bar
        ctx.beginPath();
        ctx.strokeStyle = "#41dcf4";
        ctx.lineWidth = 25;
        ctx.shadowBlur = 20;
        ctx.shadowColor = "#00c6ff";
        ctx.strokeStyle = speedGradient;
        ctx.arc(250, 250, 228, .6 * Math.PI, speed_indicator_angle);
        ctx.stroke();

        // draw torque fill bar
        ctx.beginPath();
        ctx.lineWidth = 25;
        ctx.strokeStyle = rpmGradient;
        ctx.shadowBlur = 20;
        ctx.shadowColor = "#f7b733";
        ctx.arc(250, 250, 228, .4 * Math.PI, torque_indicator_angle, true);
        ctx.stroke();

        ctx.shadowBlur = 0;


        //draw speed needle
        ctx.strokeStyle = '#41dcf4';
        drawNeedle(speed_indicator_angle);

        //draw torque needle
        ctx.strokeStyle = rpmGradient;
        drawNeedle(torque_indicator_angle);

        //reset stroke
        ctx.strokeStyle = "#000";
    }

    self.drawSpeed = drawSpeedo;
    return self;
}());
