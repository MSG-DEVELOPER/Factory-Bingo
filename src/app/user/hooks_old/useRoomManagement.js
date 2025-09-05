
import { useState, useEffect, useCallback } from 'react';
import { toast } from '../components/ui/use-toast';
import { useRouter } from 'next/navigation';




const defaultGeneralRoom = {
    id: 'general',
    name: 'Sala General',
    isPrivate: false,
    accessCode: null,
    sellerId: 'admin',
    status: 'active',
    players: [],
    visibilidad: 'publica'
};

export const useRoomManagement = (userManagement, settings) => {



    const router = useRouter()
    const { currentPlayer } = userManagement;
    const { cardPrice, autoPlaySpeed, activePatterns } = settings;

    const [rooms, setRooms] = useState([]);
    const [activeRoom, setActiveRoom] = useState([]);



    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const res = await fetch("/user/api/salas");
                if (!res.ok) throw new Error("Error al obtener salas");
                const data = await res.json();

                setRooms(data);
                setActiveRoom(data[0])

                // Si hay una sala general, la establecemos
                const general = data.find(r => r.nombre = "general");
                if (general) {
                    setActiveRoom({
                        ...general,
                        cardPrice,
                        autoPlaySpeed,
                        patterns: activePatterns,
                    });
                }
            } catch (err) {
                console.error("Error cargando salas:", err);
            }
        };

        fetchRooms();
    }, [cardPrice, autoPlaySpeed, activePatterns]);

    
    const validateRoomData = (roomDetails, existingRoomId = null) => {
        const { name, startTime, cardPrice, accessCode, patterns } = roomDetails;
        if (!name || !startTime || !cardPrice || !accessCode) {
            toast({ title: "Campos Requeridos", description: "Por favor, completa todos los campos obligatorios.", variant: "destructive" });
            return false;
        }
        if (!patterns || Object.keys(patterns).length === 0) {
            toast({ title: "Patrones Requeridos", description: "Debes seleccionar al menos un patrón de victoria.", variant: "destructive" });
            return false;
        }
        if (new Date(startTime) <= new Date()) {
            toast({ title: "Fecha Inválida", description: "La fecha de inicio debe ser en el futuro.", variant: "destructive" });
            return false;
        }
        if (rooms.some(r => r.accessCode === accessCode && r.status !== 'finished' && r.id !== existingRoomId)) {
            toast({ title: "Código Duplicado", description: "El código de acceso ya está en uso en una sala activa o programada.", variant: "destructive" });
            return false;
        }
        return true;
    };

    const createRoom = (roomDetails) => {
        if (!validateRoomData(roomDetails)) return;

        const newRoom = {
            id: `room_${Date.now()}`,
            ...roomDetails,
            isPrivate: roomDetails.visibilidad === 'privada',
            status: 'scheduled',
            players: [],
        };
        setRooms(prev => [...prev, newRoom]);
        toast({ title: "Sala Creada con Éxito", description: `La sala "${newRoom.name}" ha sido programada.` });
    };

    const updatePrivateRoom = (updatedRoomData) => {
        if (!validateRoomData(updatedRoomData, updatedRoomData.id)) return;

        setRooms(prevRooms => prevRooms.map(room => {
            if (room.id === updatedRoomData.id) {
                if (room.status !== 'scheduled') {
                    toast({ title: "Error", description: "Solo se pueden editar salas que aún no han comenzado.", variant: "destructive" });
                    return room;
                }
                toast({ title: "Sala Actualizada", description: `La sala "${updatedRoomData.name}" ha sido modificada.` });
                return { ...room, ...updatedRoomData, isPrivate: updatedRoomData.visibilidad === 'privada' };
            }
            return room;
        }));
    };

    const joinGeneralRoom = () => {
        const generalRoom = rooms.find(r => r.nombre === 'general');

        if (generalRoom) {
            const roomWithSettings = {
                ...generalRoom,
                cardPrice,
                autoPlaySpeed,
                patterns: activePatterns,
            };
            setActiveRoom(roomWithSettings);
            return true;
        }
        return false;
    };

    const joinRoomById = (roomId) => {
        const room = rooms.find(r => r.id === roomId);
        if (room) {
            if (room.players.some(p => p.id === currentPlayer.id)) {
                toast({ title: "Ya estás en la sala", description: "No puedes unirte dos veces a la misma sala.", variant: "destructive" });
                return false;
            }
            setActiveRoom(room);
            toast({ title: "¡Bienvenido!", description: `Has entrado a la sala "${room.name}".` });
            return true;
        } else {
            toast({ title: "Error", description: "No se pudo encontrar la sala seleccionada.", variant: "destructive" });
            return false;
        }
    };

    const joinRoomByCode = (code) => {
        const room = rooms.find(r => r.accessCode?.toLowerCase() === code.toLowerCase() && r.status !== 'finished');
        if (room) {
            return joinRoomById(room.id);
        } else {
            toast({ title: "Código no válido", description: "No se encontró una sala activa o programada con ese código.", variant: "destructive" });
            return false;
        }
    };

    const leaveRoom = () => {
        router.push('http://localhost:3000/user')
    };

    const setActiveRoomById = useCallback((roomId) => {
        if (roomId === 'general') {
            joinGeneralRoom();
            return;
        }
        const room = rooms.find(r => r.id === roomId);
        if (room) {
            setActiveRoom(room);
        } else {
            console.warn(`Room with id ${roomId} not found.`);
            setActiveRoom(null);
        }
    }, [rooms, cardPrice, autoPlaySpeed, activePatterns]);

    return {
        rooms,
        activeRoom,
        createRoom,
        updatePrivateRoom,
        joinGeneralRoom,
        joinRoomById,
        joinRoomByCode,
        leaveRoom,
        setActiveRoomById,
    };
};