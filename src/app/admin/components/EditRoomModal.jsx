import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import RoomForm from '../components/RoomForm';
import { Pencil } from 'lucide-react';

function EditRoomModal({ room, isOpen, onClose, onSave }) {
    if (!room) return null;

    const handleSave = (updatedData) => {
        onSave({ ...room, ...updatedData });
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-zinc-900 border-zinc-700 text-white w-[95vw] max-w-2xl rounded-lg">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl sm:text-2xl">
                        <Pencil className="w-6 h-6 text-sky-400" />
                        Editar Sala de Bingo
                    </DialogTitle>
                    <DialogDescription>
                        Modifica los detalles de tu sala. Los cambios solo se aplicarán si la sala aún no ha comenzado.
                    </DialogDescription>
                </DialogHeader>
                <div className="max-h-[80vh] overflow-y-auto px-1">
                    <RoomForm
                        initialData={room}
                        onSave={handleSave}
                        isEditing={true}
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default EditRoomModal;