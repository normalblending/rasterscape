export interface CanvasPosition {
    x: number
    y: number
    patternId: string
}

export const position = {
    x: 0,
    y: 0,
    patternId: null
};

export const setPosition = (x: number, y: number, patternId: string) => {
    position.x = x;
    position.y = y;
    position.patternId = patternId;
};

export class CursorHelper {
    setPos;
    constructor(color, size) {
        const elem = document.createElement('div');
        document.body.appendChild(elem);

        this.setPos = (x, y) => {
            elem.style.cssText = `position:absolute;top:${y - size/2}px;left:${x - size/2}px;width:${size}px;height:${size}px;opacity:1;z-index:100;background: ${color}; pointer-events: none;}`;
        };
    }
}

export class TextHelper {
    setText;
    getText;
    write;
    writeln;
    clear;
    constructor(x, y) {
        const elem = document.createElement('div');
        document.body.appendChild(elem);

        elem.style.cssText = `position:absolute;bottom:${y}px;right:${x}px;opacity:1;z-index:100;font-family: monospace;}`;

        this.setText = (...string) => {
            elem.innerText = string.join(' ');
        };
        this.write = (...string) => {
            elem.innerText = elem.innerText + ' ' + string.join(' ');
        };
        this.writeln = (...string) => {
            try {
                elem.innerText = elem.innerText + ' ' + string.join(' ') + '\n';
            } catch (e) {

            }

        };
        this.clear = () => {
            elem.innerText = '';
        };
        this.getText = () => {
            return elem.innerText;
        };
        elem.addEventListener('mouseup', () => {
            this.setText('');
        })
    }
}

export const redHelper = new CursorHelper('#f00', 10);
export const blueHelper = new CursorHelper('#00f', 10);
export const greenHelper = new CursorHelper('#0f0', 10);

export const coordHelper = new TextHelper(10, 30);
export const coordHelper2 = new TextHelper(10, 50);
export const coordHelper3 = new TextHelper(10, 70);
export const coordHelper4 = new TextHelper(10, 90);
export const coordHelper5 = new TextHelper(10, 100);







// const elem = document.createElement('div');
// document.body.appendChild(elem);
//
// elem.style.cssText = `position:absolute;top:${0}px;left:${0}px;opacity:1;z-index:100;width:${300}px; height:${300}px; border: 1px solid rgba(0,0,0,.3)`;
