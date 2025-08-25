import React, { useRef, useState, useEffect } from "react";
import CosmosScene from "./components/cosmosScene/CosmosScene";
import CreationScene from "./components/creationScene/CreationScene";
import StillnessScene from "./components/stillnessScene/StillnessScene";
import AppleTreeScene from "./components/appleTreeScene/AppleTreeScene";
import { motion, AnimatePresence } from "framer-motion";
import "./App.css";
import CustomCursor from "./components/CustomCursor";
import backgroundMusic from "./assets/sounds/background-music.wav";

const StartScreen = ({ onStart }) => (
  <div className="startScreen">
    <motion.button
      onClick={onStart}
      style={{ fontSize: "16px" }}
      whileHover={{ scale: 1.1, boxShadow: "0px 0px 15px rgba(255,255,255,0.5)" }}
      whileTap={{ scale: 0.9 }}
      className="startButton"
    >
      کمال سکون | محمود فتوحی رودمعجنی
    </motion.button>
  </div>
);

function App() {
  const [sceneIndex, setSceneIndex] = useState(0);
  const [isStarted, setIsStarted] = useState(false);
  const audioRef = useRef(null);

  const handleStart = () => {
    setIsStarted(true);
    if (audioRef.current) {
      audioRef.current.play().catch((error) => {
        console.error("Audio play failed:", error);
      });
    }
  };
  const goToNextScene = () => {
    setSceneIndex((prevIndex) => prevIndex + 1);
  };
  useEffect(() => {
    if (isStarted && audioRef.current) {
      audioRef.current.volume = 0.2;
      audioRef.current.play().catch((error) => {
        console.error("خطا در پخش صدا:", error);
      });
    }
  }, [isStarted]);
  const renderScene = () => {
    switch (sceneIndex) {
      case 0:
        return <CosmosScene goToNextScene={goToNextScene} />;
      case 1:
        return <CreationScene goToNextScene={goToNextScene} />;
      case 2:
        return <StillnessScene goToNextScene={goToNextScene} />;
      case 3:
        return <AppleTreeScene goToNextScene={goToNextScene} />;
      default:
        return <CosmosScene goToNextScene={() => setSceneIndex(0)} />;
    }
  };

  if (!isStarted) {
    return <StartScreen onStart={handleStart} />;
  }

  return (
    <div className="App">
      <CustomCursor />
      <audio ref={audioRef} src={backgroundMusic} loop />
      <AnimatePresence>{renderScene()}</AnimatePresence>
      <div className="guideUser">
        <p>راهنمای تعامل با متن:</p>
        <p>با دوضربۀ پشت سر هم به صفحۀ بعد بروید</p>
        <p>|</p>
        <p>موس را روی کلمات بکشید</p>
        <p>|</p>
        <p>روی صفحه ضربه بزنید</p>
        <p>|</p>
        <p>موس را از پایین صفحه به بالای صفحه ببرید</p>
        <p>|</p>
        <p>کلیک چپ موس را نگاه دارید</p>
      </div>
    </div>
  );
}

export default App;
