'use client';
import React from 'react';
import { useBingo } from '../context/BingoContext';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Server, KeySquare } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { useUserManagement } from '../hooks_old/useUserManagement';

function WelcomeScreen({ idClient, user, users, sellers }) {
 const userManagement = useUserManagement(idClient, user, users, sellers);

 const router = useRouter();
 const { joinGeneralRoom } = useBingo();

 const handleJoinGeneral = async () => {
 
//   await fetch('../api/general-room/cron', { method: 'POST' });


//   await fetch('../api/general-room/unirse', {
//    method: 'POST',
//    headers: { 'Content-Type': 'application/json' },
//    body: JSON.stringify({ userId: idClient }) // <-- viene de props
//   });


  if (joinGeneralRoom()) {
   router.push('http://localhost:3000/user/juego_bingo');
  }
 };

 return (
  <div className='flex items-center justify-center min-h-[calc(100vh-10rem)]'>
   <Card className='w-full max-w-md bg-white/5 border-white/10 text-white'>
    <CardHeader className='text-center'>
     <CardTitle className='text-3xl font-bold'>Selecciona una Sala</CardTitle>
     <CardDescription>
      Únete a la sala general, busca una sala pública o ingresa a una partida privada con un código.
     </CardDescription>
    </CardHeader>
    <CardContent className='space-y-4'>
     <Button
      onClick={handleJoinGeneral}
      className='w-full bg-gradient-to-r from-sky-500 to-blue-500 hover:from-sky-600 hover:to-blue-600 py-6 text-lg'
     >
      <Server className='w-5 h-5 mr-2' />
      Entrar a Sala General
     </Button>

     <Button variant='outline' className='w-full bg-white/10 hover:bg-white/20 border-white/20 py-6 text-lg'>
      <KeySquare className='w-5 h-5 mr-2' />
      Unirse con Código
     </Button>
    </CardContent>
   </Card>
  </div>
 );
}

export default WelcomeScreen;
