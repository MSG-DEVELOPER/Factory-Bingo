
"use client"
import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useBingo } from '@/context_old/BingoContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Clock, CheckCircle, Tag, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const statusConfig = {
    scheduled: { text: 'Programada', icon: <Clock className="w-4 h-4 text-amber-400" />, color: 'text-amber-400' },
    active: { text: 'Activa', icon: <CheckCircle className="w-4 h-4 text-lime-400" />, color: 'text-lime-400' },
};

function PrivateRoomList() {
    const { rooms, sellers, joinRoomById } = useBingo();
    const navigate = useNavigate();

    const availableRooms = useMemo(() => {
        return rooms.filter(r => r.visibilidad === 'publica' && (r.status === 'active' || r.status === 'scheduled'));
    }, [rooms]);

    const getSellerName = (sellerId) => {
        const seller = sellers.find(s => s.id === sellerId);
        return seller ? seller.name : 'N/A';
    };

    const handleJoinRoom = (roomId) => {
        if (joinRoomById(roomId)) {
            navigate(`/juego/${roomId}`);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="container mx-auto"
        >
            <div className="text-center mb-8">
                <h1 className="text-3xl sm:text-4xl font-bold">Salas Públicas Disponibles</h1>
                <p className="text-white/60">Elige una sala para unirte a la partida.</p>
            </div>

            {availableRooms.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {availableRooms.map((room) => {
                        const status = statusConfig[room.status];
                        if (!status) return null; // No mostrar salas finalizadas, etc.
                        return (
                            <motion.div
                                key={room.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <Card className="bg-white/5 border-white/10 text-white flex flex-col h-full">
                                    <CardHeader>
                                        <CardTitle className="text-xl text-sky-400">{room.name}</CardTitle>
                                        <CardDescription>{room.description || '¡Únete a la diversión!'}</CardDescription>
                                    </CardHeader>
                                    <CardContent className="flex-grow space-y-3">
                                        <div className="flex items-center gap-2">
                                            <Tag className="w-4 h-4 text-white/50" />
                                            <span>Creada por: {getSellerName(room.sellerId)}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Users className="w-4 h-4 text-white/50" />
                                            <span>Jugadores: {room.players.length}</span>
                                        </div>
                                        <div className={`flex items-center gap-2 ${status.color}`}>
                                            {status.icon}
                                            <span>{status.text}</span>
                                        </div>
                                         <div className="flex items-center gap-2">
                                            <Clock className="w-4 h-4 text-white/50" />
                                            <span>Inicia: {new Date(room.startTime).toLocaleString()}</span>
                                        </div>
                                    </CardContent>
                                    <CardFooter>
                                        <Button className="w-full bg-lime-600 hover:bg-lime-700" onClick={() => handleJoinRoom(room.id)}>
                                            <Play className="w-4 h-4 mr-2"/>
                                            Unirse a la Sala
                                        </Button>
                                    </CardFooter>
                                </Card>
                            </motion.div>
                        );
                    })}
                </div>
            ) : (
                <div className="text-center py-20 bg-white/5 rounded-lg">
                    <h2 className="text-2xl font-semibold">No hay salas públicas disponibles</h2>
                    <p className="text-white/60 mt-2">Vuelve más tarde o únete a una sala privada con un código.</p>
                </div>
            )}
             <div className="text-center mt-8">
                <Button variant="outline" onClick={() => navigate('/')} className="bg-white/10 hover:bg-white/20 border-white/20">
                    Volver
                </Button>
            </div>
        </motion.div>
    );
}

export default PrivateRoomList;