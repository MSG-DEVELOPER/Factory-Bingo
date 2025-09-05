"use client";

import { useEffect } from "react";
import { useBingo } from "../context/BingoContext";
import { useParams, useRouter } from "next/navigation";

import Header from "../components/Header";
import ControlPanel from "../components/ControlPanel";
import DrawnNumbersDisplay from "../components/DrawnNumbersDisplay";
import BingoCardsGrid from "../components/BingoCardsGrid";
import ChatPanel from "../components/ChatPanel";
import CommunityPanel from "../components/CommunityPanel";
import WinnerCelebration from "../components/WinnerCelebration";
import CardEditorModal from "../components/CardEditorModal";
import CurrentBingoBall from "../components/CurrentBingoBall";
import PrizePoolDisplay from "../components/PrizePoolDisplay";
import WinningPatterns from "../components/WinningPatterns";
import { AnimatePresence } from "framer-motion";
import LivePlayersList from "../components/LivePlayersList";

function BingoGame() {

  console.log('entro en bingo gameeeeeeeeeeeeee');
  
  const {
    winningCards,
    editingCard,
    gameState,
    gameStage,
    drawnNumbers,
    currentNumber,
    leaveRoom,
    activeRoom,
    setActiveRoomById,
    rooms,
    preGameCountdown,
  } = useBingo();


  const params = useParams();
  const router = useRouter();
  const roomId = params?.roomId

  useEffect(() => {
    if (!roomId) return;
    const roomExists =
      roomId === "general" || rooms.some((r) => r.id === roomId);

    if (!roomExists) {
      router.push("http://localhost:3000/user");
      return;
    }

    setActiveRoomById(roomId);
  }, [roomId, rooms, setActiveRoomById, router]);

  const handleLeaveRoom = () => {
    // leaveRoom();
    router.push("http://localhost:3000/user");
  };

  if (!activeRoom || activeRoom.id !== roomId) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-2xl font-bold animate-pulse">Cargando sala...</p>
          <p className="text-white/70">Preparando todo para la diversión.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-8xl mx-auto relative">
      <Header />
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl sm:text-2xl font-bold text-sky-300">
          {activeRoom.nombre}
        </h2>
        <button
          onClick={handleLeaveRoom}
          className="text-sm text-rose-400 hover:underline"
        >
          Salir de la sala
        </button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-12 xl:col-span-9">
          {(gameState === "setup" || gameState === "countdown") && (
            <>
              <ControlPanel />
              <div className="mt-6">
                <BingoCardsGrid />
              </div>
            </>
          )}
          {(gameState === "playing" ||
            gameState === "finished" ||
            preGameCountdown !== null) && (
            <div className="space-y-8">
              <BingoCardsGrid />
              <DrawnNumbersDisplay
                drawnNumbers={drawnNumbers}
                currentNumber={currentNumber}
              />
            </div>
          )}
          {gameState === "finished" && (
            <div className="mt-8">
              <ControlPanel />
            </div>
          )}
        </div>
        <div className="lg:col-span-12 xl:col-span-3 flex flex-col gap-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-8">
            {gameState === "playing" && (
              <>
                <CurrentBingoBall />
                <WinningPatterns currentStage={gameStage} />
              </>
            )}
            <PrizePoolDisplay />
            {activeRoom.id === "general" && <LivePlayersList />}
          </div>
          <ChatPanel />
          <CommunityPanel />
        </div>
      </div>
      {winningCards.length > 0 && gameState === "finished" && (
        <WinnerCelebration />
      )}
      <AnimatePresence>{editingCard && <CardEditorModal />}</AnimatePresence>
    </div>
  );
}

export default BingoGame;
