const fs = require('fs');
const sdk = require('api')('@scale-ai/v1.1#xj1m535l8xk48lb');

const keys = require('./api-keys.json');
const getCroppedImage = require('./get-cropped-image');
const processImage = require('./process-image');
const downloadFile = require('./download-file');
const getScore = require('./get-score');

let projectName = 'Traffic Sign Detection'
let scoreThreshold = 10;
let edgeThreshold = 4;

// add pagination later
async function getTasksInProject(projectName, nextToken) {
    return new Promise((resolve, reject) => {
        sdk.auth(keys.live);
        sdk.listMultipleTasks({
            type: 'annotation',
            status: 'completed',
            project: projectName,
            limit: '100',
            include_attachment_url: 'true'
        })
        .then(res => {
            resolve(res.docs);
        })
        .catch(err => console.error(err));
    });
}

audit = async(projectName) => {
    let tasks = await getTasksInProject(projectName);

    let warnings = [];

    let tasksPromises = tasks.map(async (task) => {
        return new Promise(async (resolve, reject) => {
            let taskId  = task.task_id;
            let imageUrl = task.params.attachment;

            fs.mkdirSync(`./output/${projectName}/${taskId}/`, {recursive: true})
            let originalImagePath = await downloadFile(imageUrl, `./output/${projectName}/${taskId}/original.jpg`);
            
            let annotations = task.response.annotations;
            fs.mkdirSync(`./output/${projectName}/${taskId}/cropped/`, {recursive: true})
            fs.mkdirSync(`./output/${projectName}/${taskId}/convoluted/`, {recursive: true})

            let annotationsPromises = annotations.map((annotation, idx) => {
                return new Promise(async (resolve, reject) => {
                    let croppedImagePath = await getCroppedImage(originalImagePath, annotation, `./output/${projectName}/${taskId}/cropped/${idx}.jpg`);
        
                    let convolutedImagePath = await processImage(croppedImagePath, `./output/${projectName}/${taskId}/convoluted/${idx}.jpg`)
        
                    let score = await getScore(convolutedImagePath, edgeThreshold);
        
                    let result = {
                        projectName,
                        taskId,
                        idx,
                        score
                    }

                    if (score < scoreThreshold) {
                        console.log(`warning: low score detected (${taskId}:${idx}:${score})`)
                        warnings.push(result);
                    }
        
                    resolve(result);
                })
            })

            Promise.all(annotationsPromises)
                .then((results) => {
                    results.sort((a, b) => {
                        if (a.idx < b.idx) {
                            return -1
                        } else {
                            return 1
                        }
                    })

                    resolve(results);
                })
        })
    })

    Promise.all(tasksPromises)
        .then(results => {
            // console.log(warnings);
            fs.writeFileSync(`./output/${projectName}/warnings.json`, JSON.stringify(warnings));
        })
}

audit(projectName);
