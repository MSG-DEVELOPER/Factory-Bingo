'use server'
import { NextResponse } from 'next/server';
import { conn } from "../../../../lib/mysql";

let started = false;

export async function POST() {

  console.log('estoy en cron de inicioooo');
  
  if (!started) {
    console.log("⏰ Iniciando cron de sala general...");
    started = true;

    setInterval(async () => {
      try {
        const [sala] = await conn.query('SELECT * FROM salas WHERE tipo=0 LIMIT 1');
        if (!sala.length) return;

        const room = sala[0];

        if (room.estado === 'en_curso' && room.tiempo_restante > 0) {
          await conn.query(
            'UPDATE salas SET tiempo_restante = tiempo_restante - 1 WHERE id = ?',
            [room.id]
          );
          console.log(`Tick general: ${room.tiempo_restante - 1}s restantes`);
        }

        if (room.tiempo_restante <= 0 && room.estado === 'en_curso') {
          await conn.query(
            'UPDATE salas SET estado="finalizado" WHERE id = ?',
            [room.id]
          );
          console.log("🎉 Sala general finalizada");
        }
      } catch (err) {
        console.error("Error en cron general:", err);
      }
    }, 1000);
  }

  return NextResponse.json({ ok: true, running: true });
}
