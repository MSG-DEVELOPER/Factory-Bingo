'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Slider } from '../components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import {
 DollarSign,
 BarChart2,
 TrendingUp,
 PlusCircle,
 ShieldCheck,
 Gamepad2,
 Users,
 Percent,
 UserPlus,
 Tag,
 Link as LinkIcon,
 Ticket,
 Clock,
 Home,
 Award,
 Wifi,
 WifiOff
} from 'lucide-react';

function PlayersManagement({ users, sellers }) {
 const [rechargeAmount, setRechargeAmount] = useState({});
 const [newPlayerName, setNewPlayerName] = useState('');
 const [newPlayerLastName, setNewPlayerLastName] = useState('');
 const [rolId, setRolId] = useState('');
 const [selectedSellerId, setSelectedSellerId] = useState('');

 const handleAmountChange = (playerId, value) => {
  setRechargeAmount(prev => ({
   ...prev,
   [playerId]: value
  }));
 };

 const handleRecharge = async playerId => {
  const amount = parseInt(rechargeAmount[playerId], 10);

  if (!amount || isNaN(amount)) return;

  const res = await fetch('../../api/admin/recargarMonedas', {
   method: 'POST',
   headers: { 'Content-Type': 'application/json' },
   body: JSON.stringify({ userId: playerId, amount })
  });

  const data = await res.json();

  if (data.success) {
   location.reload();
  } else {
   alert('Error al recargar fichas');
  }
 };

 const handleAddPlayer = async e => {
  e.preventDefault();

  if (!newPlayerName || !newPlayerLastName) return;

  const body = {
   nombre: newPlayerName,
   apellidos: newPlayerLastName,
   rol_id: rolId === 'none' ? null : parseInt(rolId, 10)
  };

  if (body.rol_id === 3) {
   const selectedSeller = sellers.find(s => s.id === parseInt(selectedSellerId, 10));
   if (selectedSeller) {
    body.id_vendedor = selectedSeller.id;
   }
  }

  const response = await fetch('../../api/admin/addUser', {
   method: 'POST',
   headers: { 'Content-Type': 'application/json' },
   body: JSON.stringify(body)
  });

  const data = await response.json();
  if (data.success === true) {
   location.reload();
  } else {
   alert('error al crear usuario');
  }
 };

 return (
  <Card className='bg-white/5 border-white/10 text-white mt-4'>
   <CardHeader>
    <CardTitle>Gestión de Jugadores</CardTitle>
   </CardHeader>
   <CardContent>
    <form
     onSubmit={handleAddPlayer}
     className='flex flex-col md:flex-row items-center gap-2 mb-6 p-4 bg-zinc-900/50 rounded-lg'
    >
     <h3 className='text-lg font-semibold mr-4 hidden md:block'>Añadir Nuevo</h3>

     <input
      placeholder='Nombre'
      value={newPlayerName}
      onChange={e => setNewPlayerName(e.target.value)}
      className='bg-zinc-800 border-zinc-700 text-white flex-grow px-3 py-2 rounded'
      name='nombre'
     />

     <input
      placeholder='Apellidos'
      value={newPlayerLastName}
      onChange={e => setNewPlayerLastName(e.target.value)}
      className='bg-zinc-800 border-zinc-700 text-white flex-grow px-3 py-2 rounded'
      name='apellidos'
     />

     <select
      value={rolId}
      onChange={e => setRolId(e.target.value)}
      name='rol_id'
      className='w-full md:w-[180px] bg-zinc-800 border border-zinc-700 text-white rounded px-3 py-2'
     >
      <option value='none'>Seleccionar rol</option>
      <option value='1'>Admin</option>
      {/* <option value='2'>Vendedor</option> */}
      <option value='3'>Jugador</option>
     </select>

     {rolId === '3' && (
      <select
       value={selectedSellerId}
       onChange={e => setSelectedSellerId(e.target.value)}
       name='id_vendedor'
       className='w-full md:w-[180px] bg-zinc-800 border border-zinc-700 text-white rounded px-3 py-2'
       required
      >
       <option value=''>Seleccionar vendedor</option>
       {sellers.map(seller => (
        <option key={seller.id} value={seller.id}>
         {seller.nombre} {seller.apellidos} ({seller.codigo_vendedor})
        </option>
       ))}
      </select>
     )}

     <button type='submit' className='bg-sky-500 hover:bg-sky-600 text-white rounded px-4 py-2'>
      Añadir
     </button>
    </form>

    <div className='overflow-x-auto'>
     <Table>
      <TableHeader>
       <TableRow className='border-white/20 hover:bg-white/10'>
        <TableHead className='text-white'>Jugador</TableHead>

        <TableHead className='text-white'>Rol</TableHead>
        <TableHead className='text-white'>Vendedor</TableHead>
        <TableHead className='text-white'>Estado</TableHead>
        <TableHead className='text-white'>Cartones Jugados</TableHead>
        <TableHead className='text-white'>Fichas</TableHead>
        <TableHead className='text-white text-center'>Recargar Fichas</TableHead>
       </TableRow>
      </TableHeader>
      <TableBody>
       {users.map(user => {
        let seller = null;
        if (user.rol_id === 3) {
         seller = users.find(u => u.rol_id === 2 && u.id === user.id_vendedor);
        }

        const rolNombre =
         {
          1: 'Admin',
          2: 'Vendedor',
          3: 'Jugador'
         }[user.rol_id] || 'Desconocido';
        return (
         <TableRow key={user.id} className='border-white/20 hover:bg-white/10'>
          {/* Jugador ID */}
          <TableCell>
           <div className='flex items-center gap-3'>
            <div>
             <p className='font-semibold'>
              {user.nombre} {user.apellidos}
             </p>
             <p className='text-xs text-white/60'>ID: {user.id}</p>
            </div>
           </div>
          </TableCell>
          <TableCell>{rolNombre}</TableCell>
          {/* Vendedor */}
          <TableCell>
           {user.rol_id === 3 ? (
            user.id_vendedor ? (
             <span className='inline-flex items-center gap-2 rounded  px-2 py-1 text-sm font-semibold text-white'>
              ID: {user.id} - {user.nombre} {user.apellidos}
             </span>
            ) : (
             <span className='text-white/50'>Sin vendedor asignado</span>
            )
           ) : (
            <span className='text-white/50'>-</span>
           )}
          </TableCell>

          {/* Estado */}
          <TableCell>
           <div className={`flex items-center gap-2 ${user.online === 1 ? 'text-lime-400' : 'text-orange-500'}`}>
            {user.online === 1 ? <Wifi className='w-4 h-4' /> : <WifiOff className='w-4 h-4' />}
            <span>{user.online === 1 ? 'En línea' : 'Desconectado'}</span>
           </div>
          </TableCell>

          {/* Cartones Jugados */}
          <TableCell className='text-center font-mono'>{user.cartones_jugados}</TableCell>

          {/* Fichas */}
          <TableCell className='font-mono'>{user.monedas}</TableCell>

          {/* Recarga de Fichas */}
          <TableCell className='w-[300px]'>
           <div className='flex items-center gap-2'>
            <Input
             type='number'
             placeholder='Fichas'
             value={rechargeAmount[user.id] || ''}
             onChange={e => handleAmountChange(user.id, e.target.value)}
             className='bg-zinc-800 border-zinc-700 text-white'
            />
            <Button size='sm' onClick={() => handleRecharge(user.id)} className='bg-sky-500 hover:bg-sky-600'>
             <PlusCircle className='w-4 h-4 mr-2' /> Recargar
            </Button>
           </div>
          </TableCell>
         </TableRow>
        );
       })}
      </TableBody>
     </Table>
    </div>
   </CardContent>
  </Card>
 );
}



function Panel({ users, sellers }) {
 return (
  <div className='container mx-auto px-4 sm:px-6 py-6'>
   <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6'>
    <h1 className='text-2xl sm:text-3xl md:text-4xl font-bold flex items-center gap-3'>
     <ShieldCheck className='w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 text-sky-400' />
     Panel de Administración
    </h1>
   </div>

   <div className='grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-6'>
    <Card className='bg-white/5 border-white/10 text-white'>
     <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
      <CardTitle className='text-sm font-medium'>Balance Total Jugadores</CardTitle>
      <DollarSign className='h-4 w-4 text-muted-foreground' />
     </CardHeader>
     <CardContent>
      <div className='text-xl sm:text-2xl font-bold'>{0}$$$</div>
     </CardContent>
    </Card>

    <Card className='bg-white/5 border-white/10 text-white'>
     <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
      <CardTitle className='text-sm font-medium'>Ganancias de la Casa</CardTitle>
      <Home className='h-4 w-4 text-sky-400' />
     </CardHeader>
     <CardContent>
      <div className='text-xl sm:text-2xl font-bold text-sky-400'>{0}</div>
     </CardContent>
    </Card>

    <Card className='bg-white/5 border-white/10 text-white'>
     <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
      <CardTitle className='text-sm font-medium'>Partidas Totales</CardTitle>
      <Gamepad2 className='h-4 w-4 text-muted-foreground' />
     </CardHeader>
     <CardContent>
      <div className='text-xl sm:text-2xl font-bold'>{2}</div>
     </CardContent>
    </Card>

    <Card className='bg-white/5 border-white/10 text-white'>
     <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
      <CardTitle className='text-sm font-medium'>Jugadores Activos</CardTitle>
      <BarChart2 className='h-4 w-4 text-muted-foreground' />
     </CardHeader>
     <CardContent>
      <div className='text-xl sm:text-2xl font-bold'>{1}</div>
     </CardContent>
    </Card>
   </div>

   <Tabs defaultValue='players' className='w-full'>
    <TabsList className='grid w-full grid-cols-1 mb-4'>
     <TabsTrigger value='players'>
      <Users className='w-4 h-4 mr-2' />
      Jugadores
     </TabsTrigger>
    </TabsList>

    <TabsContent value='players'>
     <PlayersManagement users={users} />
    </TabsContent>
   </Tabs>
  </div>
 );
}

export default Panel;
