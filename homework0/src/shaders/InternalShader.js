const LightCubeVertexShader = `
attribute vec3 aVertexPosition;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;


void main(void) {

  gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aVertexPosition, 1.0);

}
`;

const LightCubeFragmentShader = `
#ifdef GL_ES
precision mediump float;
#endif

uniform float uLigIntensity;
uniform vec3 uLightColor;

void main(void) {
    
  //gl_FragColor = vec4(1,1,1, 1.0);
  gl_FragColor = vec4(uLightColor, 1.0);
}
`;
const VertexShader = `
attribute vec3 aVertexPosition;
attribute vec3 aNormalPosition;
attribute vec2 aTextureCoord;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

varying highp vec3 vFragPos;
varying highp vec3 vNormal;
varying highp vec2 vTextureCoord;

void main(void) {

  vFragPos = aVertexPosition;
  vNormal = aNormalPosition;

  gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aVertexPosition, 1.0);

  vTextureCoord = aTextureCoord;

}
`;

const FragmentShader = `
#ifdef GL_ES
precision mediump float;
#endif

uniform int uTextureSample;
uniform vec3 uKd;
uniform sampler2D uSampler;
uniform vec3 uLightPos;
uniform vec3 uCameraPos;

varying highp vec3 vFragPos;
varying highp vec3 vNormal;
varying highp vec2 vTextureCoord;

void main(void) {
  
  if (uTextureSample == 1) {
    gl_FragColor = texture2D(uSampler, vTextureCoord);
  } else {
    gl_FragColor = vec4(uKd,1);
  }

}
`;
/**
指定着色器的默认浮点数精度为 mediump（中等精度）
uTextureSample：决定是否使用纹理（1 表示使用纹理，0 表示不使用纹理）。
uLightIntensity：光源的强度。
uKd：材质的漫反射反射系数（vec3），表示物体对漫反射光的响应。
uKs：材质的镜面反射反射系数（vec3），表示物体对镜面反射光的响应。
uSampler：纹理采样器，用于采样纹理图像。
uLightPos：光源的位置。
uCameraPos：摄像机的位置。 

uTextureSample == 1，则从纹理中采样颜色，并对其进行伽马校正
如果 uTextureSample != 1，则使用 uKd，即材质的漫反射颜色。

ambient用一个常量表示环境光
漫反射光根据光源方向和表面法线的点积计算。diff 是光照强度，light_atten_coff 是光照衰减系数，考虑了光源与片段之间的距离。diffuse 是漫反射光的最终颜色。
镜面反射光根据视角方向和反射方向的点积计算（反射方向通过 reflect 函数计算）。spec 是镜面反射光的强度，specular 是镜面反射的颜色。

环境光、漫反射光和镜面反射光相加得到最终的颜色值。为了恢复到显示器的颜色空间，使用伽马校正（pow(..., vec3(1.0 / 2.2))）。
gl_FragColor 是片段着色器的输出颜色，代表当前片段的最终颜色。
*/
const PhongVertexShader = `
attribute vec3 aVertexPosition;
attribute vec3 aNormalPosition;
attribute vec2 aTextureCoord;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

varying highp vec3 vFragPos;
varying highp vec3 vNormal;
varying highp vec2 vTextureCoord;

void main(void) {

  vFragPos = aVertexPosition;
  vNormal = aNormalPosition;

  gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aVertexPosition, 1.0);

  vTextureCoord = aTextureCoord;

}
`;

const PhongFragmentShader = `
#ifdef GL_ES
precision mediump float;
#endif

uniform int uTextureSample;
uniform float uLightIntensity;
uniform vec3 uKd;
uniform vec3 uKs;
uniform sampler2D uSampler;
uniform vec3 uLightPos;
uniform vec3 uCameraPos;

varying highp vec3 vFragPos;
varying highp vec3 vNormal;
varying highp vec2 vTextureCoord;

void main(void) {
  vec3 color;
  if (uTextureSample == 1) {
    color =pow( texture2D(uSampler, vTextureCoord).rgb,vec3(2.2));
  } else {
   color=uKd;
  }
  
  vec3 ambient=0.05*color;
  vec3 lightDir = normalize(uLightPos - vFragPos);
  vec3 normal = normalize(vNormal);
  float diff = max(dot(lightDir , normal), 0.0);
  float light_atten_coff = uLightIntensity / length(uLightPos - vFragPos);
  vec3 diffuse = diff * light_atten_coff * color;

  vec3 viewDir = normalize(uCameraPos - vFragPos);
  float spec = 0.0;
  vec3 reflectDir = reflect(-lightDir, normal);
  spec = pow (max(dot(viewDir, reflectDir), 0.0), 35.0);
  vec3 specular = uKs * light_atten_coff * spec;
  gl_FragColor = vec4(pow((ambient + diffuse + specular), vec3(1.0/2.2)), 1.0);
}
`;
