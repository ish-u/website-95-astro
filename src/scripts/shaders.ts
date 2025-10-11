const DRACULA = `
const float PI = 3.14;
mat2 rotationMatrix(float angle)
{
	angle *= PI / 180.0;
    float s=sin(angle), c=cos(angle);
    return mat2( c, -s, 
                 s,  c );
}

float circle(vec2 uv, vec2 center, float r, float k) {
    return smoothstep(r, r + k, length(uv - center));
}


void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 uv = (2.0 * fragCoord - iResolution.xy) / iResolution.y;
    
    
    vec3 backgroundColor = vec3(0.980, 0.980, 0.945); 
    float pulse = 0.9 + 0.2 * pow(sin(iTime * 2.0) * 0.5 + 0.5, 2.0);
    vec3 circleColor = vec3(0.255, 0.408, 0.882) * pulse; 
    
    uv *= rotationMatrix(iTime * 50.);    
    uv *= 10. + (2. * sin(abs(uv.x * uv.y) + iTime));
    if(mod(iTime,2.0) < 1.0){
        if(mod(uv.y,2.0) < 1.0){
            uv.x += (iTime);
         } else {
            uv.x -= (iTime);
        }
     } else {
       if(mod(uv.x,2.0) > 1.0){
            uv.y += (iTime);
         } else {
            uv.y -= (iTime);
        }
    }
     
    uv = fract(uv);
    
    vec3 col = vec3(circle(uv, vec2(0.5, 0.5), 0.25, 0.0));
    
    fragColor = vec4(mix(backgroundColor, circleColor, col),1.0);
}
`;

const SHADERS = [DRACULA];
export default SHADERS;
