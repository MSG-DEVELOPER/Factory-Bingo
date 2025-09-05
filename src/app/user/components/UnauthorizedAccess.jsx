
"use client"
import { motion } from 'framer-motion';
import { ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

function UnauthorizedAccess() {
    const navigate = useNavigate();

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center min-h-full text-center p-4"
        >
            <ShieldAlert className="w-24 h-24 text-red-500 mb-6" />
            <h1 className="text-4xl font-bold text-red-400">Acceso No Autorizado</h1>
            <p className="text-white/70 mt-4 max-w-md">
                No tienes los permisos necesarios para acceder a esta sección. 
                Por favor, contacta a un administrador si crees que esto es un error.
            </p>
            <Button 
                onClick={() => navigate('/')} 
                className="mt-8 bg-sky-600 hover:bg-sky-700"
            >
                Volver al Inicio
            </Button>
        </motion.div>
    );
}

export default UnauthorizedAccess;