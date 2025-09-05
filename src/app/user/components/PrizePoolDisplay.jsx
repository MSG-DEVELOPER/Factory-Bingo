"use client";

import { motion } from "framer-motion";
import { useBingo } from "../context/BingoContext";
import { Award, Trophy } from "lucide-react"; 
import React from "react";

export default function PrizePoolDisplay() {
  const { 
    firstPrizePool, 
    finalPrizePool, 
    gameStage, 
    gameState, 
    activeRoom, 
    players, 
    cardPrice 
  } = useBingo();

  const isGeneralRoomCountdown =
    activeRoom.nombre === "general" && gameState === "countdown";

  const totalCardsInRoom =
    players?.reduce((acc, player) => acc + (player.cards?.length || 0), 0) || 0;
  const estimatedPrizePool = totalCardsInRoom * cardPrice * 0.9; // 10% house cut

  const PrizeCard = ({ title, amount, icon, isActive, color, isEstimated = false }) => (
    <motion.div
      animate={{
        scale: isActive && gameState === "playing" ? [1, 1.05, 1] : 1,
        boxShadow:
          isActive && gameState === "playing"
            ? `0px 0px 25px ${color}70`
            : "0px 0px 0px rgba(0,0,0,0)",
      }}
      transition={{
        scale: { duration: 1.5, repeat: Infinity, ease: "easeInOut" },
        boxShadow: { duration: 1.5, repeat: Infinity, ease: "easeInOut" },
      }}
      className={`rounded-xl p-5 flex items-center gap-5 border-2 transition-all duration-500 
        bg-gradient-to-br from-zinc-800/80 to-zinc-900/80 
        ${isActive ? `border-[${color}]` : "border-zinc-700"}`}
    >
      {/* Icono */}
      <div
        className={`p-4 rounded-full transition-colors duration-500`}
        style={{
          backgroundColor: isActive ? `${color}20` : "rgba(113,113,122,0.5)",
        }}
      >
        {React.cloneElement(icon, {
          className: `w-7 h-7 ${
            isActive ? `text-[${color}]` : "text-zinc-400"
          }`,
        })}
      </div>

      {/* Texto */}
      <div className="flex-1">
        <p
          className={`text-sm font-semibold ${
            isActive ? `text-[${color}]` : "text-zinc-400"
          }`}
        >
          {title}{" "}
          {isEstimated && (
            <span className="text-xs text-zinc-400">(Estimado)</span>
          )}
        </p>
        <p className="text-2xl font-extrabold text-white tracking-wide drop-shadow-sm">
          {amount.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}{" "}
          €
        </p>
      </div>
    </motion.div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-zinc-900/60 backdrop-blur-md rounded-2xl p-6 border border-zinc-700 shadow-lg w-full space-y-5"
    >
      <h2 className="text-2xl font-bold text-white text-center mb-4 tracking-wide">
        💰 Total en Premios
      </h2>

      {/* {isGeneralRoomCountdown ? (
        <PrizeCard
          title="Premio Estimado"
          amount={estimatedPrizePool}
          icon={<Trophy />}
          isActive={false}
          isEstimated={true}
          color="#facc15" // amarillo
        />
      ) : ( */}
        <>
          <PrizeCard
            title="Primer Premio (Línea)"
            amount={firstPrizePool}
            icon={<Award />}
            isActive={gameStage === "first_prize"}
            color="#fbbf24" // amber-400
          />
          <PrizeCard
            title="Bingo Final (Cartón Lleno)"
            amount={finalPrizePool}
            icon={<Trophy />}
            isActive={gameStage === "final_prize"}
            color="#f59e0b" // amber-500
          />
        </>
      {/* )} */}
    </motion.div>
  );
}
