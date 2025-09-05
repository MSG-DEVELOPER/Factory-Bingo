'use client';
import { motion } from 'framer-motion';
import { useBingo } from '../context/BingoContext';
import { Coins, Users, BarChart2 } from 'lucide-react';

function Header() {
 const { weeklyJackpot, players, currentPlayer,activeRoom } = useBingo();

 const playerBalance = currentPlayer ? players.find(p => p.id === currentPlayer.id)?.monedas ?? 0 : 0;

 const StatCard = ({ icon, label, value, color }) => (
  <div className='flex items-center gap-3 bg-zinc-800/50 p-3 rounded-lg w-full'>
   <div className={`p-2 rounded-full bg-gradient-to-br ${color}`}>{icon}</div>
   <div>
    <p className='text-xs text-zinc-400'>{label}</p>
    <p className='text-sm font-bold text-white'>{value}</p>
   </div>
  </div>
 );

 return (
  <motion.div
   initial={{ y: -100, opacity: 0 }}
   animate={{ y: 0, opacity: 1 }}
   transition={{ type: 'spring', stiffness: 50, damping: 15 }}
   className='bg-zinc-900/70 backdrop-blur-lg p-4 rounded-2xl mb-6 border border-zinc-700 shadow-lg'
  >
   {/* Título */}
   <div className='flex justify-center sm:justify-start mb-4'>
    <h1 className='text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-cyan-300'>
     🎉 Club Bingo
    </h1>
   </div>

   {/* Estadísticas */}
   <div className='grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-row gap-3 sm:gap-4'>
   <StatCard
     icon={<Coins className='w-5 h-5 text-yellow-900' />}
     label='Tu Saldo'
     value={playerBalance.toLocaleString()}
     color='from-yellow-400 to-amber-500'
    />

    <StatCard
     icon={<Users className='w-5 h-5 text-purple-900' />}
     label='Jugadores'
     value={players.length}
     color='from-purple-400 to-violet-500'
    />
    <StatCard
     icon={<BarChart2 className='w-5 h-5 text-emerald-900' />}
     label='Bote Semanal'
     value={`${activeRoom.bote_general}`}
     color='from-emerald-400 to-green-500'
    />
   </div>
  </motion.div>
 );
}

export default Header;
