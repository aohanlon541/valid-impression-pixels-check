const csv = require('csv-parser')
const fs = require('fs')
const fetch = require("node-fetch");

// Function to GET by URL and returns object with URL as the key and status as value
function checkUrl(url) {
    return new Promise((res) => {
        fetch(url)
            .then(resp => resp.status)
            .then((status) => res({ [url]: status }))
            .catch(() => res({ [url]: 'error' }));
    });
}

// Function to ensure the pixel URL is valid
function validUrl(str) {
    try {
        const url = new URL(str);
        return true;
    }
    catch {
        return false;
    }
}

// Executes calls of all valid and returns counts of successful and failed counts and pixel URLs.
async function makeCalls(urls, pixelCount) {
    const invalidUrls = urls
        .filter(u => !validUrl(u));

    let successCount = 0;
    let failedCount = invalidUrls.length;
    let failedUrls = [...invalidUrls];

    const promises = urls
        .filter(u => validUrl(u))
        .slice(0, pixelCount-1)
        .map(u => checkUrl(new URL(u)));

    console.log("Processing... ");
    console.log("This may take time for large datasets.")

    await Promise.all(promises).then(v => {
        v.map(response =>
            Object.entries(response).forEach(([key, value, index]) => {
                if (value.toString().includes('2') || value.toString().includes('3'))
                    successCount++;
                else {
                    failedCount++;
                    failedUrls.push(key)
                }
            }));
    }).catch(err => console.log(err));

    return { successCount, failedCount, failedUrls };
}

// Cleans data from the CSV.
async function processData(pixelCount) {
    return new Promise(res => {
        let cleanedData = [];

        fs.createReadStream('tl_tactic.csv')
            .pipe(csv())
            .on('data', (data) => {
                let impressionPixelArray = data['impression_pixel_json'];
                if (impressionPixelArray !== '[]' && impressionPixelArray !== 'NULL') {
                    impressionPixelArray = impressionPixelArray.substring(1, impressionPixelArray.length - 1).replace(/"/g, '');
                    impressionPixelArray = impressionPixelArray.split('","');
                    cleanedData.push(...impressionPixelArray);
                }
            })
            .on('end', async () => {
                console.log("CSV successfully processed. Making GET calls now.")
                const results = await makeCalls(cleanedData, pixelCount);
                res(results);
            });
    });
}

// Function to kick off pixel validation.
async function executePixelValidation() {
    const arg = process.argv.splice(1,1)
    const pixelCount = isNaN(parseInt(arg)) ? 10 : parseInt(arg);
    let results = await processData(pixelCount);
    console.log("COMPLETE! Results:")
    console.log({ 'OK Pixel Count': results.successCount, 'Failed Pixel Count': results.failedCount, 'Failed Pixels': results.failedUrls });
    return results;
}

module.exports = {
    processData: processData,
    executePixelValidation: executePixelValidation
};