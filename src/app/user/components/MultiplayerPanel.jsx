
"use client"
import { motion } from 'framer-motion';
import { Users, Trophy } from 'lucide-react';
import { useBingo } from '@/context_old/BingoContext';

function MultiplayerPanel() {
  const { players } = useBingo();

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 h-full flex flex-col"
    >
      <div className="flex-grow">
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
          <Trophy className="text-amber-400" />
          Tabla de Líderes
        </h2>
        <div className="space-y-3">
          {players.sort((a,b) => b.score - a.score).map((player, index) => (
            <motion.div
              key={player.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index }}
              className="flex items-center justify-between bg-zinc-900/50 p-3 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{player.avatar}</span>
                <div>
                  <p className="font-semibold text-white">{player.name}</p>
                  <p className="text-xs text-white/60">Puntuación: {player.score}</p>
                </div>
              </div>
              <div className="font-bold text-lg text-amber-400">
                #{index + 1}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default MultiplayerPanel;