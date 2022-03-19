declare module "worker-loader*" {
    class WebpackWorker extends Worker {
        constructor();
    }

    export = WebpackWorker;
}

declare module '*.wasm' {
    export = ArrayBuffer;
}

declare module '*.glsl' {
    const value: string
    export default value
}
