import { conn } from '../lib/mysql';
import Seller from './components/SellerDashboard';

import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';

export default async function SellerDashboard() {
 const session = await getServerSession();

 if (!session) {
  redirect('/auth/login');
 }

 const email = session.user?.email;

 const [user] = await conn.query('SELECT * FROM usuarios WHERE email = ?', [email]);

 const id = user.id;

 const sellers = await conn.query('SELECT * FROM usuarios WHERE id_vendedor = ? AND rol_id = 3', [id]);

 return <Seller sellers={sellers} user={user}/>;
}
