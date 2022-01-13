import {EdgeMode, EdgeModeASMap, MirrorMode, SlitMode, StackType} from "./index";

export interface CameraServiceInitParams {

    width: number;
    height: number;
    device: MediaDeviceInfo;
}

export class CameraService {

    isOn: boolean;
    isPause: boolean;

    width: number;
    height: number;

    stream: MediaStream;

    videoElement: HTMLVideoElement;
    canvasElement: HTMLCanvasElement;
    canvasContext: CanvasRenderingContext2D;
    device: MediaDeviceInfo;

    init(params: CameraServiceInitParams) {
        this.width = params.width;
        this.height = params.height;

        this.device = params.device;

        this.videoElement = document.createElement('video');
        this.videoElement.width = this.width;
        this.videoElement.height = this.height;

        this.canvasElement = document.createElement('canvas');
        this.canvasElement.width = this.width;
        this.canvasElement.height = this.height;
        this.canvasContext = this.canvasElement.getContext('2d');
    }

    async start() {
        this.isOn = true;

        this.stream = await this.getMediaStreamToVideoElement(this.device, this.videoElement);

    }

    stop() {
        this.isOn = false;
        this.isPause = false;

        this.stopMediaStreamVideo(this.stream, this.videoElement);
    }

    pause() {
        this.isPause = true;
    }
    resume() {
        this.isPause = false;

    }

    receiveImageDataData = (): Uint8ClampedArray | null => {
        if (this.isOn) {
            this.canvasContext.drawImage(this.videoElement, 0, 0);
            return this.canvasContext.getImageData(0, 0, this.width, this.height).data;
        } else {
            return null;
        }
    };

    async setDevice(device: MediaDeviceInfo) {
        this.device = device;
        if (this.isOn) {
            this.stop();

            await this.start();
        }
    }


    async getMediaStreamToVideoElement(device?: MediaDeviceInfo, element?: HTMLVideoElement | null): Promise<MediaStream> {
        if (device) {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: device ? {
                    deviceId: device?.deviceId,
                    width: this.width,
                    height: this.height
                } : true
            });

            if (element) {
                element.srcObject = stream;
                element.play();
            }
            return stream;
        } else {
            return null
        }
    }

    stopMediaStreamVideo(stream: MediaStream, element?: HTMLVideoElement | null) {
        if (element) {
            element.pause();
            element.srcObject = null;
        }
        stream.getTracks().forEach(track => track.stop());

        return null;
    }
}
