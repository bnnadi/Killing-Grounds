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

        function enterFrame () {
            checkKeys();
            update();
            render();
        }

        // canvasApp level variables
        var stageWidth = 800;
        var stageHeight = 500;
        var player = {};

        /*var rotation = 0;
        var x = 50;
        var y = 50;
        var facingX = 0;
        var facingY = 0;
        var movingX = 0;
        var movingY = 0;
        var rotationalVelocity = 5;
        var thrustAcceleration = 0.03;
        var maxVelocity = 2;*/
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
        }

        function checkKeys () {
            if (keyPressList[38] == true) {
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

            if (keyPressList[37] == true) {
                // rotate counterclockwise
                player.rotation -= player.rotationalVelocity;
            }

            if (keyPressList[39] == true) {
                // rotate clockwise
                player.rotation += player.rotationalVelocity;
            }
        }

        function update () {
            updatePlayer();
        }

        function updatePlayer () {
            player.x = player.x + player.movingX;
            player.y = player.y + player.movingY;
        }

        function render () {
            renderBackground();
            renderPlayerShip();
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