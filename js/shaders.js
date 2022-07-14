// Vertex shader program
export const vsSource = `
void main() {
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4( position, 1.0 );
}
`;

// Fragment shader program
export const fsSource = `
// BASE
uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;
uniform vec2 u_center;

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
	float m = .01/dc;

	// DRAW STAR SPIKES
	float rays = max(0., .5-abs(uv.x*uv.y*1000.));
	m += rays*flare;
	uv *= Rotation(3.1415/4.);
	rays = max(0., .7-abs(uv.x*uv.y*10000.));
	m += rays*.3*flare;
	// DRAW STAR SPIKES END

	m *= smoothstep(1., .2, dc);
	return m;
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

	// TEST
	vec2 test_star_pos = vec2(1.,1.);
	col += Star(uv, 0., test_star_pos);

	// Draw center star
	col += Star(uv, 1., vec2(0.,0.));

	// MAKE VARIOS // DELETE
	vec2 gv = fract(uv)-.5; // TODO: make uniform
	vec2 id = floor(uv);
	// MAKE VARIOS TEST 1
	// float n = Hash21(id); // random
	// col += Star(gv-(vec2(n, fract(n*34.))-.5), 1.);
	// MAKE VARIOS TEST 2
	for(int y=-1; y<=1; y++) {
		for(int x=-1; x<=1; x++) {
			vec2 offs = vec2(x, y);
			float n = Hash21(id+offs); // random
			float size = fract(n*345.32);
			float star = Star(gv-offs-vec2(n, fract(n*34.))+.5, smoothstep(.85, 1., size), vec2(0.,0.));
			star *= sin(u_time*3.*n*1.2831)*.5+.5; // Desaparecer -> change 1.2831

			// vec3 color = sin(vec3(.2, .3, .9)*fract(n*2345.2)*6.2831)*.5+.5;
			vec3 color = sin(vec3(.2, .2, .9)*fract(n*2345.2)*123.2)*.5+.5;
			color = color*vec3(1,.2,1.+size); // NOT GREEN // BIGGER STAR BLUE
			col += star*size*color;
		}
	}

	// GRILL // FIX
	// if (gv.x>.48 || gv.y>.48) col.r = 1.;

	// Output to screen
    gl_FragColor = vec4(col,1.0);
}
`;
