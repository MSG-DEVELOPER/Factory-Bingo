"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useBingo } from "../context/BingoContext";
import Header from "../components/Header";
import ControlPanel from "../components/ControlPanel";
import PrizePoolDisplay from "../components/PrizePoolDisplay";
import LivePlayersList from "../components/LivePlayersList";
import ChatPanel from "../components/ChatPanel";
import BingoCardsGrid from "../components/BingoCardsGrid";
import { AnimatePresence } from "framer-motion";
import DrawnNumbersDisplay from "../components/DrawnNumbersDisplay";
import CurrentBingoBall from "../components/CurrentBingoBall";
import WinningPatterns from "../components/WinningPatterns";

function Page() {
  const {
    currentPLayer,
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
    setGeneralRoomCountdown,
    setGameState,
    setCurrentNumber,
  } = useBingo();
    console.log("🚀 ~ Page ~ setGeneralRoomCountdown:", setGeneralRoomCountdown)
    console.log("🚀 ~ Page ~ activeRoom:", activeRoom)
    console.log("🚀 ~ Page ~ gameState:", gameState)

  const router = useRouter();

  useEffect(() => {
    if (activeRoom?.nombre === "general") {
      const startCron = async () => {
        try {
          const res = await fetch("/api/general-room/cron", {
            method: "POST",
          });
          if (!res.ok) throw new Error("Error al iniciar cron");
          const json = await res.json();
          console.log("✅ Cron iniciado:", json);
        } catch (err) {
          console.error("❌ Error al iniciar cron:", err);
        }
      };

      startCron();
    }
  }, [activeRoom]);

  const handleLeaveRoom = () => {
    leaveRoom();
    router.push("http://localhost:3000/user");
  };

  return (
    <div className="max-w-8xl p-10 mx-auto relative">
      <Header />
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl sm:text-2xl font-bold text-sky-300">Sala General</h2>
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
            {activeRoom?.nombre === "general" && <LivePlayersList />}
          </div>

          <ChatPanel />
        </div>
      </div>

      {winningCards.length > 0 && gameState === "finished" && <WinnerCelebration />}
      <AnimatePresence>{editingCard && <CardEditorModal />}</AnimatePresence>
    </div>
  );
}

export default Page;
