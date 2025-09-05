'use server'
import { NextResponse } from 'next/server';
import { conn } from "../../../../lib/mysql";

export async function POST(req) {
  try {
    const { userId } = await req.json();
    console.log("🚀 ~ POST ~ userId:", userId)
  

    if (!userId) {
      return NextResponse.json({ error: 'userId es requerido' }, { status: 400 });
    }

    const [sala] = await conn.query('SELECT id FROM salas WHERE tipo= 0 LIMIT 1');
    if (!sala.length) {
      return NextResponse.json({ error: 'Sala general no encontrada' }, { status: 404 });
    }

    const salaId = sala[0].id;

    await conn.query(
      'INSERT IGNORE INTO sala_jugadores (sala_id, usuario_id) VALUES (?, ?)',
      [salaId, userId]
    );

    return NextResponse.json({ success: true, salaId });
  } catch (err) {
    return NextResponse.json({ error: 'Error al unirse', details: err.message }, { status: 500 });
  }
}
