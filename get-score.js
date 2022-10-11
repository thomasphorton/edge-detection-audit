const Jimp = require('jimp');

async function getScore(imagePath, threshold) {
    return new Promise((resolve, reject) => {

        let detections = 0;
        let pixels = 0;

        Jimp.read(imagePath, (err, image) => {
            image
                .scan(0, 0, image.bitmap.width, image.bitmap.height, function(x, y, idx) {
                    // x, y is the position of this pixel on the image
                    // idx is the position start position of this rgba tuple in the bitmap Buffer
                    // this is the image
                
                    var red = this.bitmap.data[idx + 0];
                    var green = this.bitmap.data[idx + 1];
                    var blue = this.bitmap.data[idx + 2];
                    
                    // if any channel data for the pixel is over the threshold, mark an edge detection
                    if (red > threshold || green > threshold || blue > threshold) {
                        detections++;
                    } 
                    
                    pixels++;
                })
                
                // score is the percentage of pixels in image marked as detections
                let score = ((detections/pixels)*100).toFixed(2);
                resolve(score);
        });
    });
}

module.exports = getScore;

// getScore(`./output/Traffic Sign Detection/5f127f5f3a6b100017232099/convoluted/7.jpg`, 8);