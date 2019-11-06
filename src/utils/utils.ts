const defaultValue = (value, key?) => key;
export const objectToSelectItems = (
    object: object,
    value: (value: any, key: string) => any = defaultValue,
    text: (value: any, key: string) => string = defaultValue
) =>
    Object.keys(object).map(key => ({
        value: value(object[key], key),
        text: text(object[key], key),
    }));

const defaultArrayValue = (item) => item;
export const arrayToSelectItems = (
    array: any[],
    value: (item: any) => any = defaultArrayValue,
    text: (item: any) => string = defaultArrayValue
) =>
    array.map(item => ({
        value: value(item),
        text: text(item),
    }));

const defaultKey = ({name}) => name;
export const arrayToObject = (
    array: any[],
    key: (item: any) => string = defaultKey,
    value: (item: any) => any = defaultValue
) =>
    array.reduce((res, item) => ({
        ...res,
        [key(item)]: value(item),
    }), {});