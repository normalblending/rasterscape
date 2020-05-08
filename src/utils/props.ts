export const whyDidYouRender = (props, prevProps, string) => {
    console.log(string, Object.keys(props).reduce((res, key) => ({
        ...res,
        [key]: prevProps[key] !== props[key]
    }), {}));
};