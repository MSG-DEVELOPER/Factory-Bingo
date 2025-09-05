import { useState,useEffect } from 'react';
import { DEFAULT_BINGO_PATTERNS_75 } from '../lib/bingoUtils';

export const useSettings = () => {
  const [bingoType, setBingoType] = useState('75');
  const [cardPrice, setCardPrice] = useState();
  const [gameMode, setGameMode] = useState('easy');
  const [autoPlaySpeed, setAutoPlaySpeed] = useState(3000);
  const [houseCut, setHouseCut] = useState(10);
  const [sellerCommission, setSellerCommission] = useState(15);
  const [firstPrizePercentage, setFirstPrizePercentage] = useState(40);
  const [selectedVoice, setSelectedVoice] = useState('chavo');

  const [allPatterns, setAllPatterns] = useState(DEFAULT_BINGO_PATTERNS_75 || {});

  const [activePatterns, setActivePatterns] = useState({
    firstPrize: {
      "Línea Horizontal 1": DEFAULT_BINGO_PATTERNS_75?.["Línea Horizontal 1"] || [],
      "Línea Vertical 1": DEFAULT_BINGO_PATTERNS_75?.["Línea Vertical 1"] || [],
      "Diagonal Principal": DEFAULT_BINGO_PATTERNS_75?.["Diagonal Principal"] || [],
    },
    finalPrize: {
      "Cartón Lleno": DEFAULT_BINGO_PATTERNS_75?.["Cartón Lleno"] || [],
    }
  });

  useEffect(() => {
    const fetchPriceCards = async () => {
      try {
        const res = await fetch("/user/api/salas");
        if (!res.ok) throw new Error("Error al obtener salas");
        const data = await res.json();
        setCardPrice(data[0].precio_carton)


      } catch (err) {
        console.error("Error cargando salas:", err);
      }
    };

    fetchPriceCards();
  }, [cardPrice]);



  const toggleActivePattern = (patternName) => {
    setActivePatterns(prev => {
      const newActivePatterns = { ...prev };
      const firstPrizePatterns = { ...newActivePatterns.firstPrize };

      if (firstPrizePatterns[patternName]) {
        // si ya existe → lo quitamos, pero dejamos al menos 1
        if (Object.keys(firstPrizePatterns).length > 1) {
          delete firstPrizePatterns[patternName];
        }
      } else {
        // si no existe → lo añadimos si está en allPatterns
        if (allPatterns[patternName]) {
          firstPrizePatterns[patternName] = allPatterns[patternName];
        }
      }

      newActivePatterns.firstPrize = firstPrizePatterns;
      return newActivePatterns;
    });
  };

  const addPattern = (name, pattern) => {
    setAllPatterns(prev => ({ ...prev, [name]: pattern }));
  };

  const updatePattern = (oldName, newName, newPattern) => {
    setAllPatterns(prev => {
      const newPatterns = { ...prev };
      if (oldName !== newName) {
        delete newPatterns[oldName];
      }
      newPatterns[newName] = newPattern;
      return newPatterns;
    });

    setActivePatterns(prev => {
      const newActive = { ...prev };
      const firstPrizePatterns = { ...newActive.firstPrize };

      if (firstPrizePatterns[oldName]) {
        delete firstPrizePatterns[oldName];
        firstPrizePatterns[newName] = newPattern;
      }

      newActive.firstPrize = firstPrizePatterns;
      return newActive;
    });
  };

  const deletePattern = (name) => {
    setAllPatterns(prev => {
      const newPatterns = { ...prev };
      delete newPatterns[name];
      return newPatterns;
    });

    setActivePatterns(prev => {
      const newActive = { ...prev };
      const firstPrizePatterns = { ...newActive.firstPrize };
      delete firstPrizePatterns[name];
      newActive.firstPrize = firstPrizePatterns;
      return newActive;
    });
  };

  return {
    bingoType, setBingoType,
    cardPrice, setCardPrice,
    gameMode, setGameMode,
    autoPlaySpeed, setAutoPlaySpeed,
    houseCut, setHouseCut,
    sellerCommission, setSellerCommission,
    firstPrizePercentage, setFirstPrizePercentage,
    selectedVoice, setSelectedVoice,
    allPatterns,
    activePatterns,
    toggleActivePattern,
    addPattern,
    updatePattern,
    deletePattern,
  };
};
