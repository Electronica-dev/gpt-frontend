import { useEffect, useState } from "react";
import axios from "axios";
import SpeechRecognition, { ListeningOptions, useSpeechRecognition } from 'react-speech-recognition';
import { Result } from "./types";
import "./App.css"
const Artyom = require('artyom.js').default;

const API_URL = process.env.REACT_APP_API_URL;
console.log(API_URL);


const artyom = new Artyom();

const options: ListeningOptions = {
  continuous: true,
  interimResults: true
}

function App() {
  const [answer, setAnswer] = useState("");

  const {
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
    finalTranscript
  } = useSpeechRecognition();


  useEffect(() => {
    if (finalTranscript !== "") {
      getResponse(finalTranscript)
    }
  }, [finalTranscript])

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }

  const startListeningAtPress = () => {
    SpeechRecognition.startListening(options);
  }

  const getResponse = async (text: string) => {
    await axios.post<Result>(
      API_URL,
      {
        text: text
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        }
      }
    ).then(({ data }) => {
      setAnswer(data.result.message.content);
      artyom.say(data.result.message.content);
    }).then(() => {
      resetTranscript();
    })
  }

  return (
    <div className="App">
      <div className="main">
        <p>Microphone: {listening ? 'on' : 'off'}</p>
        <button onClick={startListeningAtPress}>Start</button>
        <button onClick={SpeechRecognition.stopListening}>Stop</button>
        <p>{finalTranscript}</p>
        <p>{answer}</p>
      </div>
    </div>
  );
}

export default App;
