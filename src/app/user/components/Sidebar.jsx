'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Gamepad2, Shield, Briefcase, Award, Home, LogIn, Star, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { signOut } from 'next-auth/react';

function Sidebar({ isOpen, closeSidebar }) {
 const handleLogout = async () => {
  try {
   await fetch('../../api/user/logout', { method: 'POST' });
  } catch (error) {
   console.error('Error al actualizar online:', error);
  } finally {
   signOut({ callbackUrl: '/auth/login' });
  }
 };

 const pathname = usePathname();

 const commonClasses = 'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200';
 const activeClassName = 'bg-sky-500/20 text-sky-300';
 const inactiveClassName = 'text-white/60 hover:bg-white/10 hover:text-white';

 const links = [
  { href: 'http://localhost:3000/user', label: 'Juegos', icon: Gamepad2 },
//   { href: '/unirse-sala', label: 'Unirse a Sala', icon: LogIn },
//   { href: '/salas-publicas', label: 'Salas Públicas', icon: Home },
//   { href: '/mis-cartones', label: 'Mis Cartones', icon: Star }
 ];

 const sidebarContent = (
  <div className='flex flex-col gap-4 h-full'>
   <div className='text-center py-4 hidden md:block'>
    <h1 className='text-2xl font-bold flex items-center justify-center gap-2'>
     <Award className='text-sky-400' /> Bingo Family
    </h1>
   </div>
   <nav className='flex flex-col gap-2'>
    {links.slice(0, 4).map(({ href, label, icon: Icon }) => (
     <Link
      key={href}
      href={href}
      onClick={closeSidebar}
      className={`${commonClasses} ${pathname === href ? activeClassName : inactiveClassName}`}
     >
      <Icon className='w-5 h-5' />
      <span>{label}</span>
     </Link>
    ))}
    <div className='my-2 border-t border-white/10'></div>
    {links.slice(4).map(({ href, label, icon: Icon }) => (
     <Link
      key={href}
      href={href}
      onClick={closeSidebar}
      className={`${commonClasses} ${pathname === href ? activeClassName : inactiveClassName}`}
     >
      <Icon className='w-5 h-5' />
      <span>{label}</span>
     </Link>
    ))}
   </nav>

   <div className='pt-6 sm:pt-0'>
    <button onClick={handleLogout} className={`${commonClasses} ${inactiveClassName} mt-4 sm:mt-6`}>
     <LogOut className='w-5 h-5 text-red-400' />
     <span className='text-red-400'>Cerrar sesión</span>
    </button>
   </div>
  </div>
 );

 return (
  <>
   {/* Mobile Sidebar */}
   <AnimatePresence>
    {isOpen && (
     <motion.div
      initial={{ x: '-100%' }}
      animate={{ x: 0 }}
      exit={{ x: '-100%' }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className='fixed top-0 left-0 h-full w-64 bg-zinc-900/90 backdrop-blur-lg z-50 p-4 md:hidden'
     >
      {sidebarContent}
     </motion.div>
    )}
   </AnimatePresence>

   {/* Desktop Sidebar */}
   <aside className='w-64 bg-zinc-900/50 p-4 border-r border-white/10 hidden md:flex flex-col'>{sidebarContent}</aside>
  </>
 );
}

export default Sidebar;
