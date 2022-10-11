const fs = require('fs');
const Jimp = require('jimp');

async function getCroppedImage(imagePath, annotation, outputPath) {
    return new Promise((resolve, reject) => {

        Jimp.read(imagePath, (err, image) => {
            let croppedImage = image
                .clone()
                .crop(annotation.left, annotation.top, annotation.width, annotation.height)
                .write(outputPath);

            resolve(outputPath);
        });
    });
}

module.exports = getCroppedImage;

