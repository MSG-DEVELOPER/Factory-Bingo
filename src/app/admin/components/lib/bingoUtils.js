import React from 'react';

// --- Bingo 75 Utils ---
const createCardStructure75 = () => ({
  id: Date.now() + Math.random(),
  numbers: Array(25).fill(null),
  marked: Array(25).fill(false),
  type: 'auto',
  numbersToWin: 5,
  originalIndex: 0,
});

export const generateEmptyBingoCard75 = () => {
  const card = createCardStructure75();
  card.numbers[12] = 'FREE';
  card.marked[12] = true;
  card.type = 'manual';
  return card;
};

export const generateBingoCard75 = () => {
  const card = generateEmptyBingoCard75();
  card.type = 'auto';
  const columns = [
    Array.from({ length: 15 }, (_, i) => i + 1),
    Array.from({ length: 15 }, (_, i) => i + 16),
    Array.from({ length: 15 }, (_, i) => i + 31),
    Array.from({ length: 15 }, (_, i) => i + 46),
    Array.from({ length: 15 }, (_, i) => i + 61)
  ];

  for (let col = 0; col < 5; col++) {
    const shuffled = [...columns[col]].sort(() => Math.random() - 0.5);
    const columnNumbers = [];
    const numRows = (col === 2) ? 4 : 5;
    for (let i = 0; i < numRows; i++) {
      columnNumbers.push(shuffled.pop());
    }
    
    columnNumbers.sort((a, b) => a - b);
    
    let sortedIndex = 0;
    for (let row = 0; row < 5; row++) {
        const index = row * 5 + col;
        if (col === 2 && row === 2) {
            // FREE space
        } else {
            card.numbers[index] = columnNumbers[sortedIndex++];
        }
    }
  }
  return card;
};

export const DEFAULT_BINGO_PATTERNS_75 = {
  "Línea Horizontal 1": [0, 1, 2, 3, 4],
  "Línea Horizontal 2": [5, 6, 7, 8, 9],
  "Línea Horizontal 3": [10, 11, 12, 13, 14],
  "Línea Horizontal 4": [15, 16, 17, 18, 19],
  "Línea Horizontal 5": [20, 21, 22, 23, 24],
  "Línea Vertical 1": [0, 5, 10, 15, 20],
  "Línea Vertical 2": [1, 6, 11, 16, 21],
  "Línea Vertical 3": [2, 7, 12, 17, 22],
  "Línea Vertical 4": [3, 8, 13, 18, 23],
  "Línea Vertical 5": [4, 9, 14, 19, 24],
  "Diagonal Principal": [0, 6, 12, 18, 24],
  "Diagonal Secundaria": [4, 8, 12, 16, 20],
  "Cuatro Esquinas": [0, 4, 20, 24],
  "Sello Postal": [0, 1, 5, 6],
  "La X": [0, 4, 6, 8, 12, 16, 18, 20, 24],
  "Marco Exterior": [0, 1, 2, 3, 4, 5, 9, 10, 14, 15, 19, 20, 21, 22, 23, 24],
  "Cruz Pequeña": [2, 7, 10, 11, 12, 13, 14, 17, 22],
  "Cartón Lleno": Array.from({ length: 25 }, (_, i) => i),
};

// --- Bingo 90 Utils ---
const createCardStructure90 = () => ({
  id: Date.now() + Math.random(),
  numbers: Array(27).fill(null), // 9 cols x 3 rows
  marked: Array(27).fill(false),
  type: 'auto',
  numbersToWin: 5, // For one line
  originalIndex: 0,
});

export const generateBingoCard90 = () => {
    const card = createCardStructure90();
    const columns = Array.from({ length: 9 }, () => []);
    
    // Distribute numbers 1-90 into columns
    for (let i = 1; i <= 90; i++) {
        const colIndex = Math.min(Math.floor((i - 1) / 10), 8);
        columns[colIndex].push(i);
    }

    // Place 15 numbers on the card
    for (let row = 0; row < 3; row++) {
        const rowIndices = [0, 1, 2, 3, 4, 5, 6, 7, 8].sort(() => 0.5 - Math.random()).slice(0, 5);
        for (const col of rowIndices) {
            const cellIndex = row * 9 + col;
            const availableNumbers = columns[col];
            let number;
            do {
                number = availableNumbers[Math.floor(Math.random() * availableNumbers.length)];
            } while (card.numbers.includes(number));
            card.numbers[cellIndex] = number;
        }
    }
    return card;
};

export const DEFAULT_BINGO_PATTERNS_90 = {
    "Una Línea": [], 
    "Dos Líneas": [],
    "Bingo (Casa Llena)": [],
};

// --- Common Utils ---

export const checkBingo = (card, activePatterns, bingoType) => {
  const { marked, numbers } = card;

  if (bingoType === '90') {
      const markedIndices = marked.map((isMarked, i) => isMarked ? i : -1).filter(i => i !== -1 && numbers[i] !== null);
      const rows = [[], [], []];
      markedIndices.forEach(index => {
          const row = Math.floor(index / 9);
          rows[row].push(index);
      });
      
      if (activePatterns["Bingo (Casa Llena)"] && markedIndices.length === 15) {
          return { isBingo: true, patternName: "Bingo (Casa Llena)", pattern: markedIndices };
      }
      if (activePatterns["Dos Líneas"]) {
          for (let i = 0; i < 3; i++) {
              for (let j = i + 1; j < 3; j++) {
                  if (rows[i].length === 5 && rows[j].length === 5) {
                      return { isBingo: true, patternName: "Dos Líneas", pattern: [...rows[i], ...rows[j]] };
                  }
              }
          }
      }
      if (activePatterns["Una Línea"]) {
          for (const row of rows) {
              if (row.length === 5) {
                  return { isBingo: true, patternName: "Una Línea", pattern: row };
              }
          }
      }
  } else { // Bingo 75
      for (const patternName in activePatterns) {
          const pattern = activePatterns[patternName];
          if (pattern.every(index => marked[index])) {
              return { isBingo: true, patternName, pattern };
          }
      }
  }

  return { isBingo: false, pattern: [], patternName: null };
};

export const calculateNumbersToWin = (card, activePatterns, bingoType) => {
  const { marked, numbers } = card;
  if (Object.keys(activePatterns).length === 0) return 0;
  
  if (bingoType === '90') {
    const markedIndices = marked.map((isMarked, i) => isMarked ? i : -1).filter(i => i !== -1 && numbers[i] !== null);
    const rows = [0, 1, 2].map(r => markedIndices.filter(i => Math.floor(i / 9) === r).length);
    const numbersOnCard = numbers.filter(n => n !== null).length;

    let minNumbersNeeded = Infinity;

    if(activePatterns["Bingo (Casa Llena)"]) minNumbersNeeded = Math.min(minNumbersNeeded, numbersOnCard - markedIndices.length);
    if(activePatterns["Dos Líneas"]) {
        const needs = [ (5 - rows[0]) + (5 - rows[1]), (5 - rows[0]) + (5 - rows[2]), (5 - rows[1]) + (5 - rows[2]) ];
        minNumbersNeeded = Math.min(minNumbersNeeded, ...needs.map(n => isNaN(n) ? Infinity : n));
    }
    if(activePatterns["Una Línea"]) minNumbersNeeded = Math.min(minNumbersNeeded, 5 - Math.max(...rows));

    return minNumbersNeeded === Infinity ? 0 : minNumbersNeeded;
  } else { // Bingo 75
    let minNumbersNeeded = Infinity;
    for (const patternName in activePatterns) {
        const pattern = activePatterns[patternName];
        const markedInPattern = pattern.filter(index => marked[index]).length;
        const numbersNeeded = pattern.length - markedInPattern;
        if (numbersNeeded < minNumbersNeeded) {
            minNumbersNeeded = numbersNeeded;
        }
    }
    return minNumbersNeeded === Infinity ? 0 : minNumbersNeeded;
  }
};

export const getColumnLetter = (number, bingoType = '75') => {
  if (bingoType === '90') return ''; // No letters in 90-ball bingo
  if (number <= 15) return 'B';
  if (number <= 30) return 'I';
  if (number <= 45) return 'N';
  if (number <= 60) return 'G';
  return 'O';
};

const getRangeColor = (number, ranges, colors) => {
    for (let i = 0; i < ranges.length; i++) {
        if (number <= ranges[i]) return colors[i];
    }
    return colors[colors.length - 1];
};

const ranges75 = [15, 30, 45, 60, 75];
const colors75 = {
  text: ['text-sky-500', 'text-teal-500', 'text-rose-500', 'text-violet-500', 'text-orange-500'],
  markedBg: ['bg-sky-400', 'bg-teal-400', 'bg-rose-400', 'bg-violet-400', 'bg-orange-400'],
  bg: ['bg-sky-200/50', 'bg-teal-200/50', 'bg-rose-200/50', 'bg-violet-200/50', 'bg-orange-200/50'],
  gradient: ['from-sky-300 to-cyan-400', 'from-teal-300 to-emerald-400', 'from-rose-300 to-red-400', 'from-violet-300 to-purple-400', 'from-orange-300 to-amber-400']
};

const ranges90 = [10, 20, 30, 40, 50, 60, 70, 80, 90];
const colors90 = {
  text: ['text-red-500', 'text-orange-500', 'text-yellow-500', 'text-lime-500', 'text-green-500', 'text-cyan-500', 'text-blue-500', 'text-indigo-500', 'text-purple-500'],
  markedBg: ['bg-red-400', 'bg-orange-400', 'bg-yellow-400', 'bg-lime-400', 'bg-green-400', 'bg-cyan-400', 'bg-blue-400', 'bg-indigo-400', 'bg-purple-400'],
  bg: ['bg-red-200/50', 'bg-orange-200/50', 'bg-yellow-200/50', 'bg-lime-200/50', 'bg-green-200/50', 'bg-cyan-200/50', 'bg-blue-200/50', 'bg-indigo-200/50', 'bg-purple-200/50'],
  gradient: ['from-red-300 to-red-400', 'from-orange-300 to-orange-400', 'from-yellow-300 to-yellow-400', 'from-lime-300 to-lime-400', 'from-green-300 to-green-400', 'from-cyan-300 to-cyan-400', 'from-blue-300 to-blue-400', 'from-indigo-300 to-indigo-400', 'from-purple-300 to-purple-400']
};

export const getColumnPastelColor = (number, bingoType = '75') => {
  if (number === 'FREE') return 'text-amber-500';
  const { ranges, colors } = bingoType === '75' ? { ranges: ranges75, colors: colors75.text } : { ranges: ranges90, colors: colors90.text };
  return getRangeColor(number, ranges, colors) || 'text-gray-500';
};

export const getMarkedColumnBg = (number, bingoType = '75') => {
  if (number === 'FREE') return 'bg-amber-400';
  const { ranges, colors } = bingoType === '75' ? { ranges: ranges75, colors: colors75.markedBg } : { ranges: ranges90, colors: colors90.markedBg };
  return getRangeColor(number, ranges, colors) || 'bg-gray-400';
};

export const getColumnBg = (number, bingoType = '75') => {
  if (number === 'FREE') return 'bg-amber-200/50';
  const { ranges, colors } = bingoType === '75' ? { ranges: ranges75, colors: colors75.bg } : { ranges: ranges90, colors: colors90.bg };
  return getRangeColor(number, ranges, colors) || 'bg-gray-200/50';
};

export const getColumnGradient = (number, bingoType = '75') => {
  const { ranges, colors } = bingoType === '75' ? { ranges: ranges75, colors: colors75.gradient } : { ranges: ranges90, colors: colors90.gradient };
  const gradient = getRangeColor(number, ranges, colors) || 'from-gray-300 to-gray-400';
  return `bg-gradient-to-br ${gradient}`;
};