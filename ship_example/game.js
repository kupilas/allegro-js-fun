var ship_x,ship_y;
var ship,bug,explosion;

var particles = [];
var current_particle=0,num_particles=256;

var bullets = [];
var current_bullet=0,num_bullets=128;

var enemies = [];
var current_enemy=0,enemy_rows=4,enemy_cols=12,num_enemies=enemy_rows*enemy_cols;

var stars = [],num_stars=128;

function HSVtoRGB(h, s, v) {
    var r, g, b, i, f, p, q, t;
    if (arguments.length === 1) {
        s = h.s, v = h.v, h = h.h;
    }
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }
    return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255)
    };
}

function draw()
{
	
	for (var c=0;c<num_stars;c++) circlefill(canvas,stars[c].x,stars[c].y,stars[c].r,makecol(255,255,255));
	
	for (var c=0;c<num_bullets;c++) 
	{
		var b=bullets[c];
		if (!b.on) continue;
		line(canvas,b.x,b.y,b.x-b.vx*4,b.y-b.vy*4,makecol(255,255,b.col),8);
	}
	
	for (var c=num_particles-1;c>=0;c--) 
	{
		var p=particles[c];
		if (!p.on) continue;
		//circlefill(canvas,p.x,p.y,p.r,getpixel(explosion,p.col,0));
		var col=HSVtoRGB(.05,Math.sin(p.s),p.v);
		
		circlefill(canvas,p.x,p.y,p.r,makecol(col.r,col.g,col.b));
	}
	
	draw_sprite(canvas,ship,ship_x,ship_y);
	
	var num_enemies_dead=0;
	for (var c=0;c<num_enemies;c++) 
	{
		if (!enemies[c].on) 
		{
			num_enemies_dead++;
			continue;
		}
		draw_sprite(canvas,bug,enemies[c].x,enemies[c].y);
	}
	
	if (num_enemies_dead==num_enemies) add_enemies();
	
}

function explode(x,y)
{
	for (var c=0;c<20;c++)
	{
		var a = frand()*Math.PI*2;
		var d = frand()*frand()*8;
		var p=particles[current_particle];
		p.vx = Math.cos(a)*d;
		p.vy = Math.sin(a)*d;
		p.r = frand()*10+10;
		p.on=true;
		p.h=0;
		p.s=0;
		p.v=1;
		p.x = x+p.vx;
		p.y = y+p.vy;
		current_particle++;
		current_particle = current_particle%num_particles;
	}
}



function update()
{
	if (key[KEY_UP]) ship_y-=4;
	if (key[KEY_DOWN]) ship_y+=4;
	if (key[KEY_LEFT]) ship_x-=4;
	if (key[KEY_RIGHT]) ship_x+=4;
	if (key[KEY_SPACE])
	{
		bullets[current_bullet++] = {x:ship_x,y:ship_y-32-5,vx:frand()*2-1,vy:-10+rand()%4,col:rand()%128+100,on:true};
		current_bullet%=num_bullets;
	}
	for (var c=0;c<num_bullets;c++) 
	{
		if (!bullets[c].on) continue;
		bullets[c].x+=bullets[c].vx;
		bullets[c].y+=bullets[c].vy;
		if (bullets[c].y<0) bullets[c].on=false;
	}
	
	for (var c=0;c<num_particles;c++) 
	{
		var p = particles[c];
		if (!p.on) continue;
		p.x+=p.vx;
		p.y+=p.vy;
		p.vy+=.3;
		//p.col = lerp(p.col,0,.1);
		p.s+=Math.PI*.03;
		p.v-=.03;
		if (p.s>Math.PI) p.s=Math.PI;
		if (p.v<0.2) p.v=0.2;
		p.r = lerp(p.r,0,.02);
		if (p.r<.5) p.on=false;
	}
	
	for (var c=0;c<num_enemies;c++) 
	{
		var e = enemies[c];
		if (!e.on) continue;
		e.time+=e.speed;
		e.wobble = Math.cos(e.time);
		e.x+=e.wobble*2;
		for (var i=0;i<num_bullets;i++) 
		{
			var b=bullets[i];
			if (!b.on) continue;
			if (distance2(b.x,b.y,e.x,e.y)<40*40) 
			{
				e.on=false;
				b.on=false;
				explode(Math.floor(e.x),Math.floor(e.y));
			}
		}
	}
	
	for (var c=0;c<num_stars;c++) 
	{
		stars[c].y+=stars[c].vy;
		if (stars[c].y>SCREEN_H+stars[c].r) stars[c].y=-stars[c].r;
	}
	

}

function add_enemies()
{
	for (var c=0;c<num_enemies;c++) 
	{
		var col = c%enemy_cols;
		var row = Math.floor(c/enemy_cols);
		enemies[c] = 
			{x:SCREEN_W/(enemy_cols+1)*(col+1),
			y:40+40*row,
			wobble:0,
			time:0,
			speed:.05+frand()*.1,
			on:true};
	}
}

function init()
{
	for (var c=0;c<num_bullets;c++) bullets[c] = {x:0,y:0,vx:0,vy:0,on:false};
	for (var c=0;c<num_particles;c++) particles[c] = {x:0,y:0,vx:0,vy:0,r:0,on:false};
	for (var c=0;c<num_stars;c++) stars[c] = {x:rand()%SCREEN_W,y:rand()%SCREEN_H,vy:2+frand()*8,r:.5+frand()*4};
	add_enemies();
	ship_x = SCREEN_W/2;
	ship_y = SCREEN_H-100;
}

function main()
{
	enable_debug('debug');
	allegro_init_all("game_canvas", 640, 480);
	ship = load_bmp("ship.png");
	bug = load_bmp("bug.png");
	explosion = load_bmp("explosion.png");
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

 