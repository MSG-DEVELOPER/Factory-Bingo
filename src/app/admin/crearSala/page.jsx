'use client';
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/card';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Calendar, Ticket, KeySquare, Check, Eye, Shield, Info, Save } from 'lucide-react';
import { PlusSquare, ShieldCheck } from 'lucide-react';
// import RoomForm from '../components/seller/RoomForm';

function CreatePublicRoom() {
 // const { createRoom } = useBingo();

 // const handleCreate = (roomData) => {
 //     createRoom({
 //         ...roomData,
 //         sellerId: 'admin',
 //         visibilidad: 'publica',
 //     });
 // };

 // En modo estático no hay cambios
 const handleSubmit = e => {
  e.preventDefault();
  // No hacer nada
 };

 return (
  <div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
   <div className='flex flex-col sm:flex-row items-center gap-4 mb-8'>
    <PlusSquare className='w-10 h-10 text-sky-400' />
    <h1 className='text-3xl sm:text-4xl font-bold text-center sm:text-left'>Crear Sala Pública</h1>
   </div>

   <Card className='bg-white/5 border-white/10 text-white max-w-4xl mx-auto'>
    <CardHeader>
     <CardTitle className='flex items-center gap-2 text-lg sm:text-xl'>
      <ShieldCheck />
      Crear una Sala Oficial de la Casa
     </CardTitle>
     <CardDescription>
      Configura una sala pública que será visible para todos los jugadores. Estas salas son gestionadas por el
      administrador.
     </CardDescription>
    </CardHeader>
    {/* <RoomForm onSave={handleCreate} initialData={{}} isAdmin={true} /> */}
    <form onSubmit={handleSubmit}>
     <CardContent className='space-y-6 pt-6'>
      <div className='space-y-2'>
       <Label htmlFor='name'>Nombre del Bingo *</Label>
       <Input id='name' className='bg-zinc-800 border-zinc-700' />
      </div>
      <div className='space-y-2'>
       <Label htmlFor='description'>Descripción (Opcional)</Label>
       <Input id='description' className='bg-zinc-800 border-zinc-700' />
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
       <div className='space-y-2'>
        <Label htmlFor='startTime' className='flex items-center gap-2'>
         <Calendar className='w-4 h-4' />
         Fecha y Hora de Inicio *
        </Label>
        <Input id='startTime' type='datetime-local' disabled className='bg-zinc-800 border-zinc-700' />
       </div>
       <div className='space-y-2'>
        <Label htmlFor='cardPrice' className='flex items-center gap-2'>
         <Ticket className='w-4 h-4' />
         Precio por Cartón (€) *
        </Label>
        <Input id='cardPrice' type='number' disabled className='bg-zinc-800 border-zinc-700' />
       </div>
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
       <div className='space-y-2'>
        <Label htmlFor='accessCode' className='flex items-center gap-2'>
         <KeySquare className='w-4 h-4' />
         Código de Acceso *
        </Label>
        <Input id='accessCode' disabled className='bg-zinc-800 border-zinc-700' />
       </div>
      </div>
  
      <div className='space-y-3'>
       <Label>Patrones de Victoria *</Label>
       <div className='flex items-center gap-2 p-2 bg-sky-900/30 rounded-md text-sky-300 text-xs'>
        <Info className='w-4 h-4 shrink-0' />
        <span>Cartón Lleno, La X, etc., son considerados premios finales. Los demás son premios de línea.</span>
       </div>
       
       <div className='p-4 bg-zinc-900/50 rounded-md grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-56 overflow-y-auto'>
        {/* {Object.keys(DEFAULT_BINGO_PATTERNS_75).map(patternName => (
         <div key={patternName} className='flex items-center space-x-2'>
          <Checkbox
           id={`pattern-${patternName}`}
           checked={!!formData.selectedPatterns[patternName]}
           disabled
           className='border-sky-400 data-[state=checked]:bg-sky-500'
          />
          <Label htmlFor={`pattern-${patternName}`} className='font-normal truncate'>
           {patternName}
          </Label>
         </div>
        ))} */}
       </div>
      </div>
     </CardContent>
     <CardFooter>
      <Button type='submit' className='w-full bg-sky-600 text-lg py-6' disabled>
       Guardar Cambios
      </Button>
     </CardFooter>
    </form>
   </Card>
  </div>
 );
}

export default CreatePublicRoom;
