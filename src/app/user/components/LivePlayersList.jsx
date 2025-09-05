
"use client"
import { motion, AnimatePresence } from 'framer-motion';
import { useBingo } from '../context/BingoContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Users, Hash, Coins } from 'lucide-react';

function LivePlayersList() {
  const { players, cardPrice, gameState } = useBingo();

  const participatingPlayers = players
    .filter(p => p.cards && p.cards.length > 0)
    .map(p => ({
      ...p,
      totalSpent: p.cards.length * cardPrice,
    }));

  if (gameState === 'playing' || gameState === 'finished') {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3 }}
    >
      <Card className="bg-zinc-900/50 border-zinc-700 text-white">
        <CardHeader>
          <CardTitle className="flex items-center text-xl">
            <Users className="mr-2 text-lime-400" />
            Jugadores en la Partida
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[20rem] overflow-y-auto pr-2 space-y-2">
          <AnimatePresence>
            {participatingPlayers.length > 0 ? (
              participatingPlayers.map((player, index) => (
                <motion.div
                  key={player.id}
                  layout
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="flex items-center justify-between gap-3 p-2 rounded-lg bg-zinc-800/50"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    {/* <span className="text-2xl">{player.avatar}</span> */}
                    <span className="font-medium text-zinc-100 truncate">{player.nombre}</span>
                     <span className="font-medium text-zinc-100 truncate">{player.apellidos}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs font-mono flex-shrink-0">
                    <div className="flex items-center gap-1 text-sky-300">
                      <Hash className="w-3 h-3" />
                      {player.cards.length}
                    </div>
                    <div className="flex items-center gap-1 text-amber-300">
                      <Coins className="w-3 h-3" />
                      {player.totalSpent}
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center text-zinc-400 pt-8"
              >
                <p>Esperando jugadores...</p>
                <p className="text-xs">¡Sé el primero en comprar un cartón!</p>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default LivePlayersList;
