(function () {

    this.socket = io.connect('http://localhost:8080');

    window.addEventListener('load', eventWindowLoaded, false);
    function eventWindowLoaded () {
        canvasApp();
    }

    function canvasApp () {
        var stage = document.getElementById("stage");
        if (!stage || !stage.getContext) {
            return;
        }

        var graphics = stage.getContext("2d");
        if (!graphics) {
            return;
        }

        // application level variables
        var stageWidth = 800;
        var stageHeight = 500;
        var player = {};
        var ships = [];
        var keyPressList = [];

        function init () {
            var rX = Math.random()*stageWidth;
            var rY = Math.random()*stageHeight;

            if (rX < 50) { rX += 60; }  else if (rX > stageWidth-50) { rX -= 60; }
            if (rY < 50) { rY += 60; }  else if (rY > stageHeight-50) { rY -= 60; }

            initShip(String(Math.random()*100000000), rX, rY);
            socket.emit('connect', {'name': player.name, 'x': player.x, 'y': player.y, 'rotation': player.rotation, 'score': player.score});
        }

        function initShip (name, x, y) {
            player.x = x;
            player.y = y;
            player.rotation = 0;
            player.facingX = 0;
            player.facingY = 0;
            player.movingX = 0;
            player.movingY = 0;
            player.rotationalVelocity = 5;
            player.thrustAcceleration = 0.03;
            player.maxVelocity = 2;
            player.missiles = [];
            player.missileFrameCount = 0;
            player.missileDelay = 10;
            player.name = name;
            player.score = 0;
            ships.push(player);
        }

        function enterFrame () {
            checkKeys();
            render();
            update();
        }

        function checkKeys () {
            if (keyPressList[38] == true || keyPressList[87]) {
                // thrust
                var angleInRadians = player.rotation * Math.PI / 180;
                player.facingX = Math.cos(angleInRadians);
                player.facingY = Math.sin(angleInRadians);

                var movingXNew = player.movingX + player.thrustAcceleration * player.facingX;
                var movingYNew = player.movingY + player.thrustAcceleration * player.facingY;
                var currentVelocity = Math.sqrt((movingXNew*movingXNew) + (movingYNew*movingYNew));

                if (currentVelocity < player.maxVelocity) {
                    player.movingX = movingXNew;
                    player.movingY = movingYNew;
                }
            }

            if (keyPressList[37] == true || keyPressList[65]) {
                // rotate counterclockwise
                player.rotation -= player.rotationalVelocity;
            }

            if (keyPressList[39] == true || keyPressList[68]) {
                // rotate clockwise
                player.rotation += player.rotationalVelocity;
            }

            if (keyPressList[32] == true) {
                // fire
                if (player.missileFrameCount > player.missileDelay) {
                    fireMissile();
                    player.missileFrameCount = 0;
                    socket.emit('missile.update', {'name': player.name, 'missiles': player.missiles});
                }
            }
        }

        function fireMissile () {
            var newPlayerMissile = {};
            newPlayerMissile.dx = 5 * Math.cos(Math.PI*(player.rotation)/180);
            newPlayerMissile.dy = 5 * Math.sin(Math.PI*(player.rotation)/180);
            newPlayerMissile.x = player.x;
            newPlayerMissile.y = player.y;
            newPlayerMissile.life = 60;
            newPlayerMissile.lifeCtr = 0;
            newPlayerMissile.width = 2;
            newPlayerMissile.height = 2;
            player.missiles.push(newPlayerMissile);
        }

        function update () {
            grabPlayers();
            updatePlayer();
            checkCollision();
            updateMissiles();
            updateTime();
        }

        function grabPlayers () {
            socket.emit('fetch.players', {});
        }

        function updatePlayer () {
            player.x = player.x + player.movingX;
            player.y = player.y + player.movingY;

            if (player.x < -20) {
                player.x = stageWidth;
            }
            else if (player.x > stageWidth+20) {
                player.x = 0;
            }
            else if (player.y < -20) {
                player.y = stageHeight;
            }
            else if (player.y > stageHeight+20) {
                player.y = 0;
            }

            socket.emit('player.move', {'name': player.name, 'x': player.x, 'y': player.y, 'rotation': player.rotation});

            player.missileFrameCount++;
        }

        function updateTime() {
            totalTime+= intervalTime/1000;
            if(totalTime >= 60) {
                clearInterval(interval);
                var pop = document.getElementById("pop-up")
                pop.setAttribute('style', 'display: block;');
                console.log(pop);
            }
        }

        function checkCollision () {
            for (var i = player.missiles.length-1; i >= 0; i--) {
                var missile = player.missiles[i];
                for (var j = 0, max = ships.length; j < max; j++) {
                    if (ships[j].name != player.name) {
                        var dX = missile.x - ships[j].x;
                        var dY = missile.y - ships[j].y;
                        var distance = Math.sqrt((dX*dX) + (dY*dY));

                        if (distance <= 10) {
                            player.score += 100;
                            socket.emit('player.hit', ships[j]);
                            player.missiles.splice(i, 1);
                            missile = null;
                            socket.emit('missile.update', {'name': player.name, 'missiles': player.missiles});
                            return;
                        }
                    }
                }
            }
        }

        function updateMissiles () {
            for (var i = player.missiles.length-1; i >= 0; i--) {
                var missile = player.missiles[i];
                missile.x += missile.dx;
                missile.y += missile.dy;
                missile.lifeCtr++;
                if (missile.lifeCtr > missile.life) {
                    player.missiles.splice(i, 1);
                    missile = null;
                }
            }

            socket.emit('missile.update', {'name': player.name, 'missiles': player.missiles});
        }

        function render () {
            renderBackground();
            renderShips();
            renderMissiles();
            renderTime();
        }

        function renderBackground () {
            graphics.fillStyle = '#000000';
            graphics.fillRect(0, 0, stageWidth, stageHeight);
        }

        function renderShips () {
            for (var i = 0, max = ships.length; i < max; i++) {
                drawShip(ships[i].x, ships[i].y, ships[i].rotation, ships[i].name);
            }
        }

        function drawShip (x, y, rotation, name) {
            // transformation
            var angleInRadians = rotation * Math.PI / 180;
            graphics.save();
            graphics.setTransform(1,0,0,1,0,0); // reset identity

            // translate the canvas origin to the center of the player
            graphics.translate(x, y);

            graphics.fillStyle = "#ffffff";
            graphics.fillText(name, -15, -30);
            graphics.font = "15px _sans";
            graphics.textAlign = "middle";
            graphics.textBaseline = 'top';

            graphics.rotate(angleInRadians);

            // Color depends on whether if its player or enemy
            graphics.strokeStyle = "#ffffff";
            graphics.beginPath();

            // locations - hardcoded
            graphics.moveTo(-10,-10);
            graphics.lineTo(10,0);
            graphics.moveTo(10,1);
            graphics.lineTo(-10,10);
            graphics.lineTo(1,1);
            graphics.moveTo(1,-1);
            graphics.lineTo(-10,-10);

            graphics.stroke();
            graphics.closePath();

            graphics.restore();
        }

        function renderMissiles () {
            for (var i = 0, iMax = ships.length; i < iMax; i++) {

                for (var j = 0, jMax = ships[i].missiles.length; j < jMax; j++) {
                    var missile = ships[i].missiles[j];
                    drawMissile(missile.x, missile.y);
                }

            }
        }

        function drawMissile (x, y) {
            graphics.save();
            graphics.setTransform(1,0,0,1,0,0); // reset to identity

            graphics.translate(x+1, y+1);
            graphics.strokeStyle = "#ffffff";

            graphics.beginPath();

            // draw everything offset by 1/2. Zero relative 1/2 is 15
            graphics.moveTo(-1,-1);
            graphics.lineTo(1,-1);
            graphics.lineTo(1,1);
            graphics.lineTo(-1,1);
            graphics.lineTo(-1,-1);
            graphics.stroke();
            graphics.closePath();
            graphics.restore();
        }

        function renderTime() {
            graphics.fillStyle = "rgba(250,250,250, .5)";
            graphics.font = "40px Helvetica";
            graphics.textAlign = "center";
            graphics.textBaseline = "top";
            graphics.fillText(Math.round(60 - totalTime), stage.width/2, 30);
            graphics.font = "16px _sans";
        }

        document.onkeydown = function (e) {
            e = e?e:window.event;
            keyPressList[e.keyCode] = true;
        };

        document.onkeyup = function (e) {
            e = e?e:window.event;
            keyPressList[e.keyCode] = false;
        };

        socket.on('fetch.players', function (data) {
            ships = [];
            for (var ship in data) {
                ships.push(data[ship]);
            }
        });

        //*** application init
        stage.width = stageWidth;
        stage.height = stageHeight;
        init();

        //*** application loop
        const FRAME_RATE = 40;
        var intervalTime = 1000/FRAME_RATE;
        var totalTime = 0;
        var interval = setInterval(enterFrame, intervalTime);
    }

})();