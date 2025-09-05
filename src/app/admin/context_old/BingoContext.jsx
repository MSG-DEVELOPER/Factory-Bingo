"use client"
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useGameLogic } from '@/hooks_old/useGameLogic';
import { useUserManagement } from '@/hooks_old/useUserManagement';
import { useSettings } from '@/hooks_old/useSettings';

const BingoContext = createContext();

export const useBingo = () => useContext(BingoContext);

// const getInitialState = (key, defaultValue) => {
//   try {
//     const item = window.localStorage.getItem(key);
//     return item ? JSON.parse(item) : defaultValue;
//   } catch (error) {
//     console.warn(`Error reading localStorage key “${key}”:`, error);
//     return defaultValue;
//   }
// };


export const BingoProvider = ({ children }) => {
  const userManagement = useUserManagement();
  const settings = useSettings();
  const [selectedVoice, setSelectedVoice] = useState('chavo');
  const [weeklyJackpot, setWeeklyJackpot] = useState(1000);
  const [activeRooms, setActiveRooms] = useState(1);
  const [houseEarnings, setHouseEarnings] = useState(7);

  const gameLogic = useGameLogic(userManagement, settings, selectedVoice, weeklyJackpot, setWeeklyJackpot, houseEarnings, setHouseEarnings);

  // useEffect(() => {
  //   localStorage.setItem('bingo_weekly_jackpot', JSON.stringify(weeklyJackpot));
  // }, [weeklyJackpot]);

  // useEffect(() => {
  //   localStorage.setItem('bingo_house_earnings', JSON.stringify(houseEarnings));
  // }, [houseEarnings]);
  
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

  const value = {
    ...gameLogic,
    ...userManagement,
    ...settings,
    messages,
    sendMessage,
    selectedVoice,
    setSelectedVoice,
    weeklyJackpot,
    activeRooms,
    houseEarnings,
  };

  return (
    <BingoContext.Provider value={value}>
      {children}
    </BingoContext.Provider>
  );
};
