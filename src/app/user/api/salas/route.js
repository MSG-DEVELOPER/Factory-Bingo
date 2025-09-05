import { NextResponse } from 'next/server';
import { conn } from "../../../lib/mysql";

export async function GET() {
    try {
        const rows = await conn.query('SELECT * FROM salas WHERE id = 1');
        console.log("🚀 ~ GET ~ rows:", rows)
        if (!rows.length) {
            return NextResponse.json({ error: 'Sala general no encontrada' }, { status: 404 });
        }
        return NextResponse.json(rows);
    } catch (err) {
        return NextResponse.json({ error: 'Error al obtener estado', details: err.message }, { status: 500 });
    }
}
