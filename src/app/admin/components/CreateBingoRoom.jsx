
"use client"
import { motion } from 'framer-motion';
import { useBingo } from '../context_old/BingoContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Gamepad2, PlusCircle } from 'lucide-react';
import RoomForm from '../components/RoomForm';

function CreateBingoRoom({ seller }) {
    const { createRoom } = useBingo();

    const handleCreate = (roomData) => {
        createRoom({
            ...roomData,
            sellerId: seller.id,
        });
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="flex flex-col sm:flex-row items-center gap-4 mb-8">
                <Gamepad2 className="w-10 h-10 text-sky-400" />
                <h1 className="text-3xl sm:text-4xl font-bold text-center sm:text-left">Crear Mi Bingo</h1>
            </div>

            <Card className="bg-white/5 border-white/10 text-white max-w-4xl mx-auto">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg sm:text-xl"><PlusCircle />Configura Tu Sala Personalizada</CardTitle>
                    <CardDescription>Crea una experiencia única para tus jugadores. Las salas que crees aparecerán en la sección "Mis Salas".</CardDescription>
                </CardHeader>
                <RoomForm onSave={handleCreate} sellerId={seller.id} initialData={{}} />
            </Card>
        </motion.div>
    );
}

export default CreateBingoRoom;