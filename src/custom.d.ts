declare module "worker-loader*" {
    class WebpackWorker extends Worker {
        constructor();
    }

    export = WebpackWorker;
}

declare module '*.wasm' {
    function wasmBuilderFunc<T>(importsObject?: WebAssembly.Imports): Promise<{ instance: WebAssembly.Instance & { exports: T } }>;

    export = wasmBuilderFunc;
}
