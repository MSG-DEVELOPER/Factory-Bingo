// 

// --------------------




import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useGameLogic } from '../hooks/useGameLogic';
import { useUserManagement } from '../hooks/useUserManagement';
import { useSettings } from '../hooks/useSettings';
import { useRoomManagement } from '../hooks/useRoomManagement';

const BingoContext = createContext();

export const useBingo = () => useContext(BingoContext);

const getInitialState = (key, defaultValue) => {
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.warn(`Error reading localStorage key “${key}”:`, error);
    return defaultValue;
  }
};

const GENERAL_ROOM_INTERVAL = 2000; // 20 seconds
const POST_GAME_DELAY = 10; // 10 seconds
const PRE_GAME_COUNTDOWN = 10; // 10 seconds

export const BingoProvider = ({ children }) => {
  const [transactionHistory, setTransactionHistory] = useState(() => getInitialState('bingo_transaction_history', []));
  const userManagement = useUserManagement(setTransactionHistory);
  const settings = useSettings();
  const roomManagement = useRoomManagement(userManagement, settings);

  const [weeklyJackpot, setWeeklyJackpot] = useState(() => getInitialState('bingo_weekly_jackpot', 1000));
  const [activeRooms, setActiveRooms] = useState(1);
  const [houseEarnings, setHouseEarnings] = useState(() => getInitialState('bingo_house_earnings', 0));
  const [generalRoomCountdown, setGeneralRoomCountdown] = useState(null);
  const [preGameCountdown, setPreGameCountdown] = useState(null);
  const generalRoomTimerRef = useRef(null);
  const preGameTimerRef = useRef(null);

  const gameLogic = useGameLogic(userManagement, settings, roomManagement, houseEarnings, setHouseEarnings);

  useEffect(() => {
    localStorage.setItem('bingo_transaction_history', JSON.stringify(transactionHistory));
  }, [transactionHistory]);
  
  useEffect(() => {
    localStorage.setItem('bingo_weekly_jackpot', JSON.stringify(weeklyJackpot));
  }, [weeklyJackpot]);

  useEffect(() => {
    localStorage.setItem('bingo_house_earnings', JSON.stringify(houseEarnings));
  }, [houseEarnings]);

  const startGeneralRoomCycle = () => {
    if (generalRoomTimerRef.current) clearInterval(generalRoomTimerRef.current);
    if (preGameTimerRef.current) clearInterval(preGameTimerRef.current);
    setPreGameCountdown(null);
    
    gameLogic.resetGame(true);
    
    const startCountdown = (duration) => {
      let timer = duration;
      setGeneralRoomCountdown(timer);
      gameLogic.setGameState('countdown');

      generalRoomTimerRef.current = setInterval(() => {
        timer -= 1;
        setGeneralRoomCountdown(timer);
        if (timer <= 0) {
          clearInterval(generalRoomTimerRef.current);
          if (roomManagement.activeRoom?.id === 'general') {
            startPreGameCountdown();
          }
        }
      }, 1000);
    };

    startCountdown(GENERAL_ROOM_INTERVAL);
  };

  const startPreGameCountdown = () => {
    if (preGameTimerRef.current) clearInterval(preGameTimerRef.current);
    let timer = PRE_GAME_COUNTDOWN;
    setPreGameCountdown(timer);

    preGameTimerRef.current = setInterval(() => {
      timer -= 1;
      setPreGameCountdown(timer);
      if (timer <= 0) {
        clearInterval(preGameTimerRef.current);
        setPreGameCountdown(null);
        gameLogic.startGame(true);
      }
    }, 1000);
  };

  useEffect(() => {
    if (gameLogic.gameState === 'finished' && roomManagement.activeRoom?.id === 'general') {
        const postGameTimer = setTimeout(() => {
            startGeneralRoomCycle();
        }, POST_GAME_DELAY * 1000);
        return () => clearTimeout(postGameTimer);
    }
  }, [gameLogic.gameState, roomManagement.activeRoom]);


  useEffect(() => {
    if (roomManagement.activeRoom?.id === 'general') {
      startGeneralRoomCycle();
    }
    return () => {
      if (generalRoomTimerRef.current) clearInterval(generalRoomTimerRef.current);
      if (preGameTimerRef.current) clearInterval(preGameTimerRef.current);
    };
  }, [roomManagement.activeRoom]);
  
  const [messages, setMessages] = useState([]);

  const sendMessage = (text) => {
    if (userManagement.currentPlayer) {
      const newMessage = {
        player: userManagement.currentPlayer,
        text,
        timestamp: new Date(),
      };
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    }
  };

  const prizePool = gameLogic.firstPrizePool + gameLogic.finalPrizePool;

  const value = {
    ...gameLogic,
    ...userManagement,
    ...settings,
    ...roomManagement,
    messages,
    sendMessage,
    weeklyJackpot,
    activeRooms,
    houseEarnings,
    prizePool,
    gameMode: settings.gameMode,
    bingoType: settings.bingoType,
    generalRoomCountdown,
    preGameCountdown,
    transactionHistory,
  };

  return (
    <BingoContext.Provider value={value}>
      {children}
    </BingoContext.Provider>
  );
};
