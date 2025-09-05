'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { DollarSign, Users, Tag, BarChart, Download, PlusCircle, Wifi, WifiOff, Coins, UserPlus } from 'lucide-react';

function SellerPlayerManagement({ sellers }) {
 const [rechargeAmount, setRechargeAmount] = useState({});

 const handleAmountChange = (playerId, value) => {
  setRechargeAmount(prev => ({
   ...prev,
   [playerId]: value
  }));
 };

 const handleRecharge = async playerId => {
  const amount = rechargeAmount[playerId];
  if (!amount || isNaN(amount)) {
   alert('Introduce una cantidad válida');
   return;
  }

  const res = await fetch('../../api/seller/recargarMonedas', {
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

 return (
  <Card className='bg-white/5 border-white/10 text-white mt-4'>
   <CardHeader>
    <CardTitle>Gestión de Jugadores Referidos</CardTitle>
   </CardHeader>
   <CardContent>
    <div className='overflow-x-auto'>
     <Table>
      <TableHeader>
       <TableRow className='border-white/20 hover:bg-white/10'>
        <TableHead className='text-white'>Jugador</TableHead>
        <TableHead className='text-white'>Email</TableHead>
        <TableHead className='text-white'>Estado</TableHead>

        <TableHead className='text-white'>Fichas</TableHead>
        <TableHead className='text-white text-center'>Recargar Fichas</TableHead>
       </TableRow>
      </TableHeader>
      <TableBody>
       {sellers.map(seller => (
        <TableRow key={seller.id} className='border-white/20 hover:bg-white/10'>
         <TableCell className='min-w-[200px]'>
          <div className='flex items-center gap-3'>
           <div>
            <p className='font-semibold'>
             {seller.nombre} {seller.apellidos}
            </p>
            <p className='text-xs text-white/60'>ID: {seller.id}</p>
           </div>
          </div>
         </TableCell>
         <TableCell className='min-w-[200px]'>
          <div className='flex items-center gap-3'>
           <div>
            <p className='font-semibold'>{seller.email}</p>
           </div>
          </div>
         </TableCell>
         <TableCell>
          <div className={`flex items-center gap-2 ${seller.online === 1 ? 'text-lime-400' : 'text-white/50'}`}>
           {seller.online ? <Wifi className='w-4 h-4' /> : <WifiOff className='w-4 h-4' />}
           <span>{seller.online ? 'En línea' : 'Desconectado'}</span>
          </div>
         </TableCell>

         <TableCell className='font-mono'>{seller.monedas}</TableCell>
         <TableCell className='w-[300px]'>
          <div className='flex items-center gap-2'>
           <Input
            type='number'
            placeholder='Fichas'
            value={rechargeAmount[seller.id] || ''}
            onChange={e => handleAmountChange(seller.id, e.target.value)}
            className='bg-zinc-800 border-zinc-700 text-white'
           />
           <Button size='sm' onClick={() => handleRecharge(seller.id)} className='bg-sky-500 hover:bg-sky-600'>
            <PlusCircle className='w-4 h-4 mr-2' /> Recargar
           </Button>
          </div>
         </TableCell>
        </TableRow>
       ))}
      </TableBody>
     </Table>
    </div>
   </CardContent>
  </Card>
 );
}

function SellerDashboard({ sellers, user }) {
 const [showAddUserModal, setShowAddUserModal] = useState(false);
 const [newUser, setNewUser] = useState({ nombre: '', apellidos: '', email: '' });
 const [showWithdrawModal, setShowWithdrawModal] = useState(false);

 const [retiro, setRetiro] = useState({
  titulo: '',
  descripcion: ''
 });

 const handleAddUserClick = () => {
  setShowAddUserModal(true);
 };

 const handleInputChange = e => {
  setNewUser(prev => ({ ...prev, [e.target.name]: e.target.value }));
 };

 const handleSubmitNewUser = async () => {
  if (!newUser.nombre || !newUser.apellidos || !newUser.email) {
   alert('Rellena todos los campos');
   return;
  }

  const res = await fetch('../../api/seller/addUser', {
   method: 'POST',
   headers: { 'Content-Type': 'application/json' },
   body: JSON.stringify({ ...newUser, codigo_vendedor: user.codigo_vendedor })
  });

  const data = await res.json();
  if (data.success) {
   location.reload();
  } else {
   alert('Error al añadir usuario');
  }
 };

 // Función para abrir el modal de Solicitar Retiro
 const handleWithdrawClick = () => {
  setShowWithdrawModal(true);
 };

 // Función para actualizar el estado con los inputs del modal
 const handleChange = e => {
  const { name, value } = e.target;
  setRetiro(prev => ({
   ...prev,
   [name]: value
  }));
 };

 // Función para enviar la solicitud de retiro (ejemplo, puedes adaptarla)
 const handleSubmitWithdraw = () => {
  console.log('Solicitud enviada:', retiro);
 };

 return (
  <div className='container mx-auto py-8'>
   <div className='flex flex-col md:flex-row items-start md:items-center justify-between mb-8'>
    <div className='flex items-center gap-4 mb-4 md:mb-0'>
     <div>
      <h1 className='text-4xl font-bold'>
       {user.nombre} {user.apellidos}
      </h1>
      <p className='text-sky-400 font-mono'>Código de Referido: {user.codigo_vendedor}</p>
     </div>
    </div>

    <div className='flex gap-2'>
     <Button
      onClick={handleAddUserClick}
      className='bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-2xl shadow-md transition-all duration-200'
     >
      <UserPlus className='w-4 h-4 mr-2 group-hover:scale-110' />
      Añadir Usuario
     </Button>
     <Button
      onClick={handleWithdrawClick}
      className='bg-lime-500 hover:bg-lime-600 text-white px-4 py-2 rounded-2xl shadow-md transition-all duration-200'
     >
      <Download className='w-4 h-4 mr-2 group-hover:scale-110' />
      Solicitar Retiro
     </Button>
    </div>
   </div>

   <Tabs defaultValue='dashboard' className='w-full'>
    <TabsList className='grid w-full grid-cols-2'>
     <TabsTrigger value='dashboard'>
      <BarChart className='w-4 h-4 mr-2' />
      Dashboard
     </TabsTrigger>
     <TabsTrigger value='players'>
      <Users className='w-4 h-4 mr-2' />
      Gestión de Jugadores
     </TabsTrigger>
    </TabsList>
    <TabsContent value='dashboard'>
     <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-5 my-6'>
      <Card className='bg-white/5 border-white/10 text-white'>
       <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <CardTitle className='text-sm font-medium'>Mis fichas</CardTitle>
        <Coins className='h-4 w-4 text-purple-500' />
       </CardHeader>
       <CardContent>
        <div className='text-2xl font-bold text-purple-500'>{user.monedas}</div>
       </CardContent>
      </Card>
      <Card className='bg-white/5 border-white/10 text-white'>
       <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <CardTitle className='text-sm font-medium'>Jugadores Referidos</CardTitle>
        <Users className='h-4 w-4 text-sky-400' />
       </CardHeader>
       <CardContent>
        <div className='text-2xl font-bold'>{sellers.length}</div>
       </CardContent>
      </Card>
      <Card className='bg-white/5 border-white/10 text-white'>
       <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <CardTitle className='text-sm font-medium'>Saldo de Comisión</CardTitle>
        <DollarSign className='h-4 w-4 text-lime-400' />
       </CardHeader>
       <CardContent>
        <div className='text-2xl font-bold text-white'>{user.comision.toFixed(2)}€</div>
        <p className='text-xs text-muted-foreground'>Disponible para retirar</p>
       </CardContent>
      </Card>

      <Card className='bg-white/5 border-white/10 text-white'>
       <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <CardTitle className='text-sm font-medium'>Total Cartones Vendidos</CardTitle>
        <Tag className='h-4 w-4 text-fuchsia-400' />
       </CardHeader>
       <CardContent>
        <div className='text-2xl font-bold'>{0}</div>
        <p className='text-xs text-muted-foreground'>A través de tus referidos</p>
       </CardContent>
      </Card>
      <Card className='bg-white/5 border-white/10 text-white'>
       <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <CardTitle className='text-sm font-medium'>Tasa de Comisión</CardTitle>
        <BarChart className='h-4 w-4 text-amber-400' />
       </CardHeader>
       <CardContent>
        <div className='text-2xl font-bold'>{0}%</div>
        <p className='text-xs text-muted-foreground'>Por cada venta de cartón</p>
       </CardContent>
      </Card>
     </div>

     <Card className='bg-white/5 border-white/10 text-white'>
      <CardHeader>
       <CardTitle>Historial de Comisiones Recientes</CardTitle>
      </CardHeader>
      <CardContent>
       <div className='overflow-x-auto max-h-96'>
        <Table>
         <TableHeader>
          <TableRow className='border-white/20 hover:bg-white/10'>
           <TableHead className='text-white'>Fecha</TableHead>
           <TableHead className='text-white'>Cartones</TableHead>
           <TableHead className='text-white'>Comisión</TableHead>
          </TableRow>
         </TableHeader>
         <TableBody>
          {/* {sellerPurchaseHistory.slice(0, 10).map(purchase => (
           <TableRow key={purchase.id} className='border-white/20 hover:bg-white/10'>
            <TableCell>{new Date(purchase.date).toLocaleDateString()}</TableCell>
            <TableCell>{purchase.cardsPurchased}</TableCell>
            <TableCell className='font-mono text-lime-400'>+${purchase.commissionGenerated.toFixed(2)}</TableCell>
           </TableRow>
          ))} */}
         </TableBody>
        </Table>
       </div>
      </CardContent>
     </Card>
    </TabsContent>
    <TabsContent value='players'>
     <SellerPlayerManagement sellers={sellers} />
    </TabsContent>
   </Tabs>

   {showAddUserModal && (
    <div className='fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50'>
     <div className='w-full max-w-md bg-gradient-to-br from-zinc-900 via-zinc-800 to-black p-8 rounded-3xl shadow-[0_0_30px_rgba(255,215,0,0.2)] border border-orange-600'>
      <h2 className='text-3xl font-bold text-center text-orange-500 drop-shadow-sm tracking-wide mb-6'>
       Añadir Usuario
      </h2>

      <div className='space-y-5'>
       <div>
        <label className='block text-sm font-medium text-orange-200 mb-2'>Nombre</label>
        <input
         name='nombre'
         value={newUser.nombre}
         onChange={handleInputChange}
         placeholder='Ej. Juan'
         className='w-full px-4 py-2 bg-black text-white border border-orange-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 transition placeholder:text-orange-100/50'
        />
       </div>

       <div>
        <label className='block text-sm font-medium text-orange-200 mb-2'>Apellidos</label>
        <input
         name='apellidos'
         value={newUser.apellidos}
         onChange={handleInputChange}
         placeholder='Ej. Pérez García'
         className='w-full px-4 py-2 bg-black text-white border border-orange-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 transition placeholder:text-orange-100/50'
        />
       </div>

       <div>
        <label className='block text-sm font-medium text-orange-200 mb-2'>Email</label>
        <input
         name='email'
         type='email'
         value={newUser.email}
         onChange={handleInputChange}
         placeholder='ejemplo@email.com'
         className='w-full px-4 py-2 bg-black text-white border border-orange-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 transition placeholder:text-orange-100/50'
        />
       </div>
      </div>

      <div className='flex justify-end gap-3 mt-8'>
       <button
        onClick={() => setShowAddUserModal(false)}
        className='px-4 py-2 bg-zinc-700 hover:bg-zinc-600 text-white border border-white/10 rounded-xl transition'
       >
        Cancelar
       </button>
       <button
        onClick={handleSubmitNewUser}
        className='px-4 py-2 bg-orange-400 hover:bg-orange-500 text-black font-semibold rounded-xl shadow-md transition'
       >
        Guardar
       </button>
      </div>
     </div>
    </div>
   )}

   {showWithdrawModal && (
    <div className='fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50'>
     <div className='w-full max-w-md bg-gradient-to-br from-zinc-900 via-zinc-800 to-black p-10 rounded-3xl shadow-[0_0_30px_rgba(255,215,0,0.2)] border border-lime-600'>
      <h2 className='text-3xl font-bold text-center text-lime-400 drop-shadow-sm tracking-wide mb-8'>
       Solicitar Retiro
      </h2>

      <div className='space-y-6'>
       <div>
        <label className='block text-sm font-medium text-lime-300 mb-2'>Título</label>
        <input
         name='titulo'
         value={retiro.titulo}
         onChange={handleChange}
         placeholder='Ej. Retiro de ganancias'
         className='w-full px-4 py-2 bg-black text-white border border-lime-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-lime-400 transition placeholder:text-lime-100/50'
        />
       </div>

       <div>
        <label className='block text-sm font-medium text-lime-300 mb-2'>Descripción</label>
        <textarea
         name='descripcion'
         value={retiro.descripcion}
         onChange={handleChange}
         placeholder='Detalles adicionales'
         className='w-full px-4 py-2 bg-black text-white border border-lime-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-lime-400 transition placeholder:text-lime-100/50 resize-none'
         rows={4}
        />
       </div>
      </div>

      <div className='flex justify-end gap-3 mt-8'>
       <button
        onClick={() => setShowWithdrawModal(false)}
        className='px-4 py-2 bg-zinc-700 hover:bg-zinc-600 text-white border border-white/10 rounded-xl transition'
       >
        Cancelar
       </button>
       <button
        onClick={handleSubmitWithdraw}
        className='px-4 py-2 bg-lime-400 hover:bg-lime-500 text-black font-semibold rounded-xl shadow-md transition'
       >
        Enviar Solicitud
       </button>
      </div>
     </div>
    </div>
   )}
  </div>
 );
}

export default SellerDashboard;
