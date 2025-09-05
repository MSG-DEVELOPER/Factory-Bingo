import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { conn } from '../../../lib/mysql';

export async function POST(req) {
  try {
    const body = await req.json();
    const { nombre, apellidos, codigo_vendedor } = body;

    if (!nombre || !apellidos || !codigo_vendedor) {
      return NextResponse.json(
        { success: false, message: 'Faltan datos obligatorios' },
        { status: 400 }
      );
    }

    const plainPassword = '1234'; // o genera uno seguro
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    // Inserta un vendedor con rol_id = 2 y código de vendedor
    await conn.query(
      `INSERT INTO usuarios (nombre, apellidos, rol_id, codigo_vendedor, password, created_at)
       VALUES (?, ?, 2, ?, ?, NOW())`,
      [nombre, apellidos, codigo_vendedor, hashedPassword]
    );

    return NextResponse.json(
      { success: true, message: 'Vendedor añadido correctamente' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error al insertar vendedor:', error);
    return NextResponse.json(
      { success: false, message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
