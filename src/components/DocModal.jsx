import React, { useEffect, useState } from 'react';
import './DocModal.css';

const DocModal = ({ isOpen, onClose, setIsOpen }) => {
  const [speaking, setSpeaking] = useState(false);
  const synth = window.speechSynthesis;

  useEffect(() => {
    const handleVoiceCommand = (e) => {
      const command = e.detail.toLowerCase();
      if (command === 'read doc') {
        readContent();
      } else if (command === 'stop') {
        if (speaking) {
          synth.cancel();
          setSpeaking(false);
        }
      }
    };

    window.addEventListener('voiceCommand', handleVoiceCommand);
    return () => window.removeEventListener('voiceCommand', handleVoiceCommand);
  }, [speaking]);

  const readContent = () => {
    if (speaking) {
      synth.cancel();
      setSpeaking(false);
      return;
    }

    const docContent = `How to Use the AI Assistant.
      Step 1: Open any Website. To open website, simply say: Open YouTube
      Step 2: Search On Web Browser. To search, simply say: Search For javascript
      Step 3: Ask for Weather By City. Example: Weather In Mumbai
      Step 4: Ask Today's Date. Example: What Is Date
      Step 5: Search On Youtube. Example: search on youtube for html
      Step 6: Ask Current Time. Example: What Is Time
      Step 7: Ask Anything. I will try my best to help you.`;
    const utterance = new SpeechSynthesisUtterance(docContent);
    utterance.onend = () => setSpeaking(false);
    setSpeaking(true);
    synth.speak(utterance);
  };

  if (!isOpen) {
    if (speaking) {
      synth.cancel();
      setSpeaking(false);
    }
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>How to Use the AI Assistant</h2>
        <p>Follow these steps to interact with AI assistant:</p>
        
        <div className="doc-step">
          <h3>Step 1: Open any Website</h3>
          <p>To open website, simply say:</p>
          <p><strong>Example:</strong> <code>Open YouTube</code></p>
          <p>This will open the specified website in your browser or mobiles.</p>
        </div>

        <div className="doc-step">
          <h3>Step 2: Search On Web Browser</h3>
          <p>To open website, simply say:</p>
          <p><strong>Example:</strong> <code>Search For javascript</code></p>
          <p>This will open the specified Subject webpage in your browser or mobiles.</p>
        </div>

        <div className="doc-step">
          <h3>Step 3: Ask for Weather By City</h3>
          <p>To ask for weather of a city, say something like:</p>
          <p><strong>Example:</strong> <code>Weather In Mumbai</code></p>
          <p>Alphora will try to retrieve Specific City Weather.</p>
        </div>

        <div className="doc-step">
          <h3>Step 4: Ask Today's Date</h3>
          <p>To Ask Today's Date, try saying:</p>
          <p><strong>Example:</strong> <code>What Is Date</code></p> 
          <p>Alphora will try to retrieve the Today's Date.</p>
        </div>

        <div className="doc-step">
          <h3>Step 5: Search On Youtube Search</h3>
          <p>To Ask Inside Youtube, try saying:</p>
          <p><strong>Example:</strong> <code> search on youtube for html</code></p> 
          <p>Alphora  will Open The Youtube With a Specific Subject.</p>
        </div>

        <div className="doc-step">
          <h3>Step 6: Ask Cureent Time</h3>
          <p>To Ask Current Time, try saying:</p>
          <p><strong>Example:</strong> <code>What Is Time</code></p> 
          <p>Alphora will try to retrieve the Current Time.</p>
        </div>

        <div className="doc-step">
          <h3>Step 7: Ask Anything</h3>
          <p>Depending On Your Question SenseRoute assistant will Give You The Ouput.</p>
        </div>

        <div className="doc-step">
          <h3>Step 7: Ask Anything</h3>
          <p>Depending On Your Question SenseRoute  assistant will Give You The Ouput.</p>
        </div>

       
        <div className="modal-buttons">
          <button onClick={readContent} className="modal-read-button">
            {speaking ? 'Stop Reading' : 'Read Content'}
          </button>
          <button onClick={onClose} className="modal-close-button">Close</button>
        </div>
      </div>
    </div>
  );
};

export default DocModal;
