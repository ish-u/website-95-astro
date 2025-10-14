const DRACULA = `const float PI = 3.14;
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

const SPEAK_TO_ME = `float sdSegment(vec2 p, vec2 a, vec2 b) {
    vec2 pa = p - a;
    vec2 ba = b - a;
    float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
    return length(pa - ba * h);
}

float checkInsideTriangle(vec2 uv,vec2 v0, vec2 v1, vec2 v2){
    // Baycentric method to check for a point inside triangle
    vec2 v0v1 = v1 - v0;
    vec2 v0v2 = v2 - v0;
    vec2 v0p = uv - v0;
    
    float d00 = dot(v0v1, v0v1);
    float d01 = dot(v0v1, v0v2);
    float d11 = dot(v0v2, v0v2);
    float d20 = dot(v0p, v0v1);
    float d21 = dot(v0p, v0v2);
    
    float denom = d00 * d11 - d01 * d01;
    float v = (d11 * d20 - d01 * d21) / denom;
    float w = (d00 * d21 - d01 * d20) / denom;
    float u = 1.0 - v - w;
    
    float inside = step(0.0, min(min(u, v), w));
    return inside;
}

float getRay(vec2 uv, vec2 rayStart, vec2 rayEnd, float startWidth, float endWidth){
    // Compute how far along the segment the point is
    float t = clamp(dot(uv - rayStart, normalize(rayEnd - rayStart)) /
                length(rayEnd - rayStart), -0.0, 1.0);
    // Interpolate width along the segment
    float variableWidth = mix(startWidth, endWidth, t);
    float ray = 1.0 - step(variableWidth, sdSegment(uv, rayStart, rayEnd));
    
    return ray;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    // Normalized pixel coordinates (from -2 to 2)
    vec2 uv = (2.0 * fragCoord - iResolution.xy) / iResolution.y;
        
    // Triangle 
    float radius = 0.75;
    vec2 center = vec2(0, 0);
    vec2 v0 = center + radius * vec2(cos(radians(90.0)), sin(radians(90.0)));
    vec2 v1 = center + radius * vec2(cos(radians(210.0)), sin(radians(210.0)));
    vec2 v2 = center + radius * vec2(cos(radians(330.0)), sin(radians(330.0)));
    float triangle = checkInsideTriangle(uv,v0, v1, v2);
      
    // Left Ray
    vec2 leftRayStart = vec2(-2,-0.1);
    vec2 leftRayEnd =  mix(v0, v1, 0.45);
    float leftRay = 1.0 - step(0.01, sdSegment(uv, leftRayStart, leftRayEnd));
    leftRay *= (1.0 - triangle);

    // Right Rays
    vec2 offset = vec2(0.01, 0.0);
    float V = getRay(uv, mix(v0 ,v2, 0.60) - offset, vec2(2.1, -0.40), 0.02, 0.030);
    float B = getRay(uv, mix(v0 ,v2, 0.56) - offset, vec2(2.2, -0.36), 0.018, 0.028);
    float G = getRay(uv, mix(v0 ,v2, 0.52) - offset, vec2(2.3, -0.32), 0.02, 0.035);
    float Y = getRay(uv, mix(v0 ,v2, 0.48) - offset, vec2(2.4, -0.28), 0.02, 0.035);
    float O = getRay(uv, mix(v0 ,v2, 0.44) - offset, vec2(2.5, -0.24), 0.02, 0.035);
    float R = getRay(uv, mix(v0 ,v2, 0.40) - offset, vec2(2.6, -0.20), 0.02, 0.035);
    if(uv.x <= triangle){
        V = 0.0;
        B = 0.0;
        G = 0.0;
        Y = 0.0;
        O = 0.0;
        R = 0.0;
    }
    vec3 rightRays = V * vec3(0.500, 0.000, 0.500) +
                     B * vec3(0.0078,0.773,0.950)  +
                     G * vec3(0.404, 0.808, 0.000) +
                     Y * vec3(1.000, 1.000, 0.000) +
                     O * vec3(1.000, 0.500, 0.000) +
                     R * vec3(1.000, 0.000, 0.000);

        
    // Distance to triangle edges
    float d0 = sdSegment(uv, v0, v1);
    float d1 = sdSegment(uv, v1, v2);
    float d2 = sdSegment(uv, v2, v0);
    float edgeWidth = 72. / iResolution.y; // thickness of the border line
    // Check if point is near any of the edges
    float edge = min(min(d0, d1), d2);
    float border = smoothstep(edgeWidth, 0.0, edge);
    
    // Inside triangle
    v0 = leftRayEnd;
    v0.x -= 0.05;
    v1 = vec2(leftRayEnd.x + 0.35, leftRayEnd.y + 0.08);
    v2 = vec2(leftRayEnd.x + 0.45, leftRayEnd.y - 0.15);
    float smallTriangleInside = checkInsideTriangle(uv, v0, v1, v2);
    float gradientT = clamp((uv.x - v0.x) / (v1.x - v0.x), 0.0, 1.0);
    vec3 smallTriangleGradient = mix(vec3(1.5), vec3(0.005), gradientT);
    vec3 borderColor = vec3(0.570, 0.625, 0.684);
    
    vec3 color = vec3(0.0);
    color = max(color, rightRays);
    color = max(color, max(leftRay * vec3(1.0), smallTriangleGradient * smallTriangleInside));
    color = max(color, borderColor * min(border, triangle));
    
    fragColor = vec4(color,1.0);
    
}
`;

const GRID = `// Ref - https://www.shadertoy.com/view/4llXD7
float sdBox( in vec2 p, in vec2 b )
{
    vec2 d = abs(p)-b;
    return length(max(d,0.0)) + min(max(d.x,d.y),0.0);
}

// Ref - https://www.shadertoy.com/view/Nt23Dc
vec3 hash32(vec2 p) {
	vec3 p3 = fract(vec3(p.xyx) * vec3(.1031, .1030, .0973));
    p3 += dot(p3, p3.yxz+33.33);
    return fract((p3.xxy+p3.yzz)*p3.zyx);
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    float blur = 1.5/iResolution.y;
    vec2 uv = (2.0 * fragCoord - iResolution.xy) / iResolution.y;
    vec2 uv0 = uv;
    uv *= 4.;
    uv = fract(uv);
    
    vec2 boxId = ceil(uv0* 4.);
    vec3 colorA = hash32(boxId);
    vec3 colorB = hash32(1. - boxId);
    float blend = abs(sin(colorA.x * colorA.y + iTime));
    vec3 baseColor = mix(colorA,colorB, blend);

    float box = sdBox(uv - vec2(0.5),vec2(0.49));
    box = smoothstep(blur,0.,box);
    vec3 boxColor = box * baseColor;
    
    float circleRadius = 0.05;
    float circle = 1.- smoothstep(circleRadius, circleRadius + blur ,distance(uv, vec2(0.0,0.0)));
    circle += 1.- smoothstep(circleRadius, circleRadius + blur ,distance(uv, vec2(1.0,1.0)));
    circle += 1.- smoothstep(circleRadius, circleRadius + blur ,distance(uv, vec2(0.0,1.0)));
    circle += 1.- smoothstep(circleRadius, circleRadius + blur ,distance(uv, vec2(1.0,0.0)));

    vec3 circleColor = mix(vec3(0.),vec3(1.), 1.);

    fragColor = vec4(mix(boxColor,circleColor, circle),1.0);
}`;

const FRACTAL_CIRCLES = `// cosine based palette, 4 vec3 params
vec3 palette(float t)
{
    
    vec3 a = vec3(0.049, 0.109, 0.662);
    vec3 b = vec3(0.408, 0.456 ,0.077);
    vec3 c = vec3(0.564, 0.367 ,0.556);
    vec3 d = vec3(2.722, 2.609, 5.063);

    return a + b*cos( 6.28318*(c*t+d) );
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 uv = fragCoord/iResolution.xy * 2.0 - 1.0;
    uv.x *= iResolution.x / iResolution.y;
    
    vec3 finalColor = vec3(0.0);
    
    vec2 uv0 = uv;
    
    for(float i = 0.0; i < 2.0; i++){
    

        uv = fract(uv*2.) - 0.5;
        //uv *= 2.0;
        //uv = fract(uv);
        //uv -= 0.5;

        // vec3 col = vec3(1.0,2.0,3.0);

        // float d = length(uv) - 0.5;
        float d = length(uv) * exp(-length(uv0));

        //vec3 col = palette(d + iTime);
        vec3 col = palette(length(uv0) + i*.8 + iTime*0.8);


        d = sin(d*8. + iTime)/8.;
        d = abs(d);

        // d = smoothstep(0.0,0.1,d);
        d = pow(0.03 / d, 3.0);

        finalColor += col * d;
    }
    fragColor = vec4(finalColor,1.0);
}`;

const WAVES = `float plotPower(vec2 st, float pct){
  float blur = 24. / iResolution.y;
  return smoothstep(blur, 0.0, abs(st.y - pct));
}


vec3 colorA = vec3(0.980, 0.980, 0.945);
vec3 colorB = vec3(0.255, 0.408, 0.882);

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
     vec2 uv = (2.0 * fragCoord - iResolution.xy) / iResolution.y;
     uv *= 4.;
     uv = fract(uv);
     uv /= 0.5;
     uv.y -= 0.5;
     float y = abs(sin(uv.x + iTime));
     float pct = plotPower(uv, y);
     float toggle = step(0.0, sin(.9/0.5 + iTime));
     vec3 background = toggle == 0. ? colorA: colorB;
     vec3 wave = toggle != 0. ? colorA: colorB;
     vec3 color = mix(background, wave, pct);
     fragColor = vec4(color,1.0);
}`;

const SHADERS: Record<string, string> = {
  DRACULA: DRACULA,
  GRID: GRID,
  SPEAK_TO_ME: SPEAK_TO_ME,
  FRACTAL_CIRCLES: FRACTAL_CIRCLES,
  WAVES: WAVES,
};
export default SHADERS;
