'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import {
 Award,
 ArrowLeftRight,
 Bell,
 LayoutDashboard,
 Briefcase,
 Percent,
 Trophy,
 Server,
 LogOut,
 PlusSquare
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

function Sidebar() {
 const pathname = usePathname();

 const commonClasses = 'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200';
 const activeClassName = 'bg-sky-500/20 text-sky-300';
 const inactiveClassName = 'text-white/60 hover:bg-white/10 hover:text-white';

 return (
  <aside className='w-full sm:w-64 bg-zinc-900/50 p-4 flex flex-col justify-between min-h-screen border-r border-white/10 overflow-y-auto'>
   <div>
    <div className='text-center py-4'>
     <h1 className='text-xl sm:text-2xl font-bold flex items-center justify-center gap-2'>
      <Award className='text-sky-400 w-6 h-6 sm:w-7 sm:h-7' />
      <span className='truncate'>Bingo Family</span>
     </h1>
    </div>

    <nav className='flex flex-col gap-2'>
     <Link href='/admin' className={`${commonClasses} ${pathname === '/admin' ? activeClassName : inactiveClassName}`}>
      <LayoutDashboard className='w-5 h-5' />
      <span>Panel General</span>
     </Link>
    </nav>

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

    <button onClick={handleLogout} className={`${commonClasses} ${inactiveClassName} mt-4 sm:mt-6`}>
     <LogOut className='w-5 h-5 text-red-500' />
     <span className='text-red-400'>Cerrar sesión</span>
    </button>
   </div>
  </aside>
 );
}

export default Sidebar;
