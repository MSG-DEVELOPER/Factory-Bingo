import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import WelcomeScreen from './components/WelcomeScreen';
import { conn } from '../lib/mysql';

async function page() {
 const session = await getServerSession();


 if (!session?.user) {
  return redirect('/auth/login');
 }

 const emialClient = session?.user.email;

 const [user] = await conn.query('SELECT * FROM usuarios WHERE email = ? LIMIT 1', [emialClient]);


 const sellers = await conn.query('SELECT * FROM usuarios WHERE rol_id = 2');

 const users = await conn.query('SELECT * FROM usuarios WHERE rol_id = 3');


 const idClient = user.id;

 return (
  <div>
   Estoy en el page principal
   <WelcomeScreen idClient={idClient} user={user} users={users} sellers={sellers} />
  </div>
 );
}

export default page;
