import run from "./gemini";

async function geminiResponse(prompt, setPromptText, speak, setResponseImg) {
    try {
        console.log('Sending prompt to Gemini:', prompt);
        let response = await run(prompt);

        console.log('Raw response from Gemini:', response);
        if (!response) {
            throw new Error('Empty response from Gemini');
        }

        response = response.replace(/\*/g, ''); // Remove asterisks
        console.log('Cleaned response:', response);

        // Update text and speak
        setPromptText(response);
        speak(response);
        setResponseImg(true);
    } catch (error) {
        console.error('Error in Gemini response:', error);
        const errorMessage = 'Sorry, I encountered an error. Please try again.';
        setPromptText(errorMessage);
        speak(errorMessage);
        setResponseImg(true);
    }
}


  export default geminiResponse;