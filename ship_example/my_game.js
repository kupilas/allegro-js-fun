var ship;

var ship_x,ship_y;


function update(){
	updateShipMovement();
}


function draw(){
	draw_sprite(canvas, ship, ship_x, ship_y);
}


function init(){
	ship_x = SCREEN_W/2;
	ship_y = SCREEN_H-100;
}


function updateShipMovement(){
	if (key[KEY_UP]) ship_y-=4;
	if (key[KEY_DOWN]) ship_y+=4;
	if (key[KEY_LEFT]) ship_x-=4;
	if (key[KEY_RIGHT]) ship_x+=4;
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