#version 300 es

in vec4 a_Position;
in vec2 a_TexCoord;
out vec2 v_TexCoord;
out mat4 v_xformMatrix;
uniform mat4 u_xformMatrix;

void main() {
    v_xformMatrix = u_xformMatrix;
    gl_Position = a_Position;
    v_TexCoord = a_TexCoord;
}