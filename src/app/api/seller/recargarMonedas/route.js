import { NextResponse } from 'next/server';
import { conn } from '../../../lib/mysql';

export async function POST(req) {
  try {
    const body = await req.json();
    const { userId, amount } = body;

    if (!userId || !amount || isNaN(amount)) {
      return NextResponse.json(
        { success: false, message: 'Datos inválidos' },
        { status: 400 }
      );
    }

    // Aumentamos el valor de monedas actuales
    await conn.query(
      `UPDATE usuarios SET monedas = monedas + ? WHERE id = ?`,
      [amount, userId]
    );

    return NextResponse.json({
      success: true,
      message: `recarga existosa`
    });
  } catch (error) {
    console.error('Error al recargar monedas:', error);
    return NextResponse.json(
      { success: false, message: 'Error en el servidor' },
      { status: 500 }
    );
  }
}
