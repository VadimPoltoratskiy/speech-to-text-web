import axios from "axios";
import "./App.css";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { useEffect, useState } from "react";
import { Audio, Dna } from "react-loader-spinner";

const App = () => {
  const [textToSend, setTextToSend] = useState();
  const [responseFromAPI, setResponseFromAPI] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const startListening = () => {
    SpeechRecognition.startListening({ continuous: true, language: "en-IN" });
    setIsListening(true);
  };

  const { transcript, browserSupportsSpeechRecognition } =
    useSpeechRecognition();

  useEffect(() => {
    setTextToSend(transcript);
  }, [transcript]);

  if (!browserSupportsSpeechRecognition) {
    return null;
  }

  const stopListening = () => {
    SpeechRecognition.stopListening();
    setIsListening(false);
    setTextToSend(transcript);
  };

  const sendText = async () => {
    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("question", textToSend);
      const URL = "http://0.0.0.0:80/ask";
      const headers = {
        "Content-Type": "multipart/form-data",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
      };
      const response = await axios.post(URL, formData, { headers });
      setResponseFromAPI(response.data.answer);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="container">
        <h2>Speech to Query</h2>
        <br />
        <p>
          Please tell me what kind of data would you wish to fetch from the
          database
        </p>
        {/* {isLoading && <span className="spinner"></span>} */}
        {isListening && (
          <Audio
            height="100"
            width="100"
            color="#2AC9A4"
            ariaLabel="audio-loading"
            wrapperStyle={{}}
            wrapperClass="wrapper-class"
            visible={true}
          />
        )}
        <div className="main-content" onClick={() => setTextToSend(transcript)}>
          {transcript}
        </div>
        <div className="btn-style">
          <button onClick={startListening}>Start Listening</button>
          <button onClick={stopListening}>Stop Listening</button>
          <button onClick={sendText}>Ask Model</button>
        </div>
        {isLoading && (
          <Dna
            visible={true}
            height="80"
            width="80"
            ariaLabel="dna-loading"
            wrapperStyle={{}}
            wrapperClass="dna-wrapper"
          />
        )}
        <div className="main-content" onClick={() => {}}>
          {responseFromAPI}
        </div>
      </div>
    </>
  );
};

export default App;
