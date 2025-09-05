'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Award, 
  LayoutDashboard, 
  LogOut, 
  Menu, 
  Briefcase, 
  Bell, 
  Percent, 
  Trophy, 
  Server, 
  PlusSquare,
  ArrowLeftRight
} from 'lucide-react';


const handleLogout = async () => {
 try {
  await fetch('../../api/admin/logout', { method: 'POST' });
 } catch (error) {
  console.error('Error al actualizar online:', error);
 } finally {
  signOut({ callbackUrl: '/auth/login' });
 }
};

export default function Sidebar() {
 const pathname = usePathname();
 const [isOpen, setIsOpen] = useState(false);

 const commonClasses = 'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200';
 const activeClassName = 'bg-sky-500/20 text-sky-300';
 const inactiveClassName = 'text-white/60 hover:bg-white/10 hover:text-white';

 const sidebarContent = (
  <div className='flex flex-col gap-4 h-full'>
   <div className='text-center py-4 hidden md:block'>
    <h1 className='text-2xl font-bold flex items-center justify-center gap-2'>
     <Award className='text-sky-400' /> Bingo Family
    </h1>
   </div>

   <nav className='flex flex-col gap-2'>
    <Link
     href='/admin'
     onClick={() => setIsOpen(false)}
     className={`${commonClasses} ${pathname === '/admin' ? activeClassName : inactiveClassName}`}
    >
     <LayoutDashboard className='w-5 h-5' />
     <span>Panel General</span>
    </Link>


    <Link
     href='/admin/vendedores'
     className={`${commonClasses} ${pathname === '/admin/vendedores' ? activeClassName : inactiveClassName}`}
    >
     <Briefcase className='w-5 h-5' />
     <span>Vendedores</span>
    </Link>
    <Link
     href='/admin/configuracion'
     className={`${commonClasses} ${pathname === '/admin/configuracion' ? activeClassName : inactiveClassName}`}
    >
     <Percent className='w-5 h-5' />
     <span>Configuración</span>
    </Link>

    <Link
     href='/admin/transacciones'
     className={`${commonClasses} ${pathname === '/admin/transacciones' ? activeClassName : inactiveClassName}`}
    >
     <ArrowLeftRight className='w-5 h-5' />
     <span>Transacciones</span>
    </Link>

    <Link
     href='/admin/notificaciones'
     className={`${commonClasses} ${pathname === '/admin/notificaciones' ? activeClassName : inactiveClassName}`}
    >
     <Bell className='w-5 h-5' />
     <span>Notificaciones</span>
    </Link>

    <Link
     href='/admin/crearSala'
     className={`${commonClasses} ${pathname === '/admin/crearSala' ? activeClassName : inactiveClassName}`}
    >
     <PlusSquare className='w-5 h-5' />
     <span>Crear Sala</span>
    </Link>

    <Link
     href='/admin/salas'
     className={`${commonClasses} ${pathname === '/admin/salas' ? activeClassName : inactiveClassName}`}
    >
     <Server className='w-5 h-5' />
     <span>Salas</span>
    </Link>

    <Link
     href='/admin/cartones'
     className={`${commonClasses} ${pathname === '/admin/cartones' ? activeClassName : inactiveClassName}`}
    >
     <Trophy className='w-5 h-5' />
     <span>Cartones</span>
    </Link>
    
     </nav>

   <button onClick={handleLogout} className={`${commonClasses} ${inactiveClassName} mt-auto`}>
    <LogOut className='w-5 h-5 text-red-500' />
    <span className='text-red-400'>Cerrar sesión</span>
   </button>
  </div>
 );

 return (
  <>
   {/* Botón hamburguesa móvil */}
   <div className='md:hidden bg-zinc-900/50 p-3 border-b border-white/10 flex justify-between items-center'>
    <h1 className='text-lg font-bold flex items-center gap-2 text-white'>
     <Award className='text-sky-400' /> Bingo Family
    </h1>
    <button onClick={() => setIsOpen(true)} className='text-white hover:text-sky-300'>
     <Menu className='w-6 h-6' />
    </button>
   </div>

   {/* Mobile Sidebar */}
   <AnimatePresence>
    {isOpen && (
     <>
      {/* Fondo oscuro */}
      <motion.div
       initial={{ opacity: 0 }}
       animate={{ opacity: 0.5 }}
       exit={{ opacity: 0 }}
       transition={{ duration: 0.3 }}
       className='fixed inset-0 bg-black z-40 md:hidden'
       onClick={() => setIsOpen(false)}
      />
      {/* Panel lateral */}
      <motion.div
       initial={{ x: '-100%' }}
       animate={{ x: 0 }}
       exit={{ x: '-100%' }}
       transition={{ type: 'spring', stiffness: 300, damping: 30 }}
       className='fixed top-0 left-0 h-full w-64 bg-zinc-900/90 backdrop-blur-lg z-50 p-4 md:hidden'
      >
       {sidebarContent}
      </motion.div>
     </>
    )}
   </AnimatePresence>

   {/* Desktop Sidebar */}
   <aside className='w-64 bg-zinc-900/50 p-4 border-r border-white/10 hidden md:flex flex-col'>{sidebarContent}</aside>
  </>
 );
}
