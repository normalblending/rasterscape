export function getOffset(elem: HTMLElement) {
    if (elem.getBoundingClientRect) {
        // "правильный" вариант
        return getOffsetRect(elem)
    } else {
        // пусть работает хоть как-то
        return getOffsetSum(elem)
    }
}

export function getOffsetSum(elem) {
    let top=0, left=0;
    while(elem) {
        top = top + parseInt(elem.offsetTop);
        left = left + parseInt(elem.offsetLeft);
        elem = elem.offsetParent;
    }

    return {top: top, left: left, box: null}
}

export function getOffsetRect(elem) {
    // (1)
    let box = elem.getBoundingClientRect();

    // (2)
    let body = document.body;
    let docElem = document.documentElement;

    // (3)
    let scrollTop = window.pageYOffset || docElem.scrollTop || body.scrollTop;
    let scrollLeft = window.pageXOffset || docElem.scrollLeft || body.scrollLeft;

    // (4)
    let clientTop = docElem.clientTop || body.clientTop || 0;
    let clientLeft = docElem.clientLeft || body.clientLeft || 0;

    // (5)
    let top  = box.top +  scrollTop - clientTop;
    let left = box.left + scrollLeft - clientLeft;

    return { top: Math.round(top), left: Math.round(left), box }
}
