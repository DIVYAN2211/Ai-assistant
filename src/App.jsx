import { useContext, useState, useEffect } from "react";
import "./App.css";
import { DataContext } from "./context/UserContext";
import speakLoader from "./assets/speak.gif";
import responseLoader from "./assets/aiVoice.gif";
import virtualAssistantPhoto from "./assets/virtualAssistant.png";
import DocModal from "./components/DocModal";
import Loader from "./components/Loader";

const App = () => {
  const {
    speaking,
    promptText,
    responseImg,
    stopSpeaking,
  } = useContext(DataContext);

  const [isModalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const openDocModal = () => {
    setModalOpen(true);
  };

  const closeDocModal = () => {
    setModalOpen(false);
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div id="main">
      <img
        src={virtualAssistantPhoto}
        alt="virtualAssistantPhoto"
        className="virtual-assistant-img"
      />
      <span>I'm SenseRoute, Your AI Virtual Assistant</span>

      {promptText && !promptText.includes("hello") && !promptText.includes("hey SenseRoute") ? (
        <div className="response">
          {speaking && (
            !responseImg ? (
              <img src={speakLoader} alt="speak-loader" id="speak-img" />
            ) : (
              <img src={responseLoader} alt="response-loader" id="response-img" />
            )
          )}
          <p>{promptText}</p>
        </div>
      ) : (
        <p className="waiting-message">Say "hello" or "hey SenseRoute" to begin...</p>
      )}

      <div className="button-container">
        <button onClick={openDocModal} className="doc-button">
          Read Doc
        </button>
        <button onClick={stopSpeaking} className="stop-button">
          Stop Voice
        </button>
      </div>

      <DocModal isOpen={isModalOpen} onClose={closeDocModal} setIsOpen={setModalOpen} />
    </div>
  );
};

export default App;
