const defaultValue = (value, key?) => key;
export const objectToSelectItems = (
    object: object,
    value: (value: any, key: string) => any = defaultValue,
    text: (value: any, key: string) => string = defaultValue,
    withNull?: boolean,
    nullText?: string
) => {
    const items = Object.keys(object).map(key => ({
        value: value(object[key], key),
        text: text(object[key], key),
    }));

    return withNull
        ? [{
            value: null,
            text: nullText || "-"
        }, ...items] : items;

};

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


export const enumToSelectItems = (
    object: object,
    value: (value: any, key: string) => any = value => value,
    text: (value: any, key: string) => string = value => value
) =>
    Object.keys(object).map(key => ({
        value: value(object[key], key),
        text: text(object[key], key),
    }));