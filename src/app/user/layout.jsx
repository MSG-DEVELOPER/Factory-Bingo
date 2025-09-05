'use client';

import { useState } from 'react';
import { BingoProvider } from './context/BingoContext';
import Sidebar from './components/Sidebar';
import { Toaster } from './components/ui/toaster';
import GameStartCountdownModal from './components/GameStartCountdownModal';
import { Menu, X } from 'lucide-react';
import { Button } from './components/ui/button';
import Link from 'next/link';

export default function RootClientLayout({ children }) {
 const [isSidebarOpen, setIsSidebarOpen] = useState(false);

 const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

 return (
  <BingoProvider>
   <div className='min-h-screen md:flex'>
    <div className='md:hidden p-4 flex justify-between items-center bg-zinc-900/80 backdrop-blur-sm sticky top-0 z-40'>
     <Link href='/' className='text-xl font-bold'>
      🎉 Bingo Familyyy
     </Link>
     <Button onClick={toggleSidebar} size='icon' variant='ghost'>
      {isSidebarOpen ? <X /> : <Menu />}
     </Button>
    </div>
    <Sidebar isOpen={isSidebarOpen} closeSidebar={() => setIsSidebarOpen(false)} />
    <main className='flex-grow  overflow-y-auto'>{children}</main>
   </div>
   <GameStartCountdownModal />
   <Toaster />
  </BingoProvider>
 );
}
