shader_type canvas_item;
render_mode unshaded;
uniform sampler2D screen_texture : hint_screen_texture, repeat_disable, filter_linear;
uniform float shot_time = 0.0;
void fragment() {
	vec3 color = texture(screen_texture, SCREEN_UV).rgb;
	vec2 centered = SCREEN_UV * 2.0 - 1.0;
	float vignette = 1.0 - 0.10 * smoothstep(0.25, 1.8, dot(centered, centered));
	float grain = fract(sin(dot(FRAGCOORD.xy + floor(shot_time * 24.0), vec2(12.9898, 78.233))) * 43758.5453) - 0.5;
	COLOR = vec4(color * vignette + grain * 0.012, 1.0);
}
