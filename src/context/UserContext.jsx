import { createContext, useState, useEffect } from "react";
import customCommands from "../utils/customCommands";

export const DataContext = createContext();

const UserContext = ({ children }) => {
  const [speaking, setSpeaking] = useState(false);
  const [promptText, setPromptText] = useState("Say 'hello' to start...");
  const [responseImg, setResponseImg] = useState();
  const [isStopped, setIsStopped] = useState(false);

  // Initialize speech synthesis
  const synth = window.speechSynthesis;

  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = false;

  const WakeRecognition = new SpeechRecognition();
  WakeRecognition.continuous = true;
  WakeRecognition.interimResults = false;

  const speak = (text) => {
    if (!text) return;
    window.speechSynthesis.cancel(); // Cancel any ongoing speech
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.volume = 1;
    utterance.pitch = 1;
    utterance.rate = 1.1;

    utterance.onend = () => {
      setSpeaking(false);
      // Reset to default state after a delay
      setTimeout(() => {
        if (!speaking) {
          setPromptText("Say 'hello' or 'hey SenseRoute' to begin...");
          setResponseImg(false);
        }
      }, 3000);
    };

    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find((voice) =>
      voice.name.toLowerCase().includes("female")
    );
    utterance.voice = preferredVoice || voices[0];

    window.speechSynthesis.speak(utterance);

    utterance.onend = () => {
      setSpeaking(false);
      // Add a small delay before resetting the prompt
      setTimeout(() => {
        setPromptText("Say 'hello' or 'hey SenseRoute' to begin...");
      }, 3000); // 3 seconds delay to let user read the response

      if (!isStopped) {
        try {
          WakeRecognition.start();
        } catch (error) {
          console.log('Recognition already started, skipping restart');
        }
      }
    };
  };

  // Wake recognition
  WakeRecognition.onresult = (event) => {
    const transcript = event.results[event.resultIndex][0].transcript
      .toLowerCase()
      .trim();
    console.log("Wake word heard:", transcript);

    if (transcript === "stop") {
      console.log("🛑 Stopping everything from wake recognition");
      window.speechSynthesis.cancel();
      recognition.abort();
      WakeRecognition.abort();
      setPromptText("Stopped.");
      setSpeaking(false);
      setIsStopped(true);
      return;
    }

    if (
      !isStopped &&
      (transcript.includes("hello") || transcript.includes("hey sense route"))
    ) {
      WakeRecognition.stop();
      setPromptText("Listening...");
      setSpeaking(true);
      setResponseImg(false);
      recognition.start();
    }
  };

  WakeRecognition.onerror = (e) => console.error("Wake error:", e);

  // Main recognition
  recognition.onresult = (event) => {
    const command = event.results[event.resultIndex][0].transcript
      .toLowerCase()
      .trim();

    console.log("Main command:", command);

    // Handle stop word here as well
    if (command === "stop") {
      console.log("🛑 Stopping everything from main recognition");
      window.speechSynthesis.cancel();
      recognition.abort();
      WakeRecognition.abort();
      setPromptText("Stopped.");
      setSpeaking(false);
      setIsStopped(true);
      return;
    }

    setPromptText(command);
    setSpeaking(true);

    customCommands(
      command,
      setPromptText,
      speak,
      setResponseImg,
      setIsStopped,
      () => {
        recognition.abort();
        WakeRecognition.abort();
        setSpeaking(false);
      }
    );
  };

  recognition.onerror = (event) => {
    console.error("Recognition error:", event.error);
    setPromptText("Error listening. Try again.");
    setSpeaking(false);
    if (!isStopped) WakeRecognition.start();
  };

  recognition.onend = () => {
    console.log("Main recognition ended");
    setSpeaking(false);
    if (!isStopped) WakeRecognition.start();
  };

  useEffect(() => {
    WakeRecognition.start();
    return () => {
      recognition.abort();
      WakeRecognition.abort();
    };
  }, []);

  const stopSpeaking = () => {
    // Cancel any ongoing speech
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }

    // Reset all states
    setSpeaking(false);
    setIsStopped(true);
    setPromptText("Say 'hello' or 'hey SenseRoute' to begin...");
    setResponseImg(false);

    // Stop and restart recognition
    try {
      if (WakeRecognition) {
        WakeRecognition.stop();
        setTimeout(() => {
          WakeRecognition.start();
          setIsStopped(false);
        }, 500);
      }
    } catch (error) {
      console.log('Recognition error:', error);
    }
  };

  const value = {
    recognition,
    speaking,
    setSpeaking,
    promptText,
    setPromptText,
    responseImg,
    setResponseImg,
    speak,
    isStopped,
    setIsStopped,
    stopSpeaking,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export default UserContext;
