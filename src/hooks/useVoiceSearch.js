import { useEffect } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";

export function useVoiceSearch(onAutoSearch) {
    const {
        transcript,
        resetTranscript,
        browserSupportsSpeechRecognition,
        listening
    } = useSpeechRecognition();
    
    // Auto-search when voice recognition stops
    useEffect(() => {
        if (!listening && transcript.trim().length > 1) {
            onAutoSearch();
        } 
    }, [listening]);

    const toggleVoiceSearch = () => {
        if (!browserSupportsSpeechRecognition) {
            alert("Voice recognition is not supported in this browser.");
            return;
        }

        if (listening) {
            SpeechRecognition.stopListening();
        } else {
            resetTranscript();
            SpeechRecognition.startListening({ continuous: false, language: "en-US" });
        }
    };

    return { transcript, listening, toggleVoiceSearch };
}
