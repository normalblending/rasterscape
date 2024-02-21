type i8 = number;
type i16 = number;
type i32 = number;
type i64 = bigint;
type isize = number;
type u8 = number;
type u16 = number;
type u32 = number;
type u64 = bigint;
type usize = number;
type f32 = number;
type f64 = number;
type bool = boolean | number;
export enum Direction {
  FRONT,
  BACK,
  TOP,
  BOTTOM,
  LEFT,
  RIGHT,
}
export class PixelsStack {
  static wrap(ptr: usize): PixelsStack;
  valueOf(): usize;
  width: i32;
  height: i32;
  depth: i32;
  oneFrameLength: i32;
  data: usize;
  pushSide: i32;
  edgeMode: i32;
  GetFrameN: usize;
  queueOffset: i32;
  constructor(width: i32, height: i32, depth: i32, pushSide: i32, edgeMode: i32);
  setPushSide(pushSide: i32): void;
  setEdgeMode(mode: i32): void;
  setDepth(depth: i32): void;
  getPixel(x: i32, y: i32, zNormalized: f32): usize;
  push(pixels: usize): void;
}
export function init(width: i32, height: i32, depth: i32, pushSide: i32, edgeMode: i32): void;
export function setDepth(depth: i32): void;
export function paraboloidCutFunction(imageDataArray: usize, width: i32, height: i32, direction: i32, mirror: i32, kx: f32, ky: f32, kz: f32, dz: f32): usize;
export var numberParamsByFunctionType: usize;
export function getNumberParam(type: usize, name: usize): i32;
export function setNumberParam(type: usize, name: usize, value: i32): i32;
export var arrayParamsByFunctionType: usize;
export function getArrayParam(type: usize, name: usize): usize;
export function setArrayParam(type: usize, name: usize, value: usize): usize;
export var Int32Array_ID: u32;
export var Uint8ClampedArray_ID: u32;
export const memory: WebAssembly.Memory;
export function __new(size: usize, id: u32): usize;
export function __pin(ptr: usize): usize;
export function __unpin(ptr: usize): void;
export function __collect(): void;
export const __rtti_base: usize;
export const __setArgumentsLength: ((n: i32) => void) | undefined;
