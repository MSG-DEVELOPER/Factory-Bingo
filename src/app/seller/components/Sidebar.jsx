'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { House, Gamepad2, Shield, Briefcase, Award,Bell, LogOut } from 'lucide-react';

const handleLogout = async () => {
 try {
  await fetch('../../api/seller/logout', { method: 'POST' });
 } catch (error) {
  console.error('Error al actualizar online:', error);
 } finally {
  signOut({ callbackUrl: '/auth/login' });
 }
};

function Sidebar() {
 const pathname = usePathname();

 const commonClasses = 'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200';
 const activeClassName = 'bg-sky-500/20 text-sky-300';
 const inactiveClassName = 'text-white/60 hover:bg-white/10 hover:text-white';

 return (
  <aside className='w-64 bg-zinc-900/50 p-4 flex flex-col justify-between h-screen border-r border-white/10'>
   <div>
    <div className='text-center py-4'>
     <h1 className='text-2xl font-bold flex items-center justify-center gap-2'>
      <Award className='text-sky-400' /> Bingo Family
     </h1>
    </div>

    <nav className='flex flex-col gap-2'>
     <Link href='/seller' className={`${commonClasses} ${pathname === '/' ? activeClassName : inactiveClassName}`}>
      <House className='w-5 h-5' />
      <span>Panel Principal</span>
     </Link>
    
     <Link href='/seller/notificaciones' className={`${commonClasses} ${pathname === '/user' ? activeClassName : inactiveClassName}`}>
      <Bell className='w-5 h-5' />
      <span>Notificaciones</span>
     </Link>
     
    </nav>
   </div>
   <div className='pt-6 sm:pt-0'>
    <button onClick={handleLogout} className={`${commonClasses} ${inactiveClassName} mt-4 sm:mt-6`}>
     <LogOut className='w-5 h-5 text-red-400' />
     <span className='text-red-400'>Cerrar sesión</span>
    </button>
   </div>
  </aside>
 );
}

export default Sidebar;
