import {base64ToImage} from "./canvas/helpers/imageData";

export const getImageDataFromClipboard = (event, callback) => {
    const items = event.clipboardData.items;
    for (let index in items) {
        const item = items[index];
        if (item.kind === 'file') {
            const blob = item.getAsFile();
            const reader = new FileReader();
            reader.onload = async function (event) {
                const image = await base64ToImage(event.target.result.toString());
                callback(image);
            };
            reader.readAsDataURL(blob);
        }
    }
}


declare class ClipboardItem {
    constructor(data: { [mimeType: string]: Blob });
}

export async function copyToClipboard(pngBlob) {
    try {
        await navigator.clipboard['write']([
            new ClipboardItem({
                [pngBlob.type]: pngBlob
            })
        ]);
        console.log("Image copied");
    } catch (error) {
        console.error(error);
    }
}
