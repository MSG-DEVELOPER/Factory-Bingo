"use client"
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Checkbox } from "../components/ui/checkbox";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../components/ui/dialog";
import { Trophy, PlusCircle, Edit, Trash2, Award, Star } from "lucide-react";

const PatternCard = ({ name, pattern, isChecked, isFinalPrize, onEdit, onDelete }) => {
  const currentPattern = pattern || [];
  return (
    <div
      className={`bg-zinc-900/50 p-4 rounded-lg flex flex-col items-center gap-3 border transition-all duration-300 ${
        isChecked ? "border-sky-500" : "border-zinc-700/50"
      } relative group`}
    >
      <div className="grid grid-cols-5 gap-1 w-24 h-24">
        {Array.from({ length: 25 }).map((_, i) => (
          <div
            key={i}
            className={`w-full h-full rounded-sm transition-colors duration-300 ${
              currentPattern.includes(i)
                ? isFinalPrize
                  ? "bg-yellow-400"
                  : "bg-amber-400"
                : "bg-white/20"
            }`}
          />
        ))}
      </div>
      <div className="flex items-center justify-center gap-2 mt-2 w-full">
        <Checkbox id={`pattern-${name}`} checked={isChecked} disabled={isFinalPrize} />
        <label
          htmlFor={`pattern-${name}`}
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer truncate"
        >
          {name}
        </label>
      </div>
      {!isFinalPrize && (
        <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 bg-zinc-800/80 hover:bg-zinc-700"
            onClick={() => onEdit(name)}
          >
            <Edit className="w-4 h-4 text-sky-400" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 bg-zinc-800/80 hover:bg-zinc-700"
            onClick={() => onDelete(name)}
          >
            <Trash2 className="w-4 h-4 text-rose-400" />
          </Button>
        </div>
      )}
    </div>
  );
};

function WinningPatternsManagement() {
  const [patterns, setPatterns] = useState({
    "Línea Horizontal": [0, 1, 2, 3, 4],
    "Línea Vertical": [0, 5, 10, 15, 20],
    "Diagonal": [0, 6, 12, 18, 24],
  });

  const [finalPattern] = useState({
    "Cartón Lleno": Array.from({ length: 25 }, (_, i) => i),
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [patternName, setPatternName] = useState("");
  const [selectedCells, setSelectedCells] = useState([]);
  const [editingName, setEditingName] = useState(null);

  const toggleCell = (index) => {
    setSelectedCells((prev) =>
      prev.includes(index) ? prev.filter((n) => n !== index) : [...prev, index]
    );
  };

  const openCreateModal = () => {
    setPatternName("");
    setSelectedCells([]);
    setEditingName(null);
    setModalOpen(true);
  };

  const openEditModal = (name) => {
    setPatternName(name);
    setSelectedCells(patterns[name] || []);
    setEditingName(name);
    setModalOpen(true);
  };

  const deletePattern = (name) => {
    if (window.confirm(`¿Eliminar patrón "${name}"?`)) {
      const newPatterns = { ...patterns };
      delete newPatterns[name];
      setPatterns(newPatterns);
    }
  };

  const savePattern = () => {
    if (!patternName.trim()) return alert("Debes introducir un nombre");
    setPatterns((prev) => {
      const updated = { ...prev };
      if (editingName && editingName !== patternName) {
        delete updated[editingName];
      }
      updated[patternName] = selectedCells;
      return updated;
    });
    setModalOpen(false);
  };

  return (
    <>
      <Card className="bg-white/5 border-white/10 text-white mt-4">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Trophy className="text-amber-400" />
            Gestión de Patrones de Victoria (Estático)
          </CardTitle>
          <Button onClick={openCreateModal}>
            <PlusCircle className="w-4 h-4 mr-2" />
            Crear Nuevo Patrón
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-semibold text-white/90 mb-4 flex items-center gap-2">
                <Award className="text-amber-400" />
                Patrones para Primer Premio
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {Object.entries(patterns).map(([name, pattern]) => (
                  <PatternCard
                    key={name}
                    name={name}
                    pattern={pattern}
                    isChecked={true}
                    isFinalPrize={false}
                    onEdit={openEditModal}
                    onDelete={deletePattern}
                  />
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-white/90 mb-4 flex items-center gap-2">
                <Star className="text-yellow-300" />
                Patrón para Bingo Final
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {Object.entries(finalPattern).map(([name, pattern]) => (
                  <PatternCard
                    key={name}
                    name={name}
                    pattern={pattern}
                    isChecked={true}
                    isFinalPrize={true}
                  />
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="bg-zinc-900 text-white border border-zinc-700 max-w-md">
          <DialogHeader>
            <DialogTitle>{editingName ? "Editar Patrón" : "Crear Patrón"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Nombre del patrón"
              value={patternName}
              onChange={(e) => setPatternName(e.target.value)}
              className="bg-zinc-800 border-zinc-600 text-white"
            />
            <div className="grid grid-cols-5 gap-1 w-40 mx-auto">
              {Array.from({ length: 25 }).map((_, i) => (
                <div
                  key={i}
                  onClick={() => toggleCell(i)}
                  className={`w-8 h-8 cursor-pointer rounded-sm ${
                    selectedCells.includes(i) ? "bg-amber-400" : "bg-white/20"
                  }`}
                />
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setModalOpen(false)} variant="secondary">
              Cancelar
            </Button>
            <Button onClick={savePattern}>Guardar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default WinningPatternsManagement;
