
"use client"
import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useBingo } from '@/context_old/BingoContext';
import { Navigate, useNavigate } from 'react-router-dom';

function SellerDashboard() {
  const { sellers, currentPlayer } = useBingo();
  const navigate = useNavigate();

  const isAdmin = currentPlayer?.isAdmin;
  const isSeller = sellers.some(s => s.id === currentPlayer?.id);
  
  const sellerToView = useMemo(() => {
    if (isAdmin) {
      return sellers.find(s => s.id === 1) || sellers[0];
    }
    return sellers.find(s => s.id === currentPlayer?.id);
  }, [isAdmin, currentPlayer, sellers]);

  if (!isAdmin && !isSeller) {
    return <Navigate to="/unauthorized" replace />;
  }
  
  if (!sellerToView) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl">Vendedor no encontrado</h1>
        <p>No se pudo cargar la información del vendedor. Asegúrate de que haya al menos un vendedor en el sistema.</p>
        <button onClick={() => navigate('/')} className="mt-4 px-4 py-2 bg-sky-600 rounded">Volver al inicio</button>
      </div>
    );
  }
  
  // This component now acts as a gatekeeper. 
  // The full dashboard functionality is inside ProtectedSellerPanel.
  // We can redirect to the protected panel for a unified experience.
  // For this simulation, we'll just show a success message and link.
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto py-8 text-center"
    >
      <h1 className="text-3xl font-bold">Acceso de vendedor correcto</h1>
      <p className="mt-4">Serás redirigido al panel de vendedor.</p>
      <p className="mt-2">Si no eres redirigido, <a href="/acceso-vendedor" className="text-sky-400 underline">haz clic aquí</a>.</p>
       {/* Redirect logic could be placed here if needed */}
    </motion.div>
  );
}

export default SellerDashboard;