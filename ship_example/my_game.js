var ship;

var ship_x,ship_y;

var bullets = [];
var current_bullet=0, num_bullets=128;


function update(){
	updateShipControls();
	updateBullets();
}


function draw(){
	draw_sprite(canvas, ship, ship_x, ship_y);
	drawBullets();
}


function init(){

	// int array of bullet objects
	for (var c = 0; c < num_bullets; c++) 
		bullets[c] = {
			x: 0, 
			y: 0,
			vx: 0,
			vy: 0,
			on:false
		};

	ship_x = SCREEN_W/2;
	ship_y = SCREEN_H-100;
}

function updateBullets(){
	for (var c = 0; c < num_bullets; c++){
		if (!bullets[c].on) 
			continue;

		bullets[c].x += bullets[c].vx;
		bullets[c].y += bullets[c].vy;

		if (bullets[c].y < 0) 
			bullets[c].on = false;
	}
}

function updateShipControls(){
	if (key[KEY_UP]) 
		ship_y -= 4;
	if (key[KEY_DOWN]) 
		ship_y += 4;
	if (key[KEY_LEFT]) 
		ship_x -= 4;
	if (key[KEY_RIGHT]) 
		ship_x += 4;

	if (key[KEY_SPACE]){
		bullets[current_bullet++] = {
			x: ship_x,
			y: ship_y - 32 - 5,
			vx: frand() * 2 - 1,
			vy: -10 + rand()%4,
			col: rand()%128 + 100,
			on: true
		};
		current_bullet%=num_bullets;
	}
}	

function drawBullets(){
	for (var c = 0; c < num_bullets; c++){
		var b = bullets[c];
		if (!b.on) continue;
		line(canvas, b.x, b.y, b.x-b.vx*4, b.y-b.vy*4, makecol(255, 255, b.col), 8);
	}
}


function main(){
	enable_debug('debug');
	allegro_init_all("game_canvas", 640, 480);
	ship = load_bmp("ship.png");
	ready(function(){
		init();
		loop(function(){
			clear_to_color(canvas,makecol(0,0,0));
			update();
			draw();
		},BPS_TO_TIMER(60));
	});
	return 0;
}
END_OF_MAIN();