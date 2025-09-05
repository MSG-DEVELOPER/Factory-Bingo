
"use client"
import { motion } from 'framer-motion';
import { useBingo } from '../context/BingoContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Users, UserPlus, Shield, Heart } from 'lucide-react';
import { Button } from '../components/ui/button';

function PlayerList({ players }) {
  if (!players || players.length === 0) {
    return (
      <div className="text-center text-zinc-400 pt-8">
        <p>¡Aún no hay nadie aquí!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {players.map((player, index) => (
        <motion.div
          key={player.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
          className="flex items-center justify-between gap-3 p-2 rounded-lg bg-zinc-900/50 hover:bg-zinc-900/70 transition-colors"
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">{player.avatar}</span>
            <span className="font-medium text-zinc-100">{player.name}</span>
          </div>
          <Button size="sm" variant="ghost" className="h-8">
            <UserPlus className="w-4 h-4" />
          </Button>
        </motion.div>
      ))}
    </div>
  );
}

function PlaceholderTab({ title, icon, actionText, onActionClick }) {
    return (
        <div className="text-center text-zinc-400 pt-8 flex flex-col items-center gap-4">
            {icon}
            <p className="font-bold">{title}</p>
            <p className="text-xs max-w-xs">Esta función estará disponible próximamente para crear o unirte a grupos de juego.</p>
            <Button onClick={onActionClick}>{actionText}</Button>
        </div>
    );
}

function CommunityPanel() {
  const { players = [], toast } = useBingo();
  
  const handleJoinClub = () => {
    toast({
        title: "🚧 ¡Próximamente!",
        description: "La función de unirse a clubes privados aún no está disponible.",
    });
  };

  return (
    <Card className="bg-white/5 border-white/10 text-white">
      <CardHeader>
        <CardTitle className="flex items-center text-xl">
          <Users className="mr-2 text-lime-400" />
          Comunidad
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 bg-zinc-900/50">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="clubs"><Shield className="w-4 h-4 mr-1 sm:mr-2"/>Clubes</TabsTrigger>
            <TabsTrigger value="friends" className="hidden sm:flex"><Heart className="w-4 h-4 mr-1 sm:mr-2"/>Amigos</TabsTrigger>
            <TabsTrigger value="family" className="hidden sm:flex"><Users className="w-4 h-4 mr-1 sm:mr-2"/>Familia</TabsTrigger>
          </TabsList>
          <div className="pt-4 h-48 overflow-y-auto pr-2">
            <TabsContent value="general">
              <PlayerList players={players} />
            </TabsContent>
            <TabsContent value="clubs">
              <PlaceholderTab title="Clubes Privados" icon={<Shield className="w-10 h-10 text-fuchsia-400"/>} actionText="Unirse al Club" onActionClick={handleJoinClub} />
            </TabsContent>
            <TabsContent value="friends">
              <PlaceholderTab title="Amigos" icon={<Heart className="w-10 h-10 text-rose-400"/>} actionText="Añadir Amigo" onActionClick={handleJoinClub} />
            </TabsContent>
            <TabsContent value="family">
              <PlaceholderTab title="Familiares" icon={<Users className="w-10 h-10 text-sky-400"/>} actionText="Invitar Familiar" onActionClick={handleJoinClub} />
            </TabsContent>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
}

export default CommunityPanel;