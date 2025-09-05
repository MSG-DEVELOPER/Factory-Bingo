import './globals.css';

export default async function RootLayout({ children }) {
 return (
  <html lang='es'>
   <body className='min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-black font-sans text-white'>
    <div className='flex'>
     <main className='flex-grow p-1'>{children}</main>
    </div>
   </body>
  </html>
 );
}
