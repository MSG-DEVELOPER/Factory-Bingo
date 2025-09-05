
"use client"
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBingo } from '../context/BingoContext';
import { Button } from '../components/ui/button';
import { toast } from '../components/ui/use-toast';
import { X, Wand2, Save } from 'lucide-react';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';

const CardEditorModal = ({ favoriteCardData, onSaveFavorite, onClose }) => {
  const { editingCard, setEditingCard, updatePlayerCard } = useBingo();
  const isFavoriteMode = !!favoriteCardData;
  const targetCard = isFavoriteMode ? favoriteCardData : editingCard;

  const [cardName, setCardName] = useState('');
  const [numbers, setNumbers] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (targetCard) {
      setNumbers([...targetCard.numbers]);
      if (isFavoriteMode) {
        setCardName(targetCard.name || '');
      }
    }
  }, [targetCard, isFavoriteMode]);

  const getColumnRange = (col) => {
    return { min: col * 15 + 1, max: (col + 1) * 15 };
  };

  const validateNumber = (number, index) => {
    const col = index % 5;
    const { min, max } = getColumnRange(col);
    if (number === null || number === '') return null;

    const num = parseInt(number, 10);
    if (isNaN(num) || num < min || num > max) {
      return `Debe ser entre ${min} y ${max}`;
    }

    const allNumbersInCard = numbers.map(n => parseInt(n, 10));
    const count = allNumbersInCard.filter((n, i) => n === num && i !== 12).length;
    
    if (count > 1) {
      return 'Número duplicado';
    }

    return null;
  };

  useEffect(() => {
    if (!targetCard) return;

    const newErrors = {};
    for (let i = 0; i < 25; i++) {
      if (i === 12) continue;
      const error = validateNumber(numbers[i], i);
      if (error) {
        newErrors[i] = error;
      }
    }
    setErrors(newErrors);
  }, [numbers, targetCard]);

  const handleInputChange = (index, value) => {
    const newNumbers = [...numbers];
    newNumbers[index] = value === '' ? null : value;
    setNumbers(newNumbers);
  };

  const handleClose = () => {
    if (isFavoriteMode) {
      onClose();
    } else {
      setEditingCard(null);
    }
  };

  const handleSave = () => {
    if (!targetCard) return;

    if (Object.keys(errors).length > 0) {
      toast({
        title: "❌ Errores en el cartón",
        description: "Por favor, corrige los números en rojo antes de guardar.",
        variant: "destructive",
      });
      return;
    }
    
    const finalNumbers = numbers.map(n => n === null || n === '' ? null : parseInt(n, 10));
    finalNumbers[12] = 'FREE';

    if (finalNumbers.some(n => n === null && n !== 'FREE')) {
       toast({
        title: "✏️ Cartón Incompleto",
        description: "Por favor, rellena todos los campos.",
        variant: "destructive",
      });
      return;
    }

    if (isFavoriteMode) {
      if (!cardName.trim()) {
        toast({ title: "✏️ Falta el nombre", description: "Por favor, dale un nombre a tu cartón.", variant: "destructive" });
        return;
      }
      onSaveFavorite({ ...targetCard, name: cardName, numbers: finalNumbers });
    } else {
      updatePlayerCard(targetCard.id, finalNumbers);
      toast({ title: "✅ Cartón Actualizado", description: "Tus números de la suerte están listos para jugar." });
    }
    handleClose();
  };

  if (!targetCard) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={handleClose}
    >
      <motion.div
        initial={{ scale: 0.8, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.8, y: 50 }}
        className="bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl p-4 sm:p-6 w-full max-w-sm"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <Wand2 className="text-violet-400" />
            {isFavoriteMode ? 'Editar Cartón Favorito' : 'Editar Cartón de Juego'}
          </h2>
          <Button variant="ghost" size="icon" onClick={handleClose}>
            <X className="w-6 h-6 text-zinc-400" />
          </Button>
        </div>

        {isFavoriteMode && (
          <div className="mb-4">
            <Label htmlFor="cardName" className="text-zinc-300">Nombre del Cartón</Label>
            <Input
              id="cardName"
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
              placeholder="Ej. Mi Cartón de la Suerte"
              className="mt-1 bg-zinc-800 border-zinc-700"
            />
          </div>
        )}

        <div className="grid grid-cols-5 gap-2 text-center font-bold text-white mb-2">
          <span>B</span><span>I</span><span>N</span><span>G</span><span>O</span>
        </div>
        <div className="grid grid-cols-5 gap-1 sm:gap-2">
          {numbers.map((number, index) => {
            if (index === 12) {
              return (
                <div key={index} className="aspect-square rounded-md bg-amber-500/20 flex items-center justify-center font-bold text-amber-400">
                  ★
                </div>
              );
            }
            return (
              <div key={index} className="relative">
                <input
                  type="number"
                  value={number === null ? '' : number}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  className={`
                    w-full aspect-square rounded-md text-center font-bold bg-zinc-800 text-white border-2 text-sm sm:text-base
                    transition-colors appearance-none m-0 [-moz-appearance:textfield]
                    [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none
                    [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none
                    ${errors[index] ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500' : 'border-zinc-600 focus:border-violet-500 focus:ring-violet-500'}
                  `}
                />
                {errors[index] && <p className="text-rose-500 text-xs mt-1 absolute -bottom-5 w-full text-center">{errors[index]}</p>}
              </div>
            );
          })}
        </div>

        <div className="mt-8 flex justify-end gap-2 sm:gap-4">
          <Button variant="outline" onClick={handleClose}>Cancelar</Button>
          <Button onClick={handleSave} className="bg-emerald-600 hover:bg-emerald-700 text-white">
            <Save className="w-4 h-4 mr-2" />
            Guardar Cambios
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CardEditorModal;
