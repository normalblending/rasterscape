


export function randomInteger(min, max) {
    let rand = min - 0.5 + Math.random() * (max - min + 1);
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


export function throttled(delay, fn) {
    let lastCall = 0;
    return function (...args) {
        const now = (new Date).getTime();
        if (now - lastCall < delay) {
            return;
        }
        lastCall = now;
        return fn(...args);
    }
}