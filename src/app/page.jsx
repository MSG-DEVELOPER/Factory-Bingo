import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';


export default async function Page() {


  const session = await getServerSession();


  if (!session) {
    redirect('/auth/login');
  }

  // Usamos `image` como `id_rol`
  const roleId = session.user?.image;


  if (roleId === 1) {
    redirect('/admin');
  } else if (roleId === 2) {
    redirect('/seller');
  } else if (roleId === 3) {
    redirect('/user');
  }

  // Render opcional si no cae en ningún caso
  return (
    <div className="min-h-screen bg-black text-green-400 flex flex-col items-center justify-center px-4">
      <h1 className="text-4xl font-bold mb-4">
        ¡Bienvenido, {session.user?.name || 'usuario'}!
      </h1>
      <p className="text-lg text-green-200 mb-8">
        Estás autenticado con el correo:{' '}
        <span className="font-semibold">{session.user?.email}</span>
      </p>
      <div className="bg-zinc-900 p-6 rounded-xl border border-green-600 shadow-lg w-full max-w-md text-center">
        <p className="text-green-300">
          Aquí puedes mostrar contenido exclusivo para usuarios autenticados.
        </p>
      </div>
    </div>
  );
}
