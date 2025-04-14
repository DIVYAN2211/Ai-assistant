import getWeather from "./getWeather";
import searchWeb from "./searchWeb";
import geminiResponse from "./geminiResponse";
import searchYoutube from "./searchYoutube";

function customCommands(
  command,
  setPromptText,
  speak,
  setResponseImg,
  setIsStopped,
  abortAll // callback to stop everything
) {
  const lowerCmd = command.toLowerCase().trim();

  if (
    lowerCmd.startsWith("open") &&
    (lowerCmd.includes("in youtube") || lowerCmd.includes("on youtube") || lowerCmd.includes("youtube"))
  ) {
    const query = lowerCmd
      .replace("open", "")
      .replace("in youtube", "")
      .replace("on youtube", "")
      .replace("youtube", "")
      .trim();

    searchYoutube(query);
    const response = `Opening YouTube for ${query}\nI'll search for videos about: ${query}`;
    setPromptText(response);
    speak(response);
    setResponseImg(true);
  } else if (lowerCmd.startsWith("open")) {
    const website = lowerCmd.replace("open", "").trim();
    const knownWebsites = {
      google: "https://www.google.com",
      youtube: "https://www.youtube.com",
      facebook: "https://www.facebook.com",
      twitter: "https://twitter.com",
      x: "https://twitter.com",
      instagram: "https://www.instagram.com",
      linkedin: "https://www.linkedin.com",
      github: "https://github.com",
    };

    const domainKey = website.replace(/\s+/g, "");
    if (knownWebsites[domainKey]) {
      window.open(knownWebsites[domainKey], "_blank");
      const response = `Opening ${domainKey} for you.\nI've opened ${knownWebsites[domainKey]} in a new tab.`;
      setPromptText(response);
      speak(response);
      setResponseImg(true);
    } else if (website.includes(".com") || website.includes("www")) {
      const fullUrl = website.startsWith("http") ? website : `https://${website}`;
      window.open(fullUrl, "_blank");
      const response = `Opening ${website}\nI've opened ${fullUrl} in a new tab.`;
      setPromptText(response);
      speak(response);
      setResponseImg(true);
    } else {
      searchWeb(website);
      const response = `Searching Google for: ${website}\nI'll show you the search results for this query.`;
      setPromptText(response);
      speak(response);
      setResponseImg(true);
    }
  } else if (lowerCmd.includes("search for")) {
    const query = lowerCmd.replace("search for", "").trim();
    searchWeb(query);
    const response = `Searching Google for: ${query}\nI'll show you the search results for this query.`;
    setPromptText(response);
    speak(response);
    setResponseImg(true);
  } else if (lowerCmd.includes("search on youtube for")) {
    const query = lowerCmd.replace("search on youtube for", "").trim();
    searchYoutube(query);
    const response = `Searching YouTube for: ${query}\nI'll find relevant videos about this topic.`;
    setPromptText(response);
    speak(response);
    setResponseImg(true);
  } else if (lowerCmd.includes("weather in")) {
    const city = lowerCmd.replace("weather in", "").trim();
    const correctCity = city.charAt(0).toUpperCase() + city.slice(1).replace(/[^\w\s]/g, '');

    getWeather(correctCity).then((response) => {
      setPromptText(response);
      speak(response);
      setResponseImg(true);
    });
  } else if (lowerCmd.includes("time")) {
    const time = new Date().toLocaleTimeString();
    const response = `The current time is: ${time}`;
    setPromptText(response);
    speak(response);
    setResponseImg(true);
  } else if (lowerCmd.includes("date")) {
    const date = new Date().toLocaleDateString();
    const response = `Today's date is: ${date}`;
    setPromptText(response);
    speak(response);
    setResponseImg(true);
  } else if (lowerCmd === "read document about you" || lowerCmd === "read doc" || lowerCmd.includes("read document")) {
    const docContent = `Welcome to SenseRoute AI Assistant Documentation.

Here's how you can interact with me:

1. Opening Websites:
   • Say 'Open' followed by the website name
   • Examples: 'Open YouTube', 'Open Google', 'Open Facebook'
   • I'll open it in your browser

2. Web Searching:
   • Say 'Search for' + what you want to find
   • Examples: 'Search for javascript tutorials', 'Search for recipes'
   • I'll show you Google search results

3. Weather Information:
   • Say 'Weather in' + city name
   • Examples: 'Weather in Mumbai', 'Weather in Delhi'
   • I'll tell you current weather conditions

4. Date and Time:
   • Ask 'What is date' for today's date
   • Ask 'What is time' for current time

5. YouTube Search:
   • Say 'Search on YouTube for' + topic
   • Examples: 'Search on YouTube for cooking', 'Search on YouTube for music'
   • I'll find videos for you

6. General Questions:
   • Ask me anything!
   • I'll try my best to help

Voice Control:
• Say 'Stop' to stop any action
• Say 'Resume' or 'Start again' to continue

I'm here to help! Just speak naturally and I'll understand.`;
    setPromptText(docContent);
    speak(docContent);
    setResponseImg(true);
  } else if (lowerCmd === "stop") {
    if (abortAll) abortAll();
    window.speechSynthesis.cancel();
    setPromptText("Stopped all actions.");
    speak("Okay, I’ve stopped everything.");
    setResponseImg(false);
    if (setIsStopped) setIsStopped(true);
  } else if (lowerCmd === "resume" || lowerCmd === "start again") {
    setPromptText("Resuming listening.");
    speak("I'm listening again.");
    setResponseImg(false);
    if (setIsStopped) setIsStopped(false);
  } else if (!lowerCmd.startsWith('please') && !lowerCmd.startsWith('correct')) {
    console.log("Sending to Gemini:", command);
    setPromptText("Thinking...");
    setResponseImg(true);

    geminiResponse(command, setPromptText, speak, setResponseImg).catch((err) => {
      console.error("Gemini error:", err);
      const errorMessage = "Sorry, I had trouble processing that. Please try again.";
      setPromptText(errorMessage);
      speak(errorMessage);
      setResponseImg(true);
    });
  }
}

export default customCommands;
