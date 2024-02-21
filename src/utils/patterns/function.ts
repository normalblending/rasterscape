export interface FunctionState<V, P> {
    value: V
    params: P
}

export const getFunctionState = <V, P>(initialValue: V, initialParams: P) =>
    (state?: FunctionState<V, P>, params?: P): FunctionState<V, P> => {
        // if (!enabled)
        //     return;

        return {
            value: state ? state.value : initialValue,
            params: params
                ? (state ? {
                    ...state.params,
                    ...params
                } : {
                    ...initialParams,
                    ...params
                })
                : (state ? state.params : initialParams)
        };
    };
