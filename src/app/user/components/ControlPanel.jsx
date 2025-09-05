'use client';
import { motion } from 'framer-motion';
import { useBingo } from '../context/BingoContext';
import { Button } from '../components/ui/button';
import { toast } from '../components/ui/use-toast';
import { Play, PlusCircle, Trash2, Wand2, Repeat, LogIn, Clock, Wallet, Hash, Coins } from 'lucide-react';
import { useRouter } from 'next/navigation';

function ControlPanel() {
 const {
  gameState,
  startGame,
  resetGame,
  addCard,
  playerCards,
  cardPrice,
  currentPlayer,
  logout,
  bingoType,
  activeRoom,
  generalRoomCountdown,
  clearAllPlayerCards,
  leaveRoom,
  gameStage,
  buyCarton,
  borrarCarton
 } = useBingo();

 const router = useRouter();
 const totalCost = playerCards.length * cardPrice;
 const playerBalance = currentPlayer?.monedas || 0;

 const handleStartGame = () => {
  if (playerCards.length === 0) {
   toast({
    title: '¡Necesitas cartones!',
    description: 'Añade al menos un cartón para empezar a jugar.',
    variant: 'destructive'
   });
   return;
  }
  startGame();
 };

 const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
   opacity: 1,
   y: 0,
   transition: {
    type: 'spring',
    stiffness: 260,
    damping: 20,
    staggerChildren: 0.1
   }
  }
 };

 const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 }
 };

 const handleLeaveRoom = () => {
//   leaveRoom();
  router.push('http://localhost:3000/user');
 };

 const handleBuyCard = async mode => {
  // 1. Verificar saldo suficiente
  if (currentPlayer.monedas < cardPrice) {
   toast({
    title: 'Saldo insuficiente',
    description: 'No tienes monedas suficientes para comprar un cartón.',
    variant: 'destructive'
   });
   return;
  }

  // 2. Restar saldo (optimista + BD)
  await buyCarton(cardPrice);

  // 3. Añadir el cartón
  addCard(mode);
 };

 const handleDeleteCard = async () => {
  const refund = playerCards.length * cardPrice; // total gastado

  if (refund === 0) return;

  // 1. Devolver saldo (optimista + BD)
  await borrarCarton(refund);

  // 2. Vaciar cartones en el cliente
  clearAllPlayerCards();
 };

 // 🟢 Cuenta atrás
 if (activeRoom.nombre === 'general' && gameState === 'countdown') {
  const seconds = generalRoomCountdown;
  return (
   <motion.div
    variants={containerVariants}
    initial='hidden'
    animate='visible'
    className='bg-zinc-900/50 rounded-2xl p-4 sm:p-6 text-center border border-zinc-700 shadow-lg'
   >
    <motion.div variants={itemVariants} className='flex justify-center items-center gap-3 mb-4'>
     <Clock className='w-8 h-8 text-sky-400 animate-spin-slow' />
     <h3 className='text-xl sm:text-2xl font-bold text-sky-400'>
      ¡Compra tus cartones! Tiempo: {String(seconds).padStart(2, '0')}s
     </h3>
    </motion.div>
    <motion.p variants={itemVariants} className='text-zinc-300 mb-6'>
     La partida comenzará automáticamente. Precio por cartón: {cardPrice} 🪙
    </motion.p>
    <motion.div variants={itemVariants} className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
     <Button
      onClick={() => handleBuyCard()}
      size='lg'
      className='bg-gradient-to-r from-lime-500 to-green-500 hover:from-lime-600 hover:to-green-600 w-full'
     >
      <PlusCircle className='w-5 h-5 mr-2' />
      Comprar Cartón
     </Button>
     <Button
      onClick={() => handleDeleteCard()}
      variant='destructive'
      size='lg'
      disabled={playerCards.length === 0}
      className='w-full'
     >
      <Trash2 className='w-5 h-5 mr-2' />
      Limpiar Cartones
     </Button>
    </motion.div>
   </motion.div>
  );
 }

 if (gameState === 'playing') {
  return (
   <motion.div
    variants={containerVariants}
    initial='hidden'
    animate='visible'
    className='bg-zinc-900/50 rounded-2xl p-4 flex flex-col md:flex-row justify-between items-center gap-4 border border-zinc-700 shadow-lg'
   >
    <motion.div variants={itemVariants} className='text-center md:text-left'>
     <h3 className='text-xl font-bold text-white'>¡El juego ha comenzado!</h3>
     <p className='text-sm text-zinc-400'>¡Mucha suerte!</p>
    </motion.div>
    <motion.div variants={itemVariants} className='flex gap-2'>
     <Button
      onClick={() => setIsAutoPlay(!isAutoPlay)}
      variant={isAutoPlay ? 'default' : 'outline'}
      className={isAutoPlay ? 'bg-sky-500 hover:bg-sky-600' : ''}
     >
      {isAutoPlay ? 'Pausar Auto' : 'Juego Automático'}
     </Button>
     <Button onClick={drawNextNumber} disabled={isAutoPlay}>
      Sacar Bola
     </Button>
    </motion.div>
   </motion.div>
  );
 }

 // 🟢 Partida finalizada
 if (gameState === 'finished') {
  return (
   <motion.div
    variants={containerVariants}
    initial='hidden'
    animate='visible'
    className='bg-zinc-900/50 rounded-2xl p-4 sm:p-6 text-center border border-zinc-700 shadow-lg'
   >
    <motion.h3 variants={itemVariants} className='text-xl sm:text-2xl font-bold text-amber-400 mb-4'>
     ¡Partida Finalizada!
    </motion.h3>
   </motion.div>
  );
 }

 // 🟢 Pantalla de preparación
 return (
  <motion.div
   variants={containerVariants}
   initial='hidden'
   animate='visible'
   className='bg-zinc-900/50 rounded-2xl p-4 sm:p-6 border border-zinc-700 shadow-lg'
  >
   <motion.div variants={itemVariants} className='flex flex-col sm:flex-row justify-between items-center gap-2 mb-4'>
    <h2 className='text-lg sm:text-2xl font-bold text-white'>Prepara tu Juego</h2>
    <div className='text-sm text-zinc-400 flex items-center gap-2'>
     <span>
      {currentPlayer?.nombre} ({currentPlayer?.avatar})
     </span>
     <Button variant='ghost' size='icon' onClick={logout} className='text-zinc-400 hover:text-white'>
      <LogIn className='w-4 h-4 transform -scale-x-100' />
     </Button>
    </div>
   </motion.div>

   {/* Botones de añadir cartones */}
   <motion.div variants={itemVariants} className='grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6'>
    <Button onClick={() => addCard()} size='lg' variant='outline' className='w-full'>
     <PlusCircle className='w-5 h-5 mr-2' />
     Añadir Cartón Aleatorio
    </Button>
    {bingoType === '75' && (
     <Button onClick={() => addCard('manual')} size='lg' variant='outline' className='w-full'>
      <Wand2 className='w-5 h-5 mr-2' />
      Añadir Cartón Manual
     </Button>
    )}
   </motion.div>

   {/* Info de saldo y botones */}
   <motion.div variants={itemVariants} className='bg-zinc-950/50 rounded-lg p-4 flex flex-col gap-4'>
    <div className='flex flex-col sm:flex-row justify-around gap-4 text-center'>
     <div className='flex items-center gap-2 justify-center'>
      <Hash className='w-5 h-5 text-sky-400' />
      <div>
       <p className='text-xs text-zinc-400'>Cartones</p>
       <p className='font-bold text-white'>{playerCards.length}</p>
      </div>
     </div>
     <div className='flex items-center gap-2 justify-center'>
      <Coins className='w-5 h-5 text-amber-400' />
      <div>
       <p className='text-xs text-zinc-400'>Costo Total</p>
       <p className='font-bold text-white'>{totalCost.toFixed(2)}</p>
      </div>
     </div>
     <div className='flex items-center gap-2 justify-center'>
      <Wallet className='w-5 h-5 text-emerald-400' />
      <div>
       <p className='text-xs text-zinc-400'>Saldo Restante</p>
       <p className='font-bold text-white'>{playerBalance.toFixed(2)}</p>
      </div>
     </div>
    </div>

    <div className='flex flex-col sm:flex-row gap-3 justify-center'>
     <Button
      onClick={clearAllPlayerCards}
      variant='destructive'
      size='lg'
      disabled={playerCards.length === 0}
      className='w-full sm:w-auto'
     >
      <Trash2 className='w-5 h-5 mr-2' />
      Limpiar
     </Button>
     <Button
      onClick={handleStartGame}
      size='lg'
      className='bg-gradient-to-r from-lime-500 to-green-500 hover:from-lime-600 hover:to-green-600 w-full sm:w-auto'
     >
      <Play className='w-5 h-5 mr-2' />
      ¡Empezar a Jugar!
     </Button>
    </div>
   </motion.div>
  </motion.div>
 );
}

export default ControlPanel;
