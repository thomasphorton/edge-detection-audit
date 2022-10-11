const Jimp = require('jimp');
const kernels = require('./kernels');

async function processImage(imagePath, outputPath) {
    return new Promise((resolve, reject) => {

        Jimp.read(imagePath, (err, image) => {
            if (err) {
                reject(err);
            };
        
            // considered using .greyscale() before convolution
            image
                // apply edge detection convolution
                // https://docs.gimp.org/2.6/en/plug-in-convmatrix.html
                .convolute(kernels.edgeDetection.laplacian)

                // crop image to remove border artifacts
                .crop(1, 1, image.bitmap.width -1, image.bitmap.height -1)

                // save image for review
                .write(outputPath);

            resolve(outputPath);
        });
    })
}

module.exports = processImage;

// processImage(`./output/Traffic Sign Detection/5f127f6f26831d0010e985e5/cropped/0.jpg`, `./output/Traffic Sign Detection/5f127f6f26831d0010e985e5/foo/0.jpg`)