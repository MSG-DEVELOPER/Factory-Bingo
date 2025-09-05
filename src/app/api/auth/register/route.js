import { NextResponse } from "next/server";
import { conn } from "../../../lib/mysql";
import bcrypt from "bcrypt";

export async function POST(request) {
  try {
    const body = await request.json();
    const { nombre, apellidos, email, password, cod_referido } = body;
   

    if (!nombre || !apellidos || !email || !password) {
      return NextResponse.json({ error: "Todos los campos son obligatorios." }, { status: 400 });
    }

    // ✅ Verificar si el correo ya está en uso
    const [existingUsers] = await conn.query(
      "SELECT * FROM usuarios WHERE email = ?",
      [email]
    );
   

    if (existingUsers) {
      return NextResponse.json(
        { message: "Email ya registrado" },
        { status: 400 }
      );
    }

    const [refer] = await conn.query(
      `SELECT id FROM usuarios WHERE codigo_vendedor = ?`,
      [cod_referido]
    );


    const hashedPassword = await bcrypt.hash(password, 10);

    const query = "INSERT INTO usuarios (id_vendedor,nombre, apellidos, email, password) VALUES (?,?, ?, ?, ?)";
    const values = [refer.id, nombre, apellidos, email, hashedPassword];

    await conn.query(query, values);

    return NextResponse.json(
      { message: "Usuario registrado correctamente." },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error al registrar usuario:", error);
    return NextResponse.json(
      { error: "Error en el servidor" },
      { status: 500 }
    );
  }
}
