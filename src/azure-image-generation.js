import { Configuration, OpenAIApi } from "openai";

const organization = process.env.REACT_APP_API_ORGANIZATION_OPEN_AI;
const key = process.env.REACT_APP_API_KEY_OPEN_AI;

export async function generateImage(text) {
    console.log(key);
    const configuration = new Configuration({
        organization: organization,
        apiKey: key,
    });
    const openai = new OpenAIApi(configuration);

    const response = await openai.createImage({
        model: "dall-e-3",
        prompt: text,
        n: 1,
        size: "1024x1024",
    });

    return { "prompt": text, "URL": response.data.data[0].url };
}

export function isConfigured() {
    if (!process.env.REACT_APP_API_ORGANIZATION_OPEN_AI || !process.env.REACT_APP_API_KEY_OPEN_AI) {
        return false;
    }

    return true;
}