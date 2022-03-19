import {PixelsStack} from "../../../../video/_old/capture/pixelStack";
import {createProgram} from "./shadersUtils";
import default_frag from './shaders/default/frag.glsl';
import default_vert from './shaders/default/vert.glsl';
import {coordHelper4, coordHelper5} from "../../../../../../components/Area/canvasPosition.servise";

export class ShaderVideoModule {
    pixelStack: PixelsStack;
    canvas: HTMLCanvasElement
    gl: WebGL2RenderingContext;
    context: CanvasRenderingContext2D;

    constructor() {
        this.canvas = document.createElement('canvas');
    }

    async instantiate(): Promise<ShaderVideoModule> {

        return this;
    }

    init(width: number, height: number, depth: number, pushSide: number, edgeMode: number): ShaderVideoModule {
        this.canvas.width = width;
        this.canvas.height = height;
        this.gl = this.canvas.getContext('webgl2');
        this.context = this.canvas.getContext('2d');

        document.body.appendChild(this.canvas);

        this.pixelStack = new PixelsStack(width, height, depth, pushSide, edgeMode)

        return this;
    }

    defaultCutFunction(
        imageData: Uint8ClampedArray | null,
        width: number,
        height: number,
        direction: number,
        mirror: number,
        cutOffset: number,
    ): Uint8ClampedArray {
        imageData && this.pixelStack.push(imageData);

        coordHelper5.setText('----', imageData?.[10]);
        const gl = this.gl;

        // const texture = gl.createTexture();
        // gl.activeTexture(gl.TEXTURE0);
        // gl.bindTexture(gl.TEXTURE_3D, texture);
        // gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_BASE_LEVEL, 0);
        // gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_MAX_LEVEL, Math.log2(width));
        // gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
        // gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        //
        // gl.texImage3D(
        //     gl.TEXTURE_3D,  // target
        //     0,              // level
        //     gl.R8,        // internalformat
        //     this.pixelStack.width,           // width
        //     this.pixelStack.height,           // height
        //     this.pixelStack.depth,           // depth
        //     0,              // border
        //     gl.RGBA,         // format
        //     gl.UNSIGNED_BYTE,       // type
        //     this.pixelStack.data            // pixel
        // );
        //
        // gl.generateMipmap(gl.TEXTURE_3D);

        const program = createProgram(gl, default_vert, default_frag);

        // получить локейшен атрибута
        const positionAttributeLocation = gl.getAttribLocation(program, "a_position");

        //создать буфер который будем класть в атрибут
        const positionBuffer = gl.createBuffer();

        //когда мы биндим какой то ресурс , это значит что все функции дальше будут использовать этот ресурс
        // в данном случаем биндим наш буфер к бинд поинту ARRAY_BUFFER
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

        //пишем данные в текущий привязанный буфер positionBuffer
        gl.bufferData(
            gl.ARRAY_BUFFER,
            new Float32Array([
                0.0, 0.0,
                0.0, 0.5,
                0.9,  0.0,
                // 1.0,  1.0,
                // -1.0,  1.0,
                // -1.0, -1.0,
            ]),
            gl.STATIC_DRAW //gl.STATIC_DRAW tells WebGL we are not likely to change this data much.
        );

        // создаем Vertex Array Object чтобы сказать атрибуту как брать значения из буфера
        const vao = gl.createVertexArray();

        // делаем наш VertexArray текущим
        gl.bindVertexArray(vao);

        // включаем наш аттрибут по его локейшену. иначе его значение будет константой
        gl.enableVertexAttribArray(positionAttributeLocation);

        // определяем как атрибут будет брать данные из текущего привязанного буфера (после этого можно будет привязывать другой буфер)
        const size = 2;          // 2 components per iteration
        const type = gl.FLOAT;   // the data is 32bit floats
        const normalize = false; // don't normalize the data
        const stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
        const offset = 0;        // start at the beginning of the buffer
        gl.vertexAttribPointer(
            positionAttributeLocation, size, type, normalize, stride, offset)

        //изначально координаты в webgl это [-1; 1], спомощью viewport мыы делаем мапинг координат в размеры канваса
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

        // Clear the canvas
        gl.clearColor(0, 0, 0, 0); // задали цвет очистки
        gl.clear(gl.COLOR_BUFFER_BIT);

        // Tell it to use our program (pair of shaders)
        gl.useProgram(program);

        // Bind the attribute/buffer set we want.
        gl.bindVertexArray(vao);


        //и тееперь мы наконец вызываем рисование наших буферов

        // это значит что каждые три итерации вершинного шейдера будут рисовать новый треугольник
        var primitiveType = gl.TRIANGLES;
        var drawOffset = 0;
        var count = 3;
        gl.drawArrays(primitiveType, drawOffset, count);




        const pixel = new Uint8ClampedArray(width * height * 4);
        gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, pixel);

        coordHelper4.setText(pixel.length);

        return pixel;
    }
}
