"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Slider } from '../components/ui/slider';
import { Award, Home, Ticket, Clock, Trophy } from 'lucide-react';

function EconomicSettings() {
  // Valores estáticos iniciales
  const [cardPrice, setCardPrice] = useState(20);
  const [autoPlaySpeed, setAutoPlaySpeed] = useState(5000);
  const [houseCut, setHouseCut] = useState(20);
  const [sellerCommission, setSellerCommission] = useState(10);
  const [firstPrizePercentage, setFirstPrizePercentage] = useState(60);

  const totalPrizePoolPercentage = 100 - houseCut - sellerCommission;
  const firstPrizeDisplay = (totalPrizePoolPercentage * (firstPrizePercentage / 100)).toFixed(1);
  const finalPrizeDisplay = (totalPrizePoolPercentage * (1 - firstPrizePercentage / 100)).toFixed(1);

  const handleHouseCutChange = value => {
    const newHouseCut = value[0];
    if (newHouseCut + sellerCommission <= 100) {
      setHouseCut(newHouseCut);
    }
  };

  const handleSellerCommissionChange = value => {
    const newSellerCommission = value[0];
    if (newSellerCommission + houseCut <= 100) {
      setSellerCommission(newSellerCommission);
    }
  };

  return (
    <Card className='bg-white/5 border-white/10 text-white'>
      <CardHeader>
        <CardTitle>Configuración Económica y de Juego</CardTitle>
        <CardDescription>Ajusta los parámetros que rigen la economía y el ritmo del juego.</CardDescription>
      </CardHeader>
      <CardContent className='space-y-6 pt-6'>
        {/* Distribución de ingresos */}
        <div className='p-4 bg-zinc-900/50 rounded-lg'>
          <h3 className='font-bold text-lg mb-4'>
            Distribución de Ingresos por Cartón ({totalPrizePoolPercentage}% para premios)
          </h3>
          <div className='flex justify-around text-center mb-4 text-xs sm:text-base'>
            <div>
              <p className='text-xl sm:text-2xl font-bold text-amber-400'>{firstPrizeDisplay}%</p>
              <p className='text-sm text-white/70'>1er Premio</p>
            </div>
            <div>
              <p className='text-xl sm:text-2xl font-bold text-yellow-300'>{finalPrizeDisplay}%</p>
              <p className='text-sm text-white/70'>Premio Final</p>
            </div>
            <div>
              <p className='text-xl sm:text-2xl font-bold text-sky-400'>{houseCut}%</p>
              <p className='text-sm text-white/70'>Casa</p>
            </div>
            <div>
              <p className='text-xl sm:text-2xl font-bold text-orange-400'>{sellerCommission}%</p>
              <p className='text-sm text-white/70'>Vendedor</p>
            </div>
          </div>
          <div className='space-y-4'>
            <div>
              <label className='flex justify-between items-center mb-2'>
                <span>
                  <Home className='w-4 h-4 inline mr-2' />
                  Ganancia de la Casa
                </span>
                <span className='font-bold text-sky-400'>{houseCut}%</span>
              </label>
              <Slider defaultValue={[houseCut]} max={100} step={1} onValueChange={handleHouseCutChange} />
            </div>
            <div>
              <label className='flex justify-between items-center mb-2'>
                <span>
                  <Award className='w-4 h-4 inline mr-2' />
                  Comisión del Vendedor
                </span>
                <span className='font-bold text-orange-400'>{sellerCommission}%</span>
              </label>
              <Slider defaultValue={[sellerCommission]} max={100} step={1} onValueChange={handleSellerCommissionChange} />
            </div>
          </div>
        </div>

        {/* Primer premio */}
        <div>
          <label className='flex justify-between items-center mb-2'>
            <span>
              <Trophy className='w-4 h-4 inline mr-2 text-amber-400' />
              Porcentaje para Primer Premio
            </span>
            <span className='font-bold text-amber-400'>{firstPrizePercentage}%</span>
          </label>
          <Slider
            defaultValue={[firstPrizePercentage]}
            max={100}
            step={1}
            onValueChange={value => setFirstPrizePercentage(value[0])}
          />
          <p className='text-xs text-white/50 mt-1'>
            Define qué parte del pozo de premios se destina a la primera etapa.
          </p>
        </div>

        {/* Precio cartón */}
        <div>
          <label className='flex justify-between items-center mb-2'>
            <span>
              <Ticket className='w-4 h-4 inline mr-2' />
              Precio del Cartón
            </span>
            <span className='font-bold text-sky-400'>${cardPrice.toLocaleString()}</span>
          </label>
          <Slider defaultValue={[cardPrice]} max={100} step={1} onValueChange={value => setCardPrice(value[0])} />
        </div>

        {/* Velocidad */}
        <div>
          <label className='flex justify-between items-center mb-2'>
            <span>
              <Clock className='w-4 h-4 inline mr-2' />
              Velocidad de Juego (Auto)
            </span>
            <span className='font-bold text-sky-400'>{autoPlaySpeed / 1000} seg</span>
          </label>
          <Slider
            defaultValue={[autoPlaySpeed]}
            min={1000}
            max={10000}
            step={500}
            onValueChange={value => setAutoPlaySpeed(value[0])}
          />
        </div>
      </CardContent>
    </Card>
  );
}

export default EconomicSettings;
