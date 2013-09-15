(function () {

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
        var xMin = 0;
        var yMin = 0;
        var xMax = stageWidth;
        var yMax = stageHeight;
        var player = {};
        var playerMissiles = [];
        var keyPressList = [];

        function init () {
            initPlayer();
        }

        function initPlayer () {
            player.x = 50;
            player.y = 50;
            player.rotation = 0;
            player.facingX = 0;
            player.facingY = 0;
            player.movingX = 0;
            player.movingY = 0;
            player.rotationalVelocity = 5;
            player.thrustAcceleration = 0.03;
            player.maxVelocity = 2;
            player.missileFrameCount = 0;
            player.missileDelay = 10;
        }

        function enterFrame () {
            checkKeys();
            update();
            render();
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
                if (player.missileFrameCount > player.missileDelay) {
                    fireMissile();
                    player.missileFrameCount = 0;
                }
            }
        }

        function fireMissile () {
            var newPlayerMissile = {};
            newPlayerMissile.dx = 5 * Math.cos(Math.PI*(player.rotation)/180);
            newPlayerMissile.dy = 5 * Math.sin(Math.PI*(player.rotation)/180);
            newPlayerMissile.x = player.x + 10;
            newPlayerMissile.y = player.y + 10;
            newPlayerMissile.life = 60;
            newPlayerMissile.lifeCtr = 0;
            newPlayerMissile.width = 2;
            newPlayerMissile.height = 2;
            playerMissiles.push(newPlayerMissile);
        }

        function update () {
            updatePlayer();
            updateMissiles();
        }

        function updatePlayer () {
            player.x = player.x + player.movingX;
            player.y = player.y + player.movingY;

            if (player.x < xMin-20) {
                player.x = xMax;
            }
            else if (player.x > xMax+20) {
                player.x = xMin;
            }
            else if (player.y < yMin-20) {
                player.y = yMax;
            }
            else if (player.y > yMax+20) {
                player.y = yMin;
            }

            player.missileFrameCount++;
        }

        function updateMissiles () {
            for (var i = 0, max = playerMissiles.length-1; i < max; i++)
            {
                var missile = playerMissiles[i];
                missile.x += missile.dx;
                missile.y += missile.dy;

                if (missile.x > xMax) {
                    missile.x =- missile.width;
                }
                else if (missile.x < -missile.width) {
                    missile.x = xMax;
                }

                if (missile.y > yMax) {
                    missile.y =- missile.width;
                }
                else if (missile.y < -missile.height) {
                    missile.y = yMax;
                }

                missile.lifeCtr++;
                if (missile.lifeCtr > missile.life) {
                    playerMissiles.splice(i, 1);
                    missile = null;
                }
            }
        }

        function render () {
            renderBackground();
            renderPlayerShip();
            renderPlayerMissiles();
        }

        function renderBackground () {
            graphics.fillStyle = '#000000';
            graphics.fillRect(0, 0, stageWidth, stageHeight);
        }

        function renderPlayerShip () {
            // transformation
            var angleInRadians = player.rotation * Math.PI / 180;
            graphics.save();
            graphics.setTransform(1,0,0,1,0,0); // reset identity

            // translate the canvas origin to the center of the player
            graphics.translate(player.x + 10, player.y + 10);

            graphics.fillStyle = "#ffffff";
            graphics.fillText("player", -15, -30);
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

        function renderPlayerMissiles () {
            for (var i = 0, max = playerMissiles.length-1; i < max; i++) {
                var missile = playerMissiles[i];

                graphics.save();
                graphics.setTransform(1,0,0,1,0,0); // reset to identity

                graphics.translate(missile.x+1, missile.y+1);
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
        }

        document.onkeydown = function (e) {
            e = e?e:window.event;
            keyPressList[e.keyCode] = true;
        };

        document.onkeyup = function (e) {
            e = e?e:window.event;
            keyPressList[e.keyCode] = false;
        };

        //*** application init
        stage.width = stageWidth;
        stage.height = stageHeight;
        init();

        //*** application loop
        const FRAME_RATE = 40;
        var intervalTime = 1000/FRAME_RATE;
        setInterval(enterFrame, intervalTime);
    }

})();