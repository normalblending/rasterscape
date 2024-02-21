export const readImageFile = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            var img = new Image();
            img.onload = () => {
                resolve(img);
            };
            img.onerror = reject;
            img.src = event.target.result as string;
        };
        if (file) {
            reader.readAsDataURL(file);
        } else {
            reject();
        }
    });
};