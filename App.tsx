import React, { useState, useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
import { Camera, Sparkles, RefreshCcw, Calendar, Coffee, X } from 'lucide-react';
import { AppState } from './types';
import { processImage } from './geminiService';
import ComparisonSlider from './components/ComparisonSlider';
import CoffeeLoader from './components/CoffeeLoader';

const videoConstraints = {
  width: 720,
  height: 960,
  facingMode: "user"
};

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.LANDING);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const webcamRef = useRef<Webcam>(null);

  const capture = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        setOriginalImage(imageSrc);
        setAppState(AppState.PROCESSING);
        handleProcessImage(imageSrc);
      }
    }
  }, [webcamRef]);

  const handleProcessImage = async (imageSrc: string) => {
    try {
      const result = await processImage(imageSrc);
      setProcessedImage(result);
      setAppState(AppState.RESULT);
    } catch (err) {
      console.error(err);
      setErrorMsg("We couldn't process that image. Please try again with good lighting!");
      setAppState(AppState.ERROR);
    }
  };

  const resetApp = () => {
    setAppState(AppState.LANDING);
    setOriginalImage(null);
    setProcessedImage(null);
    setErrorMsg(null);
  };

  const retry = () => {
    setAppState(AppState.CAMERA);
    setOriginalImage(null);
    setProcessedImage(null);
    setErrorMsg(null);
  };

  // --- Views ---

  const renderLanding = () => (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center bg-gradient-to-b from-coffee-50 to-coffee-100">
      <div className="mb-8 p-4 bg-white rounded-full shadow-xl border-4 border-coffee-100">
        <Coffee className="w-16 h-16 text-coffee-800" />
      </div>
      <h1 className="text-4xl md:text-5xl font-serif font-bold text-coffee-900 mb-4">
        BaristaSmile
      </h1>
      <p className="text-lg text-coffee-700 mb-8 max-w-md leading-relaxed">
        Love your daily brew but hate the stains? <br/>
        See how a professional whitening treatment can bring back your sparkle in seconds.
      </p>
      
      <button 
        onClick={() => setAppState(AppState.CAMERA)}
        className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all duration-200 bg-coffee-800 font-sans rounded-full hover:bg-coffee-900 hover:shadow-lg hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-coffee-900"
      >
        <Camera className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
        Preview My Smile
      </button>

      <div className="mt-12 grid grid-cols-3 gap-4 text-coffee-800/60 text-sm">
        <div className="flex flex-col items-center">
          <Sparkles className="w-6 h-6 mb-1" />
          <span>AI Powered</span>
        </div>
        <div className="flex flex-col items-center">
          <Coffee className="w-6 h-6 mb-1" />
          <span>Stain Removal</span>
        </div>
        <div className="flex flex-col items-center">
          <Camera className="w-6 h-6 mb-1" />
          <span>Instant</span>
        </div>
      </div>
    </div>
  );

  const renderCamera = () => (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black relative">
      <button 
        onClick={resetApp} 
        className="absolute top-6 right-6 z-20 bg-white/20 p-2 rounded-full backdrop-blur-sm text-white hover:bg-white/40"
      >
        <X className="w-6 h-6" />
      </button>
      
      <div className="relative w-full h-full max-w-md aspect-[3/4] overflow-hidden rounded-none md:rounded-2xl shadow-2xl">
         <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          videoConstraints={videoConstraints}
          className="w-full h-full object-cover"
          mirrored={true}
        />
        
        {/* Guide Overlay */}
        <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center border-4 border-coffee-500/30 rounded-none md:rounded-2xl">
           <div className="w-64 h-80 border-2 border-dashed border-white/50 rounded-full opacity-50 mb-12"></div>
           <p className="absolute bottom-32 text-white font-bold text-shadow-md bg-black/30 px-4 py-1 rounded-full backdrop-blur-md">
             Smile & Show Teeth!
           </p>
        </div>

        {/* Capture Button */}
        <div className="absolute bottom-8 left-0 right-0 flex justify-center z-10">
          <button 
            onClick={capture}
            className="w-20 h-20 bg-white rounded-full border-4 border-coffee-200 shadow-[0_0_20px_rgba(255,255,255,0.4)] hover:scale-105 active:scale-95 transition-transform flex items-center justify-center"
          >
            <div className="w-16 h-16 bg-coffee-800 rounded-full border-2 border-white"></div>
          </button>
        </div>
      </div>
    </div>
  );

  const renderProcessing = () => (
    <div className="flex flex-col items-center justify-center min-h-screen bg-coffee-50">
      <CoffeeLoader />
    </div>
  );

  const renderResult = () => (
    <div className="flex flex-col items-center min-h-screen bg-coffee-50 pb-12">
      <header className="w-full bg-white p-4 shadow-sm flex justify-between items-center sticky top-0 z-20">
        <div className="flex items-center space-x-2 text-coffee-900 font-bold font-serif text-lg">
          <Coffee className="w-6 h-6 text-coffee-700" />
          <span>BaristaSmile</span>
        </div>
        <button onClick={retry} className="text-coffee-600 hover:text-coffee-900">
          <RefreshCcw className="w-6 h-6" />
        </button>
      </header>

      <main className="flex-1 w-full max-w-md p-6 flex flex-col items-center animate-fade-in-up">
        <h2 className="text-2xl font-serif font-bold text-coffee-900 mb-2">Your New Smile</h2>
        <p className="text-coffee-600 mb-6 text-center text-sm">
          Slide to see the difference a professional cleaning can make for a coffee lover like you.
        </p>

        <div className="w-full mb-8">
          {originalImage && processedImage && (
            <ComparisonSlider 
              beforeImage={originalImage}
              afterImage={processedImage}
            />
          )}
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg w-full mb-6 border border-coffee-100">
          <h3 className="font-bold text-coffee-900 mb-2 flex items-center">
             <Sparkles className="w-4 h-4 mr-2 text-yellow-500" />
             Treatment Plan
          </h3>
          <p className="text-sm text-coffee-700 mb-4">
            Based on your analysis, our <strong>Espresso-Guard Whitening</strong> package is perfect for you. It removes deep tannins while protecting enamel.
          </p>
          <div className="flex justify-between items-center text-sm font-semibold text-coffee-800 bg-coffee-50 p-3 rounded-lg">
             <span>Estimated Duration</span>
             <span>45 Mins</span>
          </div>
        </div>

        <button className="w-full bg-coffee-800 text-white py-4 rounded-xl font-bold shadow-lg hover:bg-coffee-900 transition-colors flex items-center justify-center space-x-2">
          <Calendar className="w-5 h-5" />
          <span>Book Free Consultation</span>
        </button>
        
        <p className="mt-4 text-xs text-center text-coffee-400">
          *Simulation only. Actual results may vary based on dental health.
        </p>
      </main>
    </div>
  );

  const renderError = () => (
     <div className="flex flex-col items-center justify-center min-h-screen bg-coffee-50 p-6 text-center">
      <div className="bg-red-50 p-4 rounded-full mb-4">
        <X className="w-10 h-10 text-red-400" />
      </div>
      <h2 className="text-2xl font-serif font-bold text-coffee-900 mb-2">Oops!</h2>
      <p className="text-coffee-700 mb-8">{errorMsg || "Something went wrong."}</p>
      <button 
        onClick={retry}
        className="px-6 py-3 bg-coffee-800 text-white rounded-full font-bold hover:bg-coffee-900 transition-colors"
      >
        Try Again
      </button>
    </div>
  );

  return (
    <>
      {appState === AppState.LANDING && renderLanding()}
      {appState === AppState.CAMERA && renderCamera()}
      {appState === AppState.PROCESSING && renderProcessing()}
      {appState === AppState.RESULT && renderResult()}
      {appState === AppState.ERROR && renderError()}
    </>
  );
};

export default App;
