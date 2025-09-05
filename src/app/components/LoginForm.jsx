'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

export default function LoginForm() {
 const router = useRouter();
 const [email, setEmail] = useState('');
 const [password, setPassword] = useState('');
 const [loading, setLoading] = useState(false);
 const [errors, setErrors] = useState({ email: '', password: '' });
 const [errorMessage, setErrorMessage] = useState('');

 const validateForm = () => {
  let isValid = true;
  const newErrors = { email: '', password: '' };

  // if (!email.trim()) {
  //   newErrors.email = 'El correo electrónico es obligatorio.';
  //   isValid = false;
  // } else if (!/\S+@\S+\.\S+/.test(email)) {
  //   newErrors.email = 'El correo no es válido.';
  //   isValid = false;
  // }

  // if (!password.trim()) {
  //   newErrors.password = 'La contraseña es obligatoria.';
  //   isValid = false;
  // }

  setErrors(newErrors);
  return isValid;
 };

 const handleSubmit = async e => {
  e.preventDefault();
  if (!validateForm()) return;
  setLoading(true);

  const result = await signIn('credentials', {
   redirect: false,
   email,
   password
  });



  if (result.ok === true) {
   router.push('/');
  } else {
   setErrorMessage('Usuario o Contraseña incorrectos');
  }

  setLoading(false);
 };

 return (
  <>
   <form
    onSubmit={handleSubmit}
    className='w-full max-w-md bg-gradient-to-br from-zinc-900 via-zinc-800 to-black p-8 rounded-2xl shadow-[0_0_20px_rgba(255,215,0,0.3)] space-y-6 border border-yellow-600'
   >
    <h2 className='text-3xl font-extrabold text-center text-yellow-400 drop-shadow-sm tracking-wider'>
     Iniciar Sesión
    </h2>

    <div className='space-y-1'>
     <label htmlFor='email' className='block text-sm text-yellow-200'>
      Correo electrónico
     </label>
     <input
      id='email'
      type='text'
      value={email}
      onChange={e => setEmail(e.target.value)}
      className={`w-full px-4 py-2 bg-black text-white border ${
       errors.email ? 'border-red-500' : 'border-yellow-500'
      } rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400`}
     />
     {errors.email && <p className='text-red-500 text-sm'>{errors.email}</p>}
    </div>

    <div className='space-y-1'>
     <label htmlFor='password' className='block text-sm text-yellow-200'>
      Contraseña
     </label>
     <input
      id='password'
      type='password'
      value={password}
      onChange={e => setPassword(e.target.value)}
      className={`w-full px-4 py-2 bg-black text-white border ${
       errors.password ? 'border-red-500' : 'border-yellow-500'
      } rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400`}
     />
     {errors.password && <p className='text-red-500 text-sm'>{errors.password}</p>}
    </div>
    <div>{errorMessage && <span className='text-red-600'>{errorMessage}</span>}</div>
    <button
     type='submit'
     className='w-full py-2 font-semibold text-black bg-yellow-400 hover:bg-yellow-500 transition rounded-xl shadow-md disabled:opacity-50'
     disabled={loading}
    >
     {loading ? 'Ingresando...' : 'Entrar'}
    </button>
    <div className='mt-6 text-center text-sm text-yellow-300'>
     ¿No tienes cuenta?{' '}
     <button
      type='button'
      onClick={() => router.push('/auth/register')}
      className='text-yellow-400 underline hover:text-yellow-500 transition font-medium'
     >
      Regístrate
     </button>
    </div>
   </form>
  </>
 );
}
