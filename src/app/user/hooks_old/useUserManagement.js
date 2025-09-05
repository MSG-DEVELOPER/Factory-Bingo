
'use client'
import { useState, useEffect, useCallback } from 'react';
import { toast } from '../components/ui/use-toast';




// const getInitialState = (key, defaultValue) => {
//   try {
//     const item = window.localStorage.getItem(key);
//     return item ? JSON.parse(item) : defaultValue;
//   } catch (error) {
//     console.warn(`Error reading localStorage key “${key}”:`, error);
//     return defaultValue;
//   }
// };

const defaultPlayers = [
  { id: 1, name: 'Jugador 1', avatar: '🤖', balance: 1000, gamesPlayed: 0, gamesWon: 0, cardsPlayed: 0, bingos: 0, sellerId: 1, favoriteCards: [], cards: [] },
  { id: 2, name: 'Jugador 2', avatar: '👽', balance: 1000, gamesPlayed: 0, gamesWon: 0, cardsPlayed: 0, bingos: 0, sellerId: 1, favoriteCards: [], cards: [] },
];

const defaultSellers = [
  { id: 1, name: 'Vendedor Principal', accessCode: '1234', balance: 0, commissionRate: 10, players: [1, 2], commissionBalance: 0, rechargeBalance: 0, totalRechargedByAdmin: 0 },
];

export const useUserManagement = () => {


  const [players, setPlayers] = useState([]);
  const [sellers, setSellers] = useState([]);
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [currentSeller, setCurrentSeller] = useState(null);


  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const res = await fetch("/user/api/usuarios");
        const data = await res.json();
        // console.log("🚀 ~ fetchUsuarios ~ data:", data)

        if (res.ok) {
          setPlayers(data.players);
          setSellers(data.sellers);
          setCurrentPlayer(data.currentPlayer);

          // if (data.currentPlayer?.id_vendedor) {
          //   const seller = data.sellers.find(
          //     (s) => s.id === Number(data.currentPlayer.id_vendedor)
          //   );
          //   setCurrentSeller(seller || null);
          // }
        } else {
          console.error("⚠️ Error en API:", data.error);
        }
      } catch (error) {
        console.error("❌ Error fetching usuarios:", error);
      }
    };

    fetchUsuarios();
  }, []);



  const login = (playerId) => {
    const player = players.find(p => p.id === playerId);
    if (player) {
      setCurrentPlayer({ ...player, balance: 1000, cards: [] });
    }
  };

  const logout = () => {
    setCurrentPlayer(null);
  };

  const addPlayer = (name, avatar, sellerId) => {
    const newPlayer = {
      id: Date.now(),
      name,
      avatar,
      balance: 1000,
      gamesPlayed: 0,
      gamesWon: 0,
      cardsPlayed: 0,
      bingos: 0,
      sellerId: sellerId || null,
      favoriteCards: [],
      cards: [],
    };
    setPlayers(prev => [...prev, newPlayer]);
    if (sellerId) {
      setSellers(prevSellers => prevSellers.map(seller =>
        seller.id === sellerId ? { ...seller, players: [...seller.players, newPlayer.id] } : seller
      ));
    }
    return newPlayer;
  };

  // const registerPlayer = useCallback((name, avatar, referralCode) => {
  //   const seller = sellers.find(s => s.accessCode === referralCode);
  //   if (seller) {
  //     const newPlayer = addPlayer(name, avatar, seller.id);
  //     setCurrentPlayer(newPlayer);
  //     toast({
  //       title: "✅ ¡Registro Exitoso!",
  //       description: `Bienvenido, ${name}. Has sido asignado al vendedor ${seller.name}.`,
  //     });
  //   } else {
  //     toast({
  //       title: "❌ Código de Vendedor Inválido",
  //       description: "Por favor, verifica el código e inténtalo de nuevo.",
  //       variant: "destructive",
  //     });
  //   }
  // }, [sellers]);

  // const playAsGuest = useCallback(() => {
  //   const guestPlayer = {
  //     id: `guest-${Date.now()}`,
  //     name: 'Invitado',
  //     avatar: '👻',
  //     balance: 1000,
  //     gamesPlayed: 0,
  //     gamesWon: 0,
  //     cardsPlayed: 0,
  //     bingos: 0,
  //     sellerId: null,
  //     favoriteCards: [],
  //     isGuest: true,
  //     cards: [],
  //   };
  //   setPlayers(prev => [...prev, guestPlayer]);
  //   setCurrentPlayer(guestPlayer);
  //   toast({
  //     title: "¡Bienvenido, Invitado!",
  //     description: "Estás jugando con un perfil temporal. Tu progreso no se guardará.",
  //   });
  // }, []);

  const chargeForCards = useCallback((playerId, amount) => {
    setPlayers(prev => prev.map(p => {
      if (p.id === playerId) {
        const updatedPlayer = { ...p, balance: p.balance - amount };
        if (currentPlayer && currentPlayer.id === playerId) {
          setCurrentPlayer(current => ({ ...current, balance: current.balance - amount }));
        }
        return updatedPlayer;
      }
      return p;
    }));
  }, [currentPlayer]);

  const awardPrize = useCallback((playerId, amount) => {
    setPlayers(prev => prev.map(p => {
      if (p.id === playerId) {
        const updatedPlayer = { ...p, balance: p.balance + amount };
        if (currentPlayer && currentPlayer.id === playerId) {
          setCurrentPlayer(current => ({ ...current, balance: current.balance + amount }));
        }
        return updatedPlayer;
      }
      return p;
    }));
  }, [currentPlayer]);

  const updatePlayerStats = useCallback((playerId, stats) => {
    setPlayers(prev => prev.map(p => {
      if (p.id === playerId) {
        const updatedPlayer = {
          ...p,
          gamesPlayed: (p.gamesPlayed || 0) + (stats.gamesPlayed || 0),
          gamesWon: (p.gamesWon || 0) + (stats.gamesWon || 0),
          cardsPlayed: (p.cardsPlayed || 0) + (stats.cardsPlayed || 0),
          bingos: (p.bingos || 0) + (stats.bingos || 0),
        };
        if (currentPlayer && currentPlayer.id === playerId) {
          setCurrentPlayer(current => ({ ...current, ...updatedPlayer }));
        }
        return updatedPlayer;
      }
      return p;
    }));
  }, [currentPlayer]);

  const addSeller = (name, accessCode, commissionRate) => {
    const newSeller = {
      id: Date.now(),
      name,
      accessCode,
      balance: 0,
      commissionRate: commissionRate || 10,
      players: [],
      commissionBalance: 0,
      rechargeBalance: 0,
      totalRechargedByAdmin: 0,
    };
    setSellers(prev => [...prev, newSeller]);
    return newSeller;
  };

  const updateSeller = (sellerId, updatedData) => {
    setSellers(prev => prev.map(s => s.id === sellerId ? { ...s, ...updatedData } : s));
  };

  const addCommission = useCallback((sellerId, amount) => {
    setSellers(prev => prev.map(s => s.id === sellerId ? { ...s, balance: s.balance + amount } : s));
  }, []);

  const saveFavoriteCard = useCallback((cardData) => {
    if (!currentPlayer) return;

    setPlayers(prevPlayers => {
      return prevPlayers.map(player => {
        if (player.id === currentPlayer.id) {
          const favoriteCards = player.favoriteCards || [];
          const existingIndex = favoriteCards.findIndex(c => c.id === cardData.id);
          let updatedFavorites;

          if (existingIndex > -1) {
            updatedFavorites = favoriteCards.map((c, index) => index === existingIndex ? cardData : c);
          } else {
            const newCard = { ...cardData, id: cardData.id || `fav-${Date.now()}` };
            updatedFavorites = [...favoriteCards, newCard];
          }

          const updatedPlayer = { ...player, favoriteCards: updatedFavorites };
          setCurrentPlayer(updatedPlayer);
          return updatedPlayer;
        }
        return player;
      });
    });
  }, [currentPlayer]);

  const deleteFavoriteCard = useCallback((cardId) => {
    if (!currentPlayer) return;
    setPlayers(prevPlayers => {
      return prevPlayers.map(player => {
        if (player.id === currentPlayer.id) {
          const updatedFavorites = (player.favoriteCards || []).filter(c => c.id !== cardId);
          const updatedPlayer = { ...player, favoriteCards: updatedFavorites };
          setCurrentPlayer(updatedPlayer);
          return updatedPlayer;
        }
        return player;
      });
    });
  }, [currentPlayer]);

  const addFavoriteCardToGame = useCallback((favCard) => {
    if (!currentPlayer) return;

    const newGameCard = {
      ...favCard,
      id: `game-${Date.now()}`,
      marked: Array(favCard.numbers.length).fill(false),
      originalIndex: 0, // This will be updated when added
    };
    if (newGameCard.numbers[12] === 'FREE') {
      newGameCard.marked[12] = true;
    }

    setPlayers(prevPlayers => prevPlayers.map(p => {
      if (p.id === currentPlayer.id) {
        const updatedCards = [...(p.cards || [])];
        newGameCard.originalIndex = updatedCards.length;
        updatedCards.push(newGameCard);
        const updatedPlayer = { ...p, cards: updatedCards };
        setCurrentPlayer(updatedPlayer);
        return updatedPlayer;
      }
      return p;
    }));
    toast({ title: "Cartón añadido", description: `Se ha añadido "${favCard.name}" a tu juego.` });
  }, [currentPlayer]);

  return {
    players,
    setPlayers,
    sellers,
    setSellers,
    currentPlayer,
    setCurrentPlayer,
    currentSeller,
    setCurrentSeller,
    login,
    logout,
    addPlayer,
    // registerPlayer,
    // playAsGuest,
    chargeForCards,
    awardPrize,
    updatePlayerStats,
    addSeller,
    updateSeller,
    addCommission,
    saveFavoriteCard,
    deleteFavoriteCard,
    addFavoriteCardToGame,
  };
};
