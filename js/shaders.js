// Vertex shader program
export const vsSource = `
void main() {
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4( position, 1.0 );
}
`;

// Fragment shader program stars
export const fsSourceStars = `
// BASE
uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;
uniform int u_stars_total;
uniform float u_stars_ra[500];
uniform float u_stars_dec[500];

mat2 Rotation(float angle) {
	float s=sin(angle), c=cos(angle);
	return mat2(c, -s, s, c);
}

float Star(vec2 uv, float flare, vec2 pos) {
	// MOVE
	uv -= pos;

	// Distance to center/pos
	// float d = distance(uv, pos);
	float dc = length(uv);
	float m = .002/dc;

	// DRAW STAR SPIKES
	float rays = max(0., .5-abs(uv.x*uv.y*100000.));
	m += rays*flare;
	uv *= Rotation(3.1415/4.);
	rays = max(0., .7-abs(uv.x*uv.y*10000.));
	m += rays*.3*flare;
	// DRAW STAR SPIKES END

	m *= smoothstep(1., .2, dc);
	return m*1.;
}

float Hash21(vec2 p){
	p = fract(p*vec2(123.34,456.21));
	p += dot(p, p+45.32);
	return fract(p.x*p.y);
}

void main() {
	// Normalized pixel coordinates
	vec2 uv = (gl_FragCoord.xy-.5*u_resolution.xy)/u_resolution.xy;
	uv *= 2.; // Size: -1 to 1

	// Black screen
	vec3 col = vec3(0,0,0);

	// Draw center star
	// col += Star(uv, 1., vec2(0.,0.));

	// DRAW ALL STARS
	for(int i = 0; i < u_stars_total; i++) {
		float n = Hash21(vec2(i,i)); // random
		float size = fract(n*345.32+0.8); // random size
		float star = Star(uv, smoothstep(.85, 1., size), vec2(u_stars_ra[i],u_stars_dec[i]));
		star *= sin(u_time*n*.75)*.5+.5;
		vec3 color = sin(vec3(.2, .2, .9)*fract(n*2345.2)*123.2)*.5+.5;
		color = color*vec3(1.,.6,.6); // NOT GREEN // BIGGER STAR BLUE
		col += star*size*color;
	}

	// RED CELL
	// for(int i = 0; i < u_stars_total; i++) {
	// 	if (uv.x-u_stars_ra[i]>.02 && uv.x-u_stars_ra[i]<.023){
	// 		if (uv.y-u_stars_dec[i]<.023 && uv.y-u_stars_dec[i]>-.023){
	// 			col.r = 1.;
	// 		}
	// 	}
	// 	if (-uv.x-u_stars_ra[i]>.02 && -uv.x-u_stars_ra[i]<.023){
	// 		if (uv.y-u_stars_dec[i]<.023 && uv.y-u_stars_dec[i]>-.023){
	// 			col.r = 1.;
	// 		}
	// 	}
	// 	if (uv.y-u_stars_dec[i]>.02 && uv.y-u_stars_dec[i]<.023){
	// 		if (uv.x-u_stars_ra[i]<.023 && uv.x-u_stars_ra[i]>-.023){
	// 			col.r = 1.;
	// 		}
	// 	}
	// 	if (-uv.y-u_stars_dec[i]>.02 && -uv.y-u_stars_dec[i]<.023){
	// 		if (uv.x-u_stars_ra[i]<.023 && uv.x-u_stars_ra[i]>-.023){
	// 			col.r = 1.;
	// 		}
	// 	}
	// }


	// Output to screen
    gl_FragColor = vec4(col,1.0);
}
`;

// Fragment shader program point
export const fsSourcePoints = `
// BASE
uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;
uniform int u_stars_total;
uniform float u_stars_ra[500];
uniform float u_stars_dec[500];

float Point(vec2 uv, vec2 pos) {
	// MOVE
	uv -= pos;

	// Distance to center/pos
	float dc = length(uv);
	float m = 0.;
	if (dc < 0.0025) m = 1.;

	return m;
}

void main() {
	// Normalized pixel coordinates
	vec2 uv = (gl_FragCoord.xy-.5*u_resolution.xy)/u_resolution.xy;
	uv *= 2.; // Size: -1 to 1

	// Black screen
	vec3 col = vec3(0,0,0);

	// DRAW ALL STARS
	for(int i = 0; i < u_stars_total; i++) {
		float point = Point(uv, vec2(u_stars_ra[i],u_stars_dec[i]));
		col += point;
	}

	// Output to screen
    gl_FragColor = vec4(col,1.0);
}
`;
