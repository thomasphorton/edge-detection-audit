# Edge Detection Audit for Annotated Images 

This script pulls performs edge detection on annotated bounding boxes to warn if an annotation does not contain useful data.

At a high level, it:

* pulls the Scale project results
* for each task within the project, it downloads the image
* for each annotation within the task, it 
    * creates a cropped image of the annotated bounding box
    * processes the image (edge detection, further cropping)
    * scores the image for "edge percentage" and flags low scores for review

## Examples
Using the following image:
![original image](/examples/output/original.jpg)

### High Score, No Warning
```
{
    "label":"policy_sign",
    "attributes":{
        "occlusion":"0%",
        "truncation":"0%",
        "background_color":"white"
    },
    "uuid":"fdae05b8-a506-4a8f-9e5b-44006f24b1f7",
    "width":54,
    "height":72,
    "geometry":"box",
    "left":1439,
    "top":627
},
```

1. Resulting Cropped Image
![Cropped Image](/examples/output/cropped/1.jpg)

2. Resulting Processed Image
![Processed Image](/examples/output/convoluted/1.jpg)

3. Edge Detection Score: **45.12%**


### Low Score (Mark for review)
```
{
    "label":"traffic_control_sign",
    "attributes":{
        "occlusion":"0%",
        "truncation":"0%",
        "background_color":"red"
    },
    "uuid":"da493933-bb23-4179-a3ce-16c2b8b14d8c",
    "width":29,
    "height":41,
    "geometry":"box",
    "left":374,
    "top":589
},
```

1. Resulting Cropped Image
![Cropped Image](/examples/output/cropped/3.jpg)

2. Resulting Processed Image
![Processed Image](/examples/output/convoluted/3.jpg)

3. Edge Detection Score: **2.90%**


## Audit outputs
Images for each step of the pipeline are saved to `/output/${projectName}/` for review

Project-level warning files are generated at `/output/${projectName}/warnings.json`

## Using this audit
Clone the repository
Install dependencies with `npm i`
Copy `api-keys.json.example` and update it with your live/test api keys
Update `projectName` and detection thresholds in `audit.js`
Run  `npm audit` in the console

## Future development
* Parameterize projectName and detection thresholds
* read detection thresholds from config file
* write tests
* cache images (don't download if the same image hash already exists)
* port to AWS step function/lambda functions for better parallelization
* save scores to database
* create frontend with audit scores/warnings/histograms

## other audit ideas/scratchpad
warning: small bounding box
warning: large bounding box
overlapping bounding boxes
truncation should be near edges
occlusion should be near other bounding boxes

warning: potential occlusion mislabel
bounding boxes should not overlap without occlusion on at least one of the objects
5f127f671ab28b001762c204

warning: not enough contrast in bounding box
bounding box contains pixels very similar to each other

load image

for each bounding box

get center pixel rgb value
convert rgb to hsl
for each pixel in image
     if not center pixel
         get rgb value
         convert rgb to hsl
         find hsl distance
         if under threshold
             mark pixel as 'similar'
             add to 'similar count'

 if similarCount is higher than threshold
     throw warning


## pricing
s3 get requests = $0.0004/1K requests
s3 data transfer = $0.09/GB

http://host.robots.ox.ac.uk/pascal/VOC/voc2011/guidelines.html

https://observesign.s3-us-west-2.amazonaws.com/traffic_sign_2.jpg
