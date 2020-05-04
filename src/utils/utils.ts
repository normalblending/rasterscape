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


export const toFixed2 = value => value.toFixed(2);
export const toFixed0 = value => value.toFixed(0);


// Returns a function, that, when invoked, will only be triggered at most once
// during a given window of time. Normally, the throttled function will run
// as much as it can, without ever going more than once per `wait` duration;
// but if you'd like to disable the execution on the leading edge, pass
// `{leading: false}`. To disable execution on the trailing edge, ditto.
export function throttle(func, wait, options?) {
    var context, args, result;
    var timeout = null;
    var previous = 0;
    if (!options) options = {};
    var later = function() {
        previous = options.leading === false ? 0 : Date.now();
        timeout = null;
        result = func.apply(context, args);
        if (!timeout) context = args = null;
    };
    return function() {
        var now = Date.now();
        if (!previous && options.leading === false) previous = now;
        var remaining = wait - (now - previous);
        context = this;
        args = arguments;
        if (remaining <= 0 || remaining > wait) {
            if (timeout) {
                clearTimeout(timeout);
                timeout = null;
            }
            previous = now;
            result = func.apply(context, args);
            if (!timeout) context = args = null;
        } else if (!timeout && options.trailing !== false) {
            timeout = setTimeout(later, remaining);
        }
        return result;
    };
}


export function getRandomColor() {
    // return "black";
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}