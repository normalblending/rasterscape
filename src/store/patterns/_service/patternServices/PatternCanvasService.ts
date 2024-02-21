import {PatternService} from "../PatternService";
import {resizeImageData} from "../../../../utils/canvas/helpers/imageData";
import {coordHelper5, imageDataDebug} from "../../../../components/Area/canvasPosition.servise";

export class PatternCanvasService {
    patternService: PatternService

    _imageData?: ImageData;

    canvas?: HTMLCanvasElement;
    context?: CanvasRenderingContext2D;

    constructor(patternService: PatternService) {
        this.patternService = patternService;
    }

    setSavedImageData = (imageData: ImageData): PatternService => {
        this._imageData = imageData;
        return this.patternService;
    };

    setCanvasImageData = (imageData: ImageData, width?: boolean, height?: boolean): PatternService => {
        if (width)
            this.canvas.width = imageData.width
        if (height)
            this.canvas.height = imageData.height

        this.context?.putImageData(imageData, 0, 0);
        return this.patternService;
    };

    setImageData = (imageData: ImageData, width?: boolean, height?: boolean): PatternService => {
        if (this.canvas) {
            this.setCanvasImageData(imageData, width, height);
        } else {
            this.setSavedImageData(imageData);
        }
        return this.patternService;
    };


    setCanvasElement = (canvas: HTMLCanvasElement): PatternService => {
        if (!this.canvas && this._imageData) {
            this.canvas = canvas;
            this.context = canvas.getContext('2d');

            this.setCanvasImageData(this._imageData, true, true);
            this._imageData = null;
        } else {
            this.canvas = canvas;
            this.context = canvas.getContext('2d');
        }

        return this.patternService;
    }

    resetCanvasElement = (): PatternService => {
        this._imageData = this.getImageData();
        this.canvas = null;
        this.context = null;
        return this.patternService;
    }

    setCanvas = (canvas?: HTMLCanvasElement): PatternService => {
        if (canvas) {
            this.setCanvasElement(canvas);
        } else {
            this.resetCanvasElement();
        }

        return this.patternService;
    };


    setSize = (width: number, height: number, noStretch?: boolean): PatternService => {
        if (this.canvas) {
            const imageData = resizeImageData(
                this.getImageData(),
                width,
                height,
                noStretch
            );
            return this.setCanvasImageData(imageData, true, true);

        } else if (this._imageData) {
            const imageData = resizeImageData(
                this.getImageData(),
                width,
                height,
                noStretch
            );
            return this.setSavedImageData(imageData);
        }
    };

    setWidth = (width: number, noStretch?: boolean): PatternService => {
        if (this.canvas) {
            const imageData = resizeImageData(
                this.getImageData(),
                width,
                this.canvas.height,
                noStretch
            );
            return this.setCanvasImageData(imageData, true);

        } else if (this._imageData) {
            const imageData = resizeImageData(
                this.getImageData(),
                width,
                this._imageData.height,
                noStretch
            );
            return this.setSavedImageData(imageData);
        }
    };
    setHeight = (height: number, noStretch: boolean): PatternService => {
        if (this.canvas) {

            const imageData = resizeImageData(
                this.getImageData(),
                this.canvas.width,
                height,
                noStretch
            );
            return this.setCanvasImageData(imageData, false, true);
        } else if (this._imageData) {
            const imageData = resizeImageData(
                this.getImageData(),
                this._imageData.width,
                height,
                noStretch
            );
            return this.setSavedImageData(imageData);
        }
    };


    getImageData = (): ImageData | undefined => {
        return this.context
            ? this.context.getImageData(0, 0, this.canvas.width, this.canvas.height)
            : this._imageData;
    }
    getCanvas = (): HTMLCanvasElement => this.canvas;
    getContext = (): CanvasRenderingContext2D => this.context;
}
