// Vertex shader program
export const vsSource = `
void main() {
    gl_Position = vec4( position, 1.0 );
}
`;

// Fragment shader program
export const fsSource = `
// BASE
uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;
// PLAYGROUND
// GRILL
uniform float u_grill;
uniform bool u_grill_active;

// GENERAL
uniform float u_general_speed_x;
uniform float u_general_speed_y;

// CELL
uniform bool u_cell_show_color;
uniform float u_cell_r;
uniform float u_cell_g;
uniform float u_cell_b;
uniform bool u_field_show_color;
uniform float u_field_r;
uniform float u_field_g;
uniform float u_field_b;
/// ISOLINE
uniform bool u_isoline_show_color;
uniform float u_isoline_size;
uniform float u_isoline_opacity;
// CELL CENTER
uniform bool u_point_active;
uniform float u_point_size;
uniform float u_point_r;
uniform float u_point_g;
uniform float u_point_b;
uniform float u_point_a;
uniform float u_point_gradient;
uniform bool u_point_additive;
// Mouse
uniform bool u_mouse_as_point;
uniform bool u_mouse_hungry;
uniform float u_mouse_hungry_radius;

vec2 random2( vec2 p ) {
    return fract(sin(vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3))))*43758.5453);
}

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    st.x *= u_resolution.x/u_resolution.y;
    vec2 vel = vec2(-u_general_speed_x,-u_general_speed_y) * u_time/10.;
    st += vel;
    vec3 color = vec3(.0);

    // Scale
    st *= u_grill;

    // Tile the space
    vec2 i_st = floor(st);
    vec2 f_st = fract(st);

    float m_dist = 10.;  // minimum distance
    vec2 m_point;        // minimum point

    for (int j=-1; j<=1; j++ ) {
        for (int i=-1; i<=1; i++ ) {
            vec2 neighbor = vec2(float(i),float(j));
            vec2 point = random2(i_st + neighbor);
            point = 0.5 + 0.5*sin(u_time + 6.2831*point);
            vec2 diff = neighbor + point - f_st;
            float dist = length(diff);

            if( dist < m_dist ) {
                m_dist = dist;
                m_point = point;
            }
        }
    }

    // MOUSE AS POINT
    vec2 mouse = u_mouse/u_resolution;
    mouse += vel;
    mouse *= u_grill;
    float mouse_dist = distance(st, mouse);
    if (u_mouse_as_point) {
        if( mouse_dist < m_dist ) {
            m_dist = mouse_dist;
            m_point = 0.5 + 0.5*sin(u_time + 6.2831*(mouse-vel));
        }
    }

    // Assign a color using the closest point position
    // color += dot(m_point,vec2(.4,.6));
    if (u_cell_show_color) {
        color.r += dot(m_point,vec2(.4,.6))*u_cell_r;
        color.g += dot(m_point,vec2(.4,.6))*u_cell_g;
        color.b += dot(m_point,vec2(.4,.6))*u_cell_b;
    }

    // Add distance field to closest point center
    if (u_field_show_color) {
        color.r += m_dist * u_field_r;
        color.g += m_dist * u_field_g;
        color.b += m_dist * u_field_b;
    }

    // Show isolines
    if (u_isoline_show_color) {
        color -= abs(sin(u_isoline_size*m_dist))*u_isoline_opacity;
    }

    // Draw cell center
    highp int is_center = int(step(m_dist, u_point_size/100.));
    highp int mouse_interference = int(step(m_dist, mouse_dist/u_mouse_hungry_radius));
    if (u_point_active && bool(is_center)) {
        if(u_mouse_hungry){
            if(bool(mouse_interference)) {
                if (u_point_additive){
                    color.r += u_point_r*u_point_a*(1.-m_dist*u_point_gradient);
                    color.g += u_point_g*u_point_a*(1.-m_dist*u_point_gradient);
                    color.b += u_point_b*u_point_a*(1.-m_dist*u_point_gradient);
                } else {
                    color.r = u_point_r*u_point_a*(1.-m_dist*u_point_gradient);
                    color.g = u_point_g*u_point_a*(1.-m_dist*u_point_gradient);
                    color.b = u_point_b*u_point_a*(1.-m_dist*u_point_gradient);
                }
            }
        } else {
            if (u_point_additive){
                color.r += u_point_r*u_point_a*(1.-m_dist*u_point_gradient);
                color.g += u_point_g*u_point_a*(1.-m_dist*u_point_gradient);
                color.b += u_point_b*u_point_a*(1.-m_dist*u_point_gradient);
            } else {
                color.r = u_point_r*u_point_a*(1.-m_dist*u_point_gradient);
                color.g = u_point_g*u_point_a*(1.-m_dist*u_point_gradient);
                color.b = u_point_b*u_point_a*(1.-m_dist*u_point_gradient);
            }
        }
    }

    // Draw grid
    if (u_grill_active) {
        color.r += step(.98, f_st.x) + step(.98, f_st.y);
    }

    gl_FragColor = vec4(color,1.0);
}
`;
