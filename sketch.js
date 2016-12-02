var bg0;
var bg1;
var bg2;
var bullets;
var asteroids;
var ship;
var star;
var shipImage, bulletImage, particleImage;
var MARGIN = 40;
var gameOver = false;
var gameStarted = false;
var gameWon = false

function preload() {}

function setup() {
	createCanvas(1280, 720);
	bg0 = loadImage("assets/sinistar_BG_0.jpg");
	bg1 = loadImage("assets/sinistar_BG_1.jpg");
	bg2 = loadImage("assets/sinistar_BG_2.jpg");
	
	bulletImage = loadImage("assets/bullet.png");
	
	shipImage = loadImage("assets/ship_00.png");
	
	particleImage = loadImage("assets/particle.png");
	
	ship = createSprite(width / 2, height / 2);
	ship.maxSpeed = 6;
	ship.friction = .98;
	ship.setCollider("circle", 0, 0, 20);
	ship.addImage("normal", shipImage);
	ship.addAnimation("thrust", "assets/ship_01.png");
	
	star = createSprite(width, height / 2);
	star.maxSpeed = 2;
	star.addAnimation("normal", "assets/star_0001.png", "assets/star_0005.png");
	star.velocity.x = 1;
	star.velocity.y = (1, 3);
	star.setCollider("circle", 0, 0, 50);
	//star.attractionPoint(.2, ship.position.x, ship.position.y);
	
	
	asteroids = new Group();
	bullets = new Group();
	
	for (var i = 0; i < 8; i++) {
		var ang = random(360);
		var px = width / 2 + 1000 * cos(radians(ang));
		var py = height / 2 + 1000 * sin(radians(ang));
		createAsteroid(3, px, py);
	}
}

function draw() {
	if (gameStarted){
		if (!gameOver) {
			background(bg1);
			fill(255);
			textAlign(CENTER);
			textSize(22);
			text("Controls: Up to ACCELERATE, Left and Right for DIRECTION, X to FIRE", width / 2, 20);
			for (var i = 0; i < allSprites.length; i++) {
				var s = allSprites[i];
				if (s.position.x < -MARGIN) s.position.x = width + MARGIN;
				if (s.position.x > width + MARGIN) s.position.x = -MARGIN;
				if (s.position.y < -MARGIN) s.position.y = height + MARGIN;
				if (s.position.y > height + MARGIN) s.position.y = -MARGIN;
			}
			asteroids.overlap(bullets, asteroidHit);
			ship.bounce(asteroids);
			if (keyDown(LEFT_ARROW)) ship.rotation -= 4;
			if (keyDown(RIGHT_ARROW)) ship.rotation += 4;
			if (keyDown(UP_ARROW)) {
				ship.addSpeed(.2, ship.rotation);
				ship.changeAnimation("thrust");
			} else ship.changeAnimation("normal");
			if (keyWentDown("x")) {
				var bullet = createSprite(ship.position.x, ship.position.y);
				bullet.addImage(bulletImage);
				bullet.setSpeed(10 + ship.getSpeed(), ship.rotation);
				bullet.life = 60;
				bullets.add(bullet);
			}
			star.scale = random(0.90, 1);
			star.attractionPoint(.2, ship.position.x, ship.position.y);
			ship.overlap(star, starHit);
			drawSprites();
		} else {
			background(bg2);
			textAlign(CENTER);
			textSize(22);
			text("CMD+R to Try Again", width / 2, height / 2);
		}
	} else {
		background(bg0);
		textAlign(CENTER);
		textSize(22);
		text("Click ANYWHERE to begin", width / 2, height / 2);
		if (mouseIsPressed) {
			gameStarted = true;
		}
	}
}

function createAsteroid(type, x, y) {
	var a = createSprite(x, y);
	var img = loadImage("assets/asteroid_" + floor(random(0, 3)) + ".png");
	a.addImage(img);
	a.setSpeed(2.5 - (type / 2), random(360));
	a.rotationSpeed = .5;
	//a.debug = true;
	a.type = type;
	if (type == 2) a.scale = .6;
	if (type == 1) a.scale = .2;
	a.mass = 2 + a.scale;
	a.setCollider("circle", 0, 0, 50);
	asteroids.add(a);
	return a;
}

function asteroidHit(asteroid, bullet) {
	var newType = asteroid.type - 1;
	if (newType > 0) {
		createAsteroid(newType, asteroid.position.x, asteroid.position.y);
		createAsteroid(newType, asteroid.position.x, asteroid.position.y);
	}
	for (var i = 0; i < 10; i++) {
		var p = createSprite(bullet.position.x, bullet.position.y);
		p.addImage(particleImage);
		p.setSpeed(random(3, 5), random(360));
		p.friction = 0.95;
		p.life = 10;
	}
	bullet.remove();
	asteroid.remove();
}

function starHit(type, x, y) {
	gameOver = true;
}