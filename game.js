var buzz, splat, deaths;
var x = 100,y = 100;

function loadAssets()
{
	buzz = load_bmp('buzz.png');
	splat = load_bmp('splat.png');
	deaths = create_bitmap(SCREEN_W,SCREEN_H);
}

function draw()
{
	// textout(canvas,font,"Hello World!",x,y,24,makecol(0,0,0));
	simple_blit(deaths,canvas,0,0);
	draw_sprite(canvas,buzz,x,y);
}

function update()
{
	x += rand()%5-2;
	y += rand()%5-2;

	if (mouse_pressed)
	{
	    if (distance(x,y,mouse_x,mouse_y)<50)
	    {
	        rotate_sprite(deaths,splat,x,y,rand()%360);
	        x = rand()%SCREEN_W;
	        y = rand()%SCREEN_H;
	    }
	}
}


function main()
{
	enable_debug('debug');
	allegro_init_all("game_canvas", 640, 480);
	loadAssets();

	ready(function(){
		loop(function(){
			clear_to_color(canvas,makecol(255,255,255));
			update();
			draw();
		},BPS_TO_TIMER(60));
	});
	return 0;
}
END_OF_MAIN();

 