'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { PlusCircle, MinusCircle, XCircle, UserPlus, Copy, LinkIcon } from 'lucide-react';

function SellersManagement({ sellers }) {
  const [newSellerName, setNewSellerName] = useState('');
  const [newSellerLastName, setNewSellerLastName] = useState('');
  const [newSellerCode, setNewSellerCode] = useState('');

  async function handleAddSeller(e) {
    e.preventDefault();

    if (!newSellerName || !newSellerLastName || !newSellerCode) {
      alert('Por favor, completa todos los campos');
      return;
    }

    try {
      const res = await fetch('/api/admin/addSeller', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: newSellerName,
          apellidos: newSellerLastName,
          codigo_vendedor: newSellerCode
        })
      });

      const data = await res.json();
      if (data.success === true) {
        location.reload();
      } else {
        alert('Error al crear vendedor');
      }
    } catch (error) {
      alert('Error en la comunicación con el servidor');
      console.error(error);
    }
  }

  const handleCopyLink = codigo => {
    const url = `${window.location.origin}/auth/register?id=${codigo}`;
    navigator.clipboard.writeText(url).then(() => {
      alert(`¡Enlace copiado al portapapeles!\n${url}`);
    });
  };

  return (
    <div className='space-y-6'>
      {/* Formulario dinámico */}
      <Card className='bg-white/5 border-white/10 text-white'>
        <CardHeader>
          <CardTitle>Añadir Nuevo Vendedor</CardTitle>
          <CardDescription>Crea una nueva cuenta de vendedor en el sistema.</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleAddSeller}
            className='flex flex-col gap-2 p-4 bg-zinc-900/50 rounded-lg'
          >
            <div className='flex gap-2'>
              <Input
                placeholder='Nombre'
                value={newSellerName}
                onChange={e => setNewSellerName(e.target.value)}
                className='bg-zinc-800 border-zinc-700 text-white'
              />
              <Input
                placeholder='Apellidos'
                value={newSellerLastName}
                onChange={e => setNewSellerLastName(e.target.value)}
                className='bg-zinc-800 border-zinc-700 text-white'
              />
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-2'>
              <Input
                placeholder='Código de Referido (ej. V-01)'
                value={newSellerCode}
                onChange={e => setNewSellerCode(e.target.value)}
                className='bg-zinc-800 border-zinc-700 text-white'
              />
            </div>
            <Button type='submit' className='bg-sky-500 hover:bg-sky-600 mt-2'>
              <UserPlus className='w-4 h-4 mr-2' /> Añadir Vendedor
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Tabla dinámica */}
      <Card className='bg-white/5 border-white/10 text-white'>
        <CardHeader>
          <CardTitle>Gestión de Vendedores</CardTitle>
          <CardDescription>Administra los vendedores registrados.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='overflow-x-auto'>
            <Table>
              <TableHeader>
                <TableRow className='border-white/20 hover:bg-white/10'>
                  <TableHead className='text-white'>Vendedor</TableHead>
                  <TableHead className='text-white'>Código</TableHead>
                  <TableHead className='text-white text-center'>Jugadores</TableHead>
                  <TableHead className='text-white'>Comisión</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sellers.map(seller => (
                  <TableRow
                    key={seller.id}
                    className='border-white/20 hover:bg-white/10'
                  >
                    <TableCell>
                      <div className='flex items-center gap-3'>
                        <p className='font-semibold'>
                          {seller.nombre} {seller.apellidos}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className='flex items-center gap-2 font-mono text-sky-400'>
                        <button
                          onClick={() => handleCopyLink(seller.codigo_vendedor)}
                          className='flex items-center gap-2 text-sky-400 hover:text-sky-300 focus:outline-none'
                          title='Copiar enlace de registro'
                        >
                          <LinkIcon className='w-4 h-4' />
                          <span>{seller.codigo_vendedor}</span>
                        </button>
                      </div>
                    </TableCell>
                    <TableCell className='text-center font-bold'>
                      {seller.num_referidos}
                    </TableCell>
                    <TableCell className='font-mono text-lime-400'>
                      {seller.comision}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default SellersManagement;
