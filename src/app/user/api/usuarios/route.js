import { NextResponse } from "next/server";
import { conn } from "../../../lib/mysql";
import { getServerSession } from "next-auth";

export async function GET() {
    try {
        const session = await getServerSession();

        const email = session.user.email;

        // Usuario actual
        const [user] = await conn.query(
            "SELECT * FROM usuarios WHERE email = ? LIMIT 1",
            [email]
        );

        // Todos los jugadores
        const users = await conn.query(
            "SELECT * FROM usuarios WHERE rol_id = 3"
        );

        // Todos los vendedores
        const sellers = await conn.query(
            "SELECT * FROM usuarios WHERE rol_id = 2"
        );

        return NextResponse.json({
            currentPlayer: user,
            players: users,
            sellers: sellers,
        });
    } catch (error) {
        console.error("❌ Error en /api/usuarios:", error);
        return NextResponse.json(
            { error: "Error en el servidor" },
            { status: 500 }
        );
    }
}
