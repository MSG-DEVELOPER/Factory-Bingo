

"use client"
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useBingo } from '@/context_old/BingoContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { KeySquare, LogIn, CheckCircle, Tag, Users, Clock, Ticket, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';

function JoinRoom() {
    const { rooms, joinRoomByCode, currentPlayer, sellers } = useBingo();
    const navigate = useNavigate();
    const [accessCode, setAccessCode] = useState('');
    const [foundRoom, setFoundRoom] = useState(null);

    const handleCheckCode = () => {
        if (!currentPlayer) {
            toast({ title: 'Debes iniciar sesión', description: 'Por favor, regístrate o juega como invitado para unirte a una sala.', variant: 'destructive' });
            navigate('/');
            return;
        }
        if (!accessCode) return;
        const room = rooms.find(r => r.accessCode?.toLowerCase() === accessCode.toLowerCase() && r.status !== 'finished');
        if (room) {
            setFoundRoom(room);
        } else {
            toast({ title: "Código no válido", description: "No se encontró una sala activa o programada con ese código.", variant: "destructive" });
            setFoundRoom(null);
        }
    };

    const handleJoinRoom = () => {
        if (!foundRoom) return;
        if (joinRoomByCode(foundRoom.accessCode)) {
            navigate(`/juego/${foundRoom.id}`);
        }
    };
    
    const getSellerName = (sellerId) => {
        if (sellerId === 'admin') {
            return (
                <span className="flex items-center gap-1 text-sky-400">
                    <ShieldCheck className="w-4 h-4" /> La Casa
                </span>
            );
        }
        const seller = sellers.find(s => s.id === sellerId);
        return seller ? seller.name : 'N/A';
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center min-h-[calc(100vh-10rem)]"
        >
            <Card className="w-full max-w-lg bg-white/5 border-white/10 text-white">
                <CardHeader className="text-center">
                    <CardTitle className="text-3xl font-bold">Unirse a una Sala</CardTitle>
                    <CardDescription>Introduce el código de la sala para ver sus detalles y unirte a la partida.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <div className="flex flex-col sm:flex-row gap-2">
                            <div className="relative flex-grow">
                                <KeySquare className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                                <Input
                                    id="access-code"
                                    placeholder="Ingresa el código"
                                    value={accessCode}
                                    onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
                                    className="bg-zinc-800 border-zinc-700 text-white pl-10"
                                />
                            </div>
                            <Button onClick={handleCheckCode} variant="secondary" disabled={!accessCode} className="w-full sm:w-auto">
                                Comprobar Código
                            </Button>
                        </div>
                    </div>

                    {foundRoom && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="p-4 bg-zinc-900/50 rounded-lg space-y-3"
                        >
                            <h3 className="text-lg font-semibold text-sky-400">{foundRoom.name}</h3>
                             <p className="text-sm text-white/70">{foundRoom.description}</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                                <div className="flex items-center gap-2"><Tag className="w-4 h-4 text-white/50" /> <span>Creador: {getSellerName(foundRoom.sellerId)}</span></div>
                                <div className="flex items-center gap-2"><Users className="w-4 h-4 text-white/50" /> <span>Jugadores: {foundRoom.players.length}</span></div>
                                <div className="flex items-center gap-2"><Ticket className="w-4 h-4 text-white/50" /> <span>Cartón: {foundRoom.cardPrice}€</span></div>
                                <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-white/50" /> <span>Inicia: {new Date(foundRoom.startTime).toLocaleString()}</span></div>
                            </div>
                            <div className="flex items-center gap-2 p-2 bg-lime-900/30 rounded-md text-lime-300">
                                <CheckCircle className="w-5 h-5" />
                                <span>¡Sala encontrada! Puedes unirte a la partida.</span>
                            </div>
                        </motion.div>
                    )}

                </CardContent>
                <CardFooter>
                    <Button onClick={handleJoinRoom} className="w-full bg-lime-600 hover:bg-lime-700 py-6 text-lg" disabled={!foundRoom}>
                        <LogIn className="w-5 h-5 mr-2" />
                        Entrar y Jugar
                    </Button>
                </CardFooter>
            </Card>
        </motion.div>
    );
}

export default JoinRoom;