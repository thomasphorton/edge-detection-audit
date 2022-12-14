const Fs = require('fs');  
const Https = require('https');

/**
 * Download a file from the given `url` into the `targetFile`.
 *
 * @param {String} url
 * @param {String} targetFile
 *
 * @returns {Promise<void>}
 */
module.exports = async function downloadFile (url, targetFile) {  
  return await new Promise((resolve, reject) => {
    Https.get(url, response => {
      const code = response.statusCode ?? 0

      if (code >= 400) {
        return reject(new Error(response.statusMessage))
      }

      // handle redirects
      if (code > 300 && code < 400 && !!response.headers.location) {
        return downloadFile(response.headers.location, targetFile)
      }

      // save the file to disk
      const fileWriter = Fs
        .createWriteStream(targetFile)
        .on('finish', () => {
          resolve(targetFile)
        })

      response.pipe(fileWriter)
    }).on('error', error => {
      reject(error)
    })
  })
}