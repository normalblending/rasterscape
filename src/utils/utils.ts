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

export interface SelectItem {
    value
    text
}

const defaultArrayValue = (item) => item;
export const arrayToSelectItems = (
    array: any[],
    value: (item: any) => any = defaultArrayValue,
    text: (item: any) => string = defaultArrayValue
): SelectItem[] =>
    array?.map(item => ({
        value: value(item),
        text: text(item),
    })) || [];

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

export function randomInteger(min, max) {
    var rand = min - 0.5 + Math.random() * (max - min + 1);
    rand = Math.round(rand);
    return rand;
}

export const randomZ = () => {
    const size0 = randomInteger(4, 11);

    let s = "";
    for (let i = 0; i < size0; i++) {
        const ff = randomInteger(1, 20) > 10;
        s += ff ? "Z" : "z"
    }

    return s;

};

const tosSzZ = (string, offset) => string
    .split(((0 + offset) % 4).toString()).join("z")
    .split(((1 + offset) % 4).toString()).join("s")
    .split(((2 + offset) % 4).toString()).join("k")
    .split(((3 + offset) % 4).toString()).join("i");
const tozZsS = (string, offset) => string
    .split(((0 + offset) % 4).toString()).join("s")
    .split(((1 + offset) % 4).toString()).join("z")
    .split(((2 + offset) % 4).toString()).join("S")
    .split(((3 + offset) % 4).toString()).join("z");


let offset = 0;
export const dateZs = () => {

    const date = new Date();

    let f;

    if (date.getDay() === 4) {
        f = tozZsS;
    } else if (date.getDay() === 4) {
        f = tozZsS;
    } else {
        f = tosSzZ;
    }

    offset = (offset + 1) % 4;

    return f(date.getTime().toString(4), 0);

};