export class PointerStartValue {
    set;
    hide;
    visible = false;
    constructor() {
        const elem = document.createElement('div');
        document.body.appendChild(elem);

        // elem.style.cssText = `position:absolute;bottom:${y}px;left:${x}px;opacity:1;z-index:100;font-family: monospace;}`;



        this.set = (x, y) => {
            this.visible = true;
            // elem.innerText= '.';
            elem.style.cssText = `border-top: 2px solid red; width: 2px; height: 2px;position:absolute;top:${y}px;left:${x}px;opacity:1;z-index:100;font-family: monospace; pointer-events: none;}`;
        };

        this.hide = (x, y) => {
            this.visible = false;
            elem.style.cssText = `border-top: 2px solid red; width: 2px; height: 2px;position:absolute;top:${y}px;left:${x}px;opacity:1;z-index:100;font-family: monospace; pointer-events: none;}`;
        };
    }
}

export const startPoint = new PointerStartValue();