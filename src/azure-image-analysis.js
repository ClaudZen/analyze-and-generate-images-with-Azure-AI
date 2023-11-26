import { ComputerVisionClient } from '@azure/cognitiveservices-computervision';
import { ApiKeyCredentials } from '@azure/ms-rest-js';

const uriBase = process.env.REACT_APP_API_URL_AI_ANALIZER_IMAGE;
const key = process.env.REACT_APP_API_KEY_AI_ANALIZER_IMAGE;

// Cognitive service features
const visualFeatures = [
    "Description",
    "Tags",
];

// Computer Vision detected Printed Text
const includesText = async (tags) => {
    return tags.filter((el) => {
        return el.name.toLowerCase() === "text";
    });
}
// Computer Vision detected Handwriting
const includesHandwriting = async (tags) => {
    return tags.filter((el) => {
        return el.name.toLowerCase() === "handwriting";
    });
}
// Wait for text detection to succeed
const wait = (timeout) => {
    return new Promise(resolve => {
        setTimeout(resolve, timeout);
    });
}

export async function analizedImage(url) {

    // authenticate to Azure service
    const computerVisionClient = new ComputerVisionClient(
        new ApiKeyCredentials({ inHeader: { 'Ocp-Apim-Subscription-Key': key } }), uriBase);

    // analyze image
    const analysis = computerVisionClient.analyzeImage(url, { visualFeatures });

    // text detected - what does it say and where is it
    if (includesText(analysis.tags) || includesHandwriting(analysis.tags)) {
        analysis.text = await readTextFromURL(computerVisionClient, url);
    }

    // all information about image
    return { "URL": url, ...analysis };
}

async function readTextFromURL(client, url) {
    
    let result = await client.read(url);
    let operationID = result.operationLocation.split('/').slice(-1)[0];

    // Wait for read recognition to complete
    // result.status is initially undefined, since it's the result of read
    const start = Date.now();
    console.log(`${start} -${result?.status} `);
    
    while (result.status !== "succeeded") {
        await wait(500);
        console.log(`${Date.now() - start} -${result?.status} `);
        result = await client.getReadResult(operationID);
    }
    
    // Return the first page of result. 
    // Replace[0] with the desired page if this is a multi-page file such as .pdf or.tiff.
    return result.analyzeResult; 
}