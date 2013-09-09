(function($) {

	var can = document.getElementById('canvas');
	var ctx = can.getContext('2d');
	var keysDown = {};
	var mX = 240;
	var mY = 240;
	var pX = 0;
	var pY = 0;
	var rise = 0;
	var run = 0;
	var angle = 0;
	var distance = 0;
	var shot = false;
	var score = 0;



	// Background Image
	var bgReady = false;
	var bgImage = new Image();
	bgImage.onload = function() {
		bgReady = true;
	}
	bgImage.src = 'img/bg.png';



	// Player Images
	var playerReady = false;
	var playerImage = new Image();
	playerImage.onload = function() {
		playerReady = true;
		console.log('ready');
	}
	playerImage.src = "img/player.png";



	// Enemy Image
	var enemyReady = false;
	var enemyImage = new Image();
	enemyImage.onload = function() {
		enemyReady = true;
	}
	enemyImage.src = 'img/enemy.png';


	// Object Initialization
	var player = {
		speed: 250,
		x: 0,
		y: 0
	};

	var enemy = {
		x: 100,
		y: 100
	}

	var bullet = {
		speed: 2000,
		x: 240,
		y: 240
	}


	addEventListener('keydown', function(e) {
		keysDown[e.keyCode] = true;
	}, false);

	addEventListener('keyup', function(e) {
		delete keysDown[e.keyCode];
	}, false);

	$(can).mousedown(function(e) {
		if(shot != true) {
			shot = true;
		
			mX = e.pageX - $(this).offset().left;
			mY = e.pageY - $(this).offset().top;

			pX = player.x;
			pY = player.y;

			rise = (pY-mY);
			run = (pX-mX);

			distance = Math.sqrt((mX - pX)*(mX - pX) + (mY - pY)*(mY - pY));
		}
	});

	// $(can).mousemove(function(e) {
	// 	var stareX = e.pageX - $(this).offset().left;
	// 	var stareY = e.pageY - $(this).offset().top;

	// 	var arg = (stareY-player.y)/(stareX-player.x);
	// 	angle = Math.atan(arg);
	// 	console.log(angle);
	// })

	var init = function() {
		player.x = can.width / 2;
		player.y = can.height / 2;
	}

	var reset = function() {
		shot = false;
		bullet.x = player.x;
		bullet.y = player.y;
		enemy.x = 32 + (Math.random() * (canvas.width - 64));
		enemy.y = 32 + (Math.random() * (canvas.height - 64));
	};

	var update = function(mod) {
		if(87 in keysDown) {
			player.y -= player.speed * mod;
		}

		if(83 in keysDown) {
			player.y += player.speed * mod;
		}

		if(65 in keysDown) {
			player.x -= player.speed * mod;
		}

		if(68 in keysDown) {
			player.x += player.speed * mod;
		}

		// var dist = (bullet.speed * mod) * slope;
		// console.log(dist);

		var velX = (run/distance)*bullet.speed*mod;
		var velY = (rise/distance)*bullet.speed*mod;

		if(shot == true) {
			bullet.x += -velX;
			bullet.y += -velY;
		}else if(shot == false) {
			bullet.x = player.x;
			bullet.y = player.y;
		}

		if(bullet.x > 1424 || bullet.y > 700 || bullet.y < 0 || bullet.x < 0) {
			reset();
		}

		if(bullet.x >= (enemy.x -5)
		&& bullet.y >= (enemy.y -5)
		&& bullet.x <= (enemy.x +30)
		&& bullet.y <= (enemy.y +30)) {
			score++;
			reset();
		}
	};

	var render = function() {
		ctx.fillStyle = '#dddddd';
		ctx.fillRect(0,0,1424,700);

		if(shot == false) {
			ctx.fillStyle = '#000000';
			ctx.fillRect(player.x, player.y, 5,5);
		}else if(shot== true) {
			ctx.fillStyle = '#000000';
			ctx.fillRect(bullet.x, bullet.y, 5,5);
		}

		ctx.fillStyle = '#ee0000';
		ctx.fillRect(enemy.x, enemy.y, 30,30);

		if (playerReady) {
			if(angle != 0) {
				ctx.save();
				ctx.translate(player.x, player.y);
				ctx.rotate(angle);
				ctx.drawImage(playerImage,player.x-15,player.y-15);
				ctx.restore();
				angle = 0;
			}else{
				ctx.drawImage(playerImage, player.x-15, player.y-15);
			}
		}

		// if(playerReady) {
		// 	ctx.rotate(angle);
		// 	ctx.drawImage(playerImage, player.x-15, player.y-15);
		// 	ctx.rotate(-angle);
		// 	angle = 0;
		// }

		ctx.fillStyle = "rgb(250, 250, 250)";
		ctx.font = "24px Helvetica";
		ctx.textAlign = "left";
		ctx.textBaseline = "top";
		ctx.fillText("Reds Killed: " + score, 32, 32);
	};

	var main = function() {
		var now = Date.now();
		var delta = now - then;

		update(delta / 1000);
		render();

		then = now;
	};

	init();
	var then = Date.now();
	setInterval(main, 1);

})(jQuery);