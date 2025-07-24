import React, { useState, useRef } from 'react';

// TypeScript: ensure global declaration is present
// This is needed for browsers that use webkitSpeechRecognition
// and to avoid TS errors for SpeechRecognition
// You can move this to a global.d.ts if you prefer
// @ts-ignore
declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}

const RecordSales: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef<any>(null);

  const startRecording = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech Recognition API is not supported in this browser.');
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      setTranscript(event.results[0][0].transcript);
    };
    recognition.onerror = (event: any) => {
      alert('Error occurred in recognition: ' + event.error);
      setIsRecording(false);
    };
    recognition.onend = () => {
      setIsRecording(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    recognitionRef.current?.stop();
    setIsRecording(false);
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Record Sales - Voice Input</h2>
      <button
        className={`px-4 py-2 rounded text-white ${isRecording ? 'bg-red-500' : 'bg-blue-600'} mb-4`}
        onClick={isRecording ? stopRecording : startRecording}
      >
        {isRecording ? 'Stop Recording' : 'Start Recording'}
      </button>
      <div className="mt-4">
        <strong>Transcript:</strong>
        <p className="border p-2 rounded bg-gray-100 min-h-[40px]">{transcript}</p>
      </div>
    </div>
  );
};

export default RecordSales; 