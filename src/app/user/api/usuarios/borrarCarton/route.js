import { NextResponse } from "next/server";
import { conn } from "../../../../lib/mysql";

export async function POST(req) {
    try {
        const data = await req.json();
        const { playerId, price } = data;
       

        // console.log("🚀 ~ POST ~ data:", data);

        await conn.query(
            `UPDATE usuarios SET monedas = monedas + ? WHERE id = ? AND monedas >= ?`,
            [price, playerId, price]
        );

        return NextResponse.json({
            status: "ok",
        });
    } catch (error) {
        console.error("❌ Error en /api/buyCarton:", error);
        return NextResponse.json(
            { error: "Error en el servidor" },
            { status: 500 }
        );
    }
}
