
"use client"
import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Home, Copy, Users, Clock, CheckCircle, XCircle, Pencil } from 'lucide-react';
import { toast } from '../components/ui/use-toast';
import EditRoomModal from '../components/EditRoomModal';

const statusConfig = {
 scheduled: { text: 'Programada', icon: <Clock className='w-4 h-4 text-amber-400' />, color: 'text-amber-400' },
 active: { text: 'Activa', icon: <CheckCircle className='w-4 h-4 text-lime-400' />, color: 'text-lime-400' },
 finished: { text: 'Finalizada', icon: <XCircle className='w-4 h-4 text-rose-400' />, color: 'text-rose-400' }
};

function PrivateRooms({ seller }) {
 const [editingRoom, setEditingRoom] = useState(null);

 

 const handleSaveRoom = updatedRoom => {
  updatePrivateRoom(updatedRoom);
  setEditingRoom(null);
 };

 return (
  <div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
   <div className='flex items-center gap-4 mb-8'>
    <Home className='w-8 h-8 text-sky-400' />
    <h1 className='text-3xl sm:text-4xl font-bold'>{seller ? 'Mis Salas de Bingo' : 'Gestión de Salas'}</h1>
   </div>
   <Card className='bg-white/5 border-white/10 text-white'>
    <CardHeader>
     <CardTitle>Historial de Salas Creadas</CardTitle>
     <CardDescription>Aquí puedes ver y gestionar todas las salas de bingo creadas en el sistema.</CardDescription>
    </CardHeader>
    <CardContent>
     {/* {roomsToDisplay.length > 0 ? ( */}
      <div className='overflow-x-auto'>
       <Table>
        <TableHeader>
         <TableRow className='border-white/20 hover:bg-white/10'>
          <TableHead className='text-white'>Nombre</TableHead>
          <TableHead className='text-white hidden sm:table-cell'>Código</TableHead>
          <TableHead className='text-white'>Estado</TableHead>
          <TableHead className='text-white hidden md:table-cell'>Jugadores</TableHead>
          <TableHead className='text-white'>Fecha Inicio</TableHead>
          <TableHead className='text-white text-right'>Acciones</TableHead>
         </TableRow>
        </TableHeader>
        <TableBody>
         {/* {roomsToDisplay.map(room => {
          const status = statusConfig[room.status] || { text: 'Desconocido', icon: null, color: '' };
          return (
           <TableRow key={room.id} className='border-white/20 hover:bg-white/10'>
            <TableCell className='font-semibold'>{room.name}</TableCell>
            <TableCell className='hidden sm:table-cell'>
             <div className='flex items-center gap-2 font-mono'>
              <span>{room.accessCode}</span>
              <Button
               size='icon'
               variant='ghost'
               className='h-6 w-6'
               onClick={() => handleCopyToClipboard(room.accessCode)}
              >
               <Copy className='h-4 w-4' />
              </Button>
             </div>
            </TableCell>
            <TableCell>
             <div className={`flex items-center gap-2 ${status.color}`}>
              {status.icon}
              <span className='hidden sm:inline'>{status.text}</span>
             </div>
            </TableCell>
            <TableCell className='text-center hidden md:table-cell'>
             <div className='flex items-center gap-1 justify-center'>
              <Users className='w-4 h-4' /> {room.players.length}
             </div>
            </TableCell>
            <TableCell>{new Date(room.startTime).toLocaleString()}</TableCell>
            <TableCell className='text-right'>
             {room.status === 'scheduled' && (
              <Button
               size='sm'
               variant='outline'
               className='border-sky-400 text-sky-400 hover:bg-sky-400/10 hover:text-sky-300'
               onClick={() => setEditingRoom(room)}
              >
               <Pencil className='w-4 h-4 sm:mr-2' />
               <span className='hidden sm:inline'>Editar</span>
              </Button>
             )}
            </TableCell>
           </TableRow>
          );
         })} */}
        </TableBody>
       </Table>
      </div>
     {/* ) : (
      <p className='text-center text-white/60 py-8'>No se ha creado ninguna sala todavía.</p>
     )} */}
    </CardContent>
   </Card>
   {editingRoom && (
    <EditRoomModal
     room={editingRoom}
     isOpen={!!editingRoom}
     onClose={() => setEditingRoom(null)}
     onSave={handleSaveRoom}
    />
   )}
  </div>
 );
}

export default PrivateRooms;
