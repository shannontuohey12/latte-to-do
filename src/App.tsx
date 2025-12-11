
import React, {useState, useEffect} from 'react';
import './App.css';

import breakImg from "./assets/break.png";
import breakClicked from "./assets/breakclicked.png";
import closeImg from "./assets/close.png";
import homepage from "./assets/homepage.png";
import minImg from "./assets/min.png";
import playImg from "./assets/play.png";
import resetImg from "./assets/reset.png";
import workImg from "./assets/work.png";
import workClicked from "./assets/workclicked.png";
import gif4 from "./assets/gif4.gif";
import gif3 from "./assets/gif3.gif";
import workGif from "./assets/workGif.gif";



function App() {

  const [timeLeft, setTimeLeft] = useState(25*60);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [encouragement, setEncouragement] = useState("");
  const [breakButtonImage, setBreakButtonImage] = useState(breakImg);
  const[workButtonImage, setWorkButtonImage] = useState(workImg);
  const[gifImage, setGifImage] = useState(gif4);
  const[image, setImage] = useState(playImg);

  const workMessages = [
    "You can do it!",
    "You're amazing!",
    "Keep it up!",
    "Get that work done!",
    "Almost there..."

  ];

  const breakMessages = [
    "Relax for a bit!",
    "Drink some water!", 
    "Hey, text me back!", 
    "Oooo.. what are you eating?",
  ]; 
  //encouragement message updates 
  useEffect(() => {
    let messageInterval: NodeJS.Timeout;

    if (isRunning){
      const messages = isBreak ? breakMessages : workMessages;
      setEncouragement(messages[0]); //first message
      let index = 1
      
      messageInterval = setInterval(() => {
        setEncouragement(messages[index]);
        index = (index+1) % messages.length;
      }, 4000); //every 4 seconds
    } else{
      setEncouragement("");
    }

    return () => clearInterval(messageInterval);
  }, [isRunning, isBreak]);

  //countdown
  useEffect( () => {
    let timer: NodeJS.Timeout;
    if (isRunning && timeLeft >0 ){
      timer = setInterval( () => {
        setTimeLeft(prev => prev -1);
      }, 1000); //runs a one second interval 
    }
    return() => clearInterval(timer); //when its done
  }, [isRunning, timeLeft]);

  //set inital switch mode to false 
  useEffect(() => {
    switchMode(false);
  }, []);

  const formatTime = (seconds: number): string => {
    const m = Math.floor(seconds/60).toString().padStart(2, '0');

    const s = (seconds % 60).toString().padStart(2,'0');
    return `${m}:${s}`;
  };

  const switchMode = (breakMode: boolean) => {
    setIsBreak(breakMode); //true = break, false = work 
    setIsRunning(false); //stop timer
    setBreakButtonImage(breakMode ? breakClicked : breakImg);
    setWorkButtonImage(breakMode ? workImg : workClicked)
    setTimeLeft(breakMode ? 5 * 60 : 25*60); //reset timer
    setGifImage(gif4);
  }
  const handleClick = () => {
    if (!isRunning) { //if not running
      setIsRunning(true); //start running
      setGifImage(isBreak ? gif3 : workGif );
      setImage(resetImg);
    } else {
      setIsRunning(false); // if running then stop 
      setTimeLeft (isBreak ? 5*60 : 25*60);//reset timer
      setGifImage(gif4);
      setImage(playImg);
    }
  }
  const handleCloseClick = () => {
    if (window.electronAPI?.closeApp){
      window.electronAPI.closeApp();
    } else {
      console.warn("Electron API not available.");
    }
  }
  const containerClass = `home-container ${isRunning ? "homepage" : ""}`;
  return (
    <div className={containerClass} style={{position: 'relative'}}>
    <div>
      <button className="close-button" onClick = {handleCloseClick}>
        <img src = {closeImg} alt = "Close"/>
      </button>
    </div>

    <div className="home-content">
      <div className="home-controls">
        <button className="image-button" onClick = {() => switchMode(false)}>
          <img src = {workButtonImage} alt = "Work"/>
        </button>
        <button className="image-button" onClick = {() => switchMode(true)}>
          <img src = {breakButtonImage} alt = "Break"/>
        </button>
      </div>
      <p className= {`encouragement-text ${!isRunning ? "hidden" : ""}`}>
        { encouragement }
      </p>

      <h1 className="home-timer">{formatTime(timeLeft)} </h1>
      <img src= {gifImage} alt="Timer Status" className="gif-image"/>

      <button className = "home-button" onClick={handleClick}>
        <img src ={image} alt= "Button Icon"/>
      </button>

    </div>
    </div>
  );
}

export default App;
