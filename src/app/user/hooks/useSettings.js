import { useState, useEffect } from 'react';
import { DEFAULT_BINGO_PATTERNS_75 } from '@/lib/bingoUtils';

const usePersistentState = (key, defaultValue) => {
    const [state, setState] = useState(() => {
        try {
            const storedValue = localStorage.getItem(key);
            return storedValue ? JSON.parse(storedValue) : defaultValue;
        } catch (error) {
            console.warn(`Error reading localStorage key "${key}":`, error);
            return defaultValue;
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem(key, JSON.stringify(state));
        } catch (error) {
            console.warn(`Error setting localStorage key "${key}":`, error);
        }
    }, [key, state]);

    return [state, setState];
};

export const useSettings = () => {
    const [bingoType, setBingoType] = usePersistentState('bingo_bingoType', '75');
    const [cardPrice, setCardPrice] = usePersistentState('bingo_cardPrice', 100);
    const [gameMode, setGameMode] = usePersistentState('bingo_gameMode', 'easy');
    const [autoPlaySpeed, setAutoPlaySpeed] = usePersistentState('bingo_autoPlaySpeed', 3000);
    const [houseCut, setHouseCut] = usePersistentState('bingo_houseCut', 10);
    const [sellerCommission, setSellerCommission] = usePersistentState('bingo_sellerCommission', 15);
    const [firstPrizePercentage, setFirstPrizePercentage] = usePersistentState('bingo_firstPrizePercentage', 40);
    const [selectedVoice, setSelectedVoice] = usePersistentState('bingo_selectedVoice', 'chavo');
    
    const [allPatterns, setAllPatterns] = usePersistentState('bingo_allPatterns_75', DEFAULT_BINGO_PATTERNS_75);
    
    const [activePatterns, setActivePatterns] = usePersistentState('bingo_activePatterns_75', {
        firstPrize: {
            "Línea Horizontal 1": DEFAULT_BINGO_PATTERNS_75["Línea Horizontal 1"],
            "Línea Vertical 1": DEFAULT_BINGO_PATTERNS_75["Línea Vertical 1"],
            "Diagonal Principal": DEFAULT_BINGO_PATTERNS_75["Diagonal Principal"],
        },
        finalPrize: {
            "Cartón Lleno": DEFAULT_BINGO_PATTERNS_75["Cartón Lleno"],
        }
    });

    const toggleActivePattern = (patternName) => {
        setActivePatterns(prev => {
            const newActivePatterns = { ...prev };
            const firstPrizePatterns = { ...newActivePatterns.firstPrize };
            if (firstPrizePatterns[patternName]) {
                if (Object.keys(firstPrizePatterns).length > 1) {
                    delete firstPrizePatterns[patternName];
                }
            } else {
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