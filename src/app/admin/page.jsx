import { conn } from '../lib/mysql';
import AdminPanel from './components/AdminPanel';


export default async function AdminPage() {
 const users = await conn.query('SELECT * FROM usuarios');

 return <AdminPanel users={users} />; // Aquí sí lo renderizas como JSX
}
