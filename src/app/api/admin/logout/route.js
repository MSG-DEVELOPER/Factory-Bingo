import { NextResponse } from 'next/server';
import { conn } from '../../../lib/mysql';
import { getServerSession } from 'next-auth';

export async function POST() {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json({ success: false, message: 'No autenticado' }, { status: 401 });
    }

    await conn.query('UPDATE usuarios SET online = 0 WHERE email = ?', [session.user.email]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
    return NextResponse.json({ success: false, message: 'Error del servidor' }, { status: 500 });
  }
}
