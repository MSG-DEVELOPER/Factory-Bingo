import { NextResponse } from 'next/server';
import { conn } from "../../../../lib/mysql";

export async function GET() {
  try {
    const [rows] = await conn.query(
      'SELECT estado, tiempo_restante, ultimo_numero FROM salas WHERE tipo = 0 LIMIT 1'
    );

    if (!rows.length) {
      return NextResponse.json({ error: 'Sala general no encontrada' }, { status: 404 });
    }

    return NextResponse.json(rows[0]);
  } catch (err) {
    return NextResponse.json(
      { error: 'Error al obtener estado', details: err.message },
      { status: 500 }
    );
  }
}
