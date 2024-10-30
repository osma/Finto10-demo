let audioConfig;
let recognizer;
let synthesizer;

const speechConfig = SpeechSDK.SpeechConfig.fromSubscription(subscriptionKey, serviceRegion);
// Set the speech recognition language to Finnish
speechConfig.speechRecognitionLanguage = "fi-FI";
// Set the text-to-speech voice and language
speechConfig.speechSynthesisVoiceName = "fi-FI-SelmaNeural";
speechConfig.speechSynthesisLanguage = "fi-FI";

function speakText(inputText) {
    synthesizer = new SpeechSDK.SpeechSynthesizer(speechConfig);

    synthesizer.speakTextAsync(
      inputText,
      function (result) {
        window.console.log(result);
        synthesizer.close();
        synthesizer = undefined;
      },
      function (err) {
        startSpeakTextAsyncButton.disabled = false;
        window.console.log(err);

        synthesizer.close();
        synthesizer = undefined;
    });        
}


function startListening() {
    audioConfig = SpeechSDK.AudioConfig.fromDefaultMicrophoneInput();

    recognizer = new SpeechSDK.SpeechRecognizer(speechConfig, audioConfig);

    // Create a phrase list and add specific words
    const phraseList = SpeechSDK.PhraseListGrammar.fromRecognizer(recognizer);
    phraseList.addPhrase("Finto");
    phraseList.addPhrase("Finto AI");
    phraseList.addPhrase("YSO");

    recognizer.recognizing = function (s, e) {
        // transient change - modify the textarea directly, not through Vue
        document.querySelector('.botui-actions-text-input').value = e.result.text;
    };

    recognizer.recognized = function (s, e) {
        if (e.result.reason === SpeechSDK.ResultReason.RecognizedSpeech) {
            // change the content of the textarea through Vue
            window.botInstance.action.text.value = e.result.text;
            document.querySelector('.botui-actions-text-submit').click();
        } else if (e.result.reason === SpeechSDK.ResultReason.NoMatch) {
            window.botInstance.action.text.value = '';
        }
    };

    recognizer.canceled = function (s, e) {
        console.error(`Canceled: ${e.reason}`);
        if (e.reason === SpeechSDK.CancellationReason.Error) {
            console.error(`Error details: ${e.errorDetails}`);
        }
        stopListening();
    };

    recognizer.sessionStopped = function (s, e) {
        console.log("Session stopped.");
        stopListening();
    };

    const micIcon = document.getElementById("mic-icon");
    micIcon.src = "public/images/mic2.svg";
    recognizer.startContinuousRecognitionAsync();
}

function stopListening() {
    recognizer.stopContinuousRecognitionAsync(() => {
        recognizer.close();
        recognizer = undefined;
        
    });
    const micIcon = document.getElementById("mic-icon");
    micIcon.src = "public/images/mic.svg";
}
