'use client';
import { useState, useEffect } from 'react';
import { CardContent, CardFooter } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Calendar, Ticket, KeySquare, Check, Eye, Shield, Info, Save } from 'lucide-react';

function RoomForm() {
 // En modo estático no hay cambios
 const handleSubmit = e => {
  e.preventDefault();
  // No hacer nada
 };

 return (
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
 );
}

export default RoomForm;
