"use client"
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBingo } from '../context/BingoContext';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Send, MessageSquare } from 'lucide-react';

function ChatPanel() {
  const { messages = [], sendMessage, currentPlayer } = useBingo();
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (messages.length) {
      scrollToBottom();
    }
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newMessage.trim() && currentPlayer) {
      sendMessage(newMessage);
      setNewMessage('');
    }
  };

  return (
    <Card className="bg-white/5 border-white/10 text-white">
      <CardHeader>
        <CardTitle className="flex items-center text-xl">
          <MessageSquare className="mr-2 text-sky-400" />
          Chat en Vivo
        </CardTitle>
      </CardHeader>
      <CardContent className="h-64 overflow-y-auto pr-4 space-y-4">
        <AnimatePresence>
          {messages.map((msg, index) => (
            <motion.div
              key={index}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className={`flex items-start gap-2 ${currentPlayer && msg.player.nombre === currentPlayer.nombre ? 'justify-end' : ''}`}
            >
              {(!currentPlayer || msg.player.name !== currentPlayer.nombre) && (
                <span className="text-2xl mt-1">{msg.player.avatar}</span>
              )}
              <div className={`flex flex-col ${currentPlayer && msg.player.nombre === currentPlayer.nombre ? 'items-end' : 'items-start'}`}>
                <span className="text-xs text-white/60 px-2">{msg.player.nombre}</span>
                <div
                  className={`px-3 py-2 rounded-xl max-w-xs break-words ${
                    currentPlayer && msg.player.nombre === currentPlayer.nombre
                      ? 'bg-sky-600 rounded-br-none'
                      : 'bg-zinc-700 rounded-bl-none'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
               {currentPlayer && msg.player.nombre === currentPlayer.nombre && (
                <span className="text-2xl mt-1">{msg.player.avatar}</span>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </CardContent>
      <CardFooter>
        <form onSubmit={handleSubmit} className="flex w-full items-center gap-2">
          <Input
            type="text"
            placeholder="Escribe un mensaje..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="bg-zinc-800 border-zinc-700 text-white"
            disabled={!currentPlayer}
          />
          <Button type="submit" size="icon" className="bg-sky-500 hover:bg-sky-600 flex-shrink-0" disabled={!currentPlayer}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}

export default ChatPanel;