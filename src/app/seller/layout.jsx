'use server'
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { Toaster } from './components/ui/toaster';
import SidebarSeller from './components/Sidebar';

export default async function Layout({ children }) {
 const session = await getServerSession();

 if (!session?.user) {
  return redirect('/auth/login');
 }
 return (
  <>
   
    <div className='min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-black font-sans text-white'>
   
      <div className='flex'>
       <SidebarSeller />
       <main className='flex-grow p-4'>{children}</main>
      </div>
      <Toaster />
  
    </div>
 
  </>
 );
}
