import NextAuth from "next-auth";
import { conn } from "../../../lib/mysql"
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

export const authOptions = {
  session: { maxAge: 7200 },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials, req) {
        try {
          const { email, password } = credentials;

          if (!email || !password) {
            throw new Error("El email y la contraseña son obligatorios");
          }

          // Aquí haces destructuring para obtener las filas (rows)
          const rows = await conn.query("SELECT * FROM usuarios WHERE email = ?", [email]);
          const usuario = rows[0];

          if (!usuario) {
            console.log("Usuario no encontrado");
            return null;
          }

          // Validar password usando bcrypt (contraseña hasheada)
          const isPasswordValid = await bcrypt.compare(password, usuario.password);
          if (!isPasswordValid) {
            console.log("Contraseña inválida");
            return null;
          }

          const query = 'UPDATE usuarios SET status = ?, online = ? WHERE email = ?';
          await conn.query(query, [1, 1, email]);


          return {
            id: usuario.id + '',
            name: usuario.nombre,
            email: usuario.email,
            image: usuario.rol_id,

          };
        } catch (error) {
          console.error("Error durante la autorización:", error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: '/auth/login'
  }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
