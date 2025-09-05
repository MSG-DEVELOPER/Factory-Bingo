
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';

export default function RegisterForm() {
 const router = useRouter();
 const searchParams = useSearchParams();

 const [form, setForm] = useState({
  nombre: '',
  apellidos: '',
  email: '',
  password: '',
  cod_referido: ''
 });

 const [errors, setErrors] = useState({
  nombre: '',
  apellidos: '',
  email: '',
  password: '',
  cod_referido: ''
 });

 const [loading, setLoading] = useState(false);

 // ✅ Leer id de la URL y setear como V-XX en cod_referido
 useEffect(() => {
  const id = searchParams.get('id');
  if (id) {
   setForm(prev => ({ ...prev, cod_referido: `V-${id}` }));
  }
 }, [searchParams]);

 const validateForm = () => {
  let isValid = true;
  const newErrors = { nombre: '', apellidos: '', email: '', password: '', cod_referido: '' };

  if (!form.nombre.trim()) {
   newErrors.nombre = 'El nombre es obligatorio.';
   isValid = false;
  }

  if (!form.apellidos.trim()) {
   newErrors.apellidos = 'Los apellidos son obligatorios.';
   isValid = false;
  }

  if (!form.email.trim()) {
   newErrors.email = 'El correo electrónico es obligatorio.';
   isValid = false;
  } else if (!/\S+@\S+\.\S+/.test(form.email)) {
   newErrors.email = 'Correo electrónico no válido.';
   isValid = false;
  }

  if (!form.password.trim()) {
   newErrors.password = 'La contraseña es obligatoria.';
   isValid = false;
  } else if (form.password.length < 6) {
   newErrors.password = 'Mínimo 6 caracteres.';
   isValid = false;
  }

  setErrors(newErrors);
  return isValid;
 };

 const handleChange = e => {
  setForm({ ...form, [e.target.name]: e.target.value });
 };

 const handleSubmit = async e => {
  e.preventDefault();
  if (!validateForm()) return;
  setLoading(true);

  try {
   const res = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(form)
   });

   const data = await res.json();
   console.log('------------ data:', data);

   if (!res.ok) {
    if (data.status === 'Email ya registrado') {
     setErrors(prev => ({ ...prev, email: data.message }));
    } else {
     throw new Error(data.message || 'Error al registrar.');
    }
    return;
   }

   if (data.status === 201) {
    const result = await signIn('credentials', {
     redirect: false,
     email: form.email,
     password: form.password
    });

    if (result?.ok) {
    
    router.push('/');
     return;
    } else {
     console.log(result.error);
     return;
    }
   }


   router.push('/auth/login');
  } catch (error) {
  
  } finally {
   setLoading(false);
  }
 };

 return (
  <div className='w-full max-w-lg bg-gradient-to-br from-zinc-900 via-zinc-800 to-black p-4 rounded-3xl shadow-[0_0_30px_rgba(0,255,0,0.2)] border border-green-600'>
   <h2 className='text-4xl font-bold text-center text-green-400 drop-shadow-sm tracking-wide mb-8'>Crear Cuenta</h2>

   <form onSubmit={handleSubmit} className='space-y-6'>
  
    <div className='flex gap-4'>
     {/* Nombre */}
     <div className='w-1/2 space-y-2'>
      <label htmlFor='nombre' className='block text-sm font-medium text-green-200'>
       Nombre
      </label>
      <input
       id='nombre'
       name='nombre'
       value={form.nombre}
       onChange={handleChange}
       className={`w-full px-4 py-2 bg-black text-white border ${
        errors.nombre ? 'border-red-500' : 'border-green-500'
       } rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 transition`}
      />
      {errors.nombre && <p className='text-red-500 text-sm'>{errors.nombre}</p>}
     </div>

     {/* Apellidos */}
     <div className='w-1/2 space-y-2'>
      <label htmlFor='apellidos' className='block text-sm font-medium text-green-200'>
       Apellidos
      </label>
      <input
       id='apellidos'
       name='apellidos'
       value={form.apellidos}
       onChange={handleChange}
       className={`w-full px-4 py-2 bg-black text-white border ${
        errors.apellidos ? 'border-red-500' : 'border-green-500'
       } rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 transition`}
      />
      {errors.apellidos && <p className='text-red-500 text-sm'>{errors.apellidos}</p>}
     </div>
    </div>

    {/* Email + Código Referido */}
    <div className='flex gap-4'>
     

       {/* Contraseña sola (una fila completa) */}
    <div className='w-1/2 space-y-2'>
     <label htmlFor='password' className='block text-sm font-medium text-green-200'>
      Contraseña
     </label>
     <input
      id='password'
      name='password'
      type='password'
      value={form.password}
      onChange={handleChange}
      className={`w-full px-4 py-2 bg-black text-white border ${
       errors.password ? 'border-red-500' : 'border-green-500'
      } rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 transition`}
     />
     {errors.password && <p className='text-red-500 text-sm'>{errors.password}</p>}
    </div>

     

     {/* Código Referido */}
     <div className='w-1/2 space-y-2'>
      <label htmlFor='cod_referido' className='block text-sm font-medium text-green-200'>
       Código Referido
      </label>
      <input
       id='cod_referido'
       name='cod_referido'
       value={form.cod_referido}
       onChange={handleChange}
      //  readOnly
       className={`w-full px-4 py-2 bg-black text-white border ${
        errors.cod_referido ? 'border-red-500' : 'border-green-500'
       } rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 transition`}
      />
      {errors.cod_referido && <p className='text-red-500 text-sm'>{errors.cod_referido}</p>}
     </div>
    </div>
    <div className='space-y-2'>
      <label htmlFor='email' className='block text-sm font-medium text-green-200'>
       Correo electrónico
      </label>
      <input
       id='email'
       name='email'
       value={form.email}
       onChange={handleChange}
       className={`w-full px-4 py-2 bg-black text-white border ${
        errors.email ? 'border-red-500' : 'border-green-500'
       } rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 transition`}
      />
      {errors.email && <p className='text-red-500 text-sm'>{errors.email}</p>}
     </div>

    

    {/* Botón */}
    <button
     type='submit'
     disabled={loading}
     className='w-full py-3 text-center font-semibold text-black bg-green-400 hover:bg-green-500 transition rounded-2xl shadow-md disabled:opacity-50'
    >
     {loading ? 'Creando cuenta...' : 'Registrarse'}
    </button>
   </form>

   <div className='mt-6 text-center text-sm text-green-300'>
    ¿Ya tienes cuenta?{' '}
    <button
     type='button'
     onClick={() => router.push('/auth/login')}
     className='text-green-400 underline hover:text-green-500 transition font-medium'
    >
     Inicia sesión
    </button>
   </div>
  </div>
 );
}



