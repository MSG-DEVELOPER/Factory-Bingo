import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { conn } from '../../../lib/mysql';

export async function POST(req) {
  try {
    const body = await req.json();
    const { nombre, apellidos, rol_id, id_vendedor, codigo_vendedor } = body;

    if (!nombre || !apellidos) {
      return NextResponse.json(
        { success: false, message: 'Faltan datos obligatorios' },
        { status: 400 }
      );
    }

    const plainPassword = '1234';
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    await conn.query(
      `INSERT INTO usuarios (nombre, apellidos, rol_id, id_vendedor, password, created_at)
   VALUES (?, ?, ?, ?, ?, ?, NOW())`,
      [
        nombre,
        apellidos,
        rol_id || null,
        rol_id === 3 ? id_vendedor : null,
        hashedPassword,
      ]
    );

    return NextResponse.json(
      { success: true, message: 'Jugador añadido correctamente' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error al insertar jugador:', error);
    return NextResponse.json(
      { success: false, message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
