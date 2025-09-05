export const voiceOptions = [
  { id: 'professional', name: 'Locutor Profesional' },
  { id: 'chavo', name: 'El Chavo del 8' },
  { id: 'chilindrina', name: 'La Chilindrina' },
  { id: 'donramon', name: 'Don Ramón' },
  { id: 'random', name: 'Voz Aleatoria' },
];

class VoiceProfile {
  constructor({ name, lang, pitch, rate, phrases, getAudioPath }) {
    this.name = name;
    this.lang = lang;
    this.pitch = pitch;
    this.rate = rate;
    this.phrases = phrases || [];
    this.getAudioPath = getAudioPath;
  }

  getRandomPhrase(number) {
    if (this.phrases.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * this.phrases.length);
    return this.phrases[randomIndex].replace('{number}', number);
  }
}

export const voices = {
  professional: new VoiceProfile({
    name: 'Locutor Profesional',
    lang: 'es-ES',
    pitch: 1,
    rate: 1,
    getAudioPath: (letter, number) => `/sounds/voices/professional/${number}.mp3`,
  }),
  chavo: new VoiceProfile({
    name: 'El Chavo',
    lang: 'es-MX',
    pitch: 1.4,
    rate: 0.9,
    getAudioPath: (letter, number) => letter ? `/sounds/voices/chavo/${letter}${number}.mp3` : null,
    phrases: [
      "¡El número {number}! ¡Eso, eso, eso!",
      "Salió el {number}... ¡Fue sin querer queriendo!",
      "¡El {number}! ¡Como los churros que me debe Don Ramón!",
      "¡Es el {number}! ¡No me tienen paciencia!",
      "¡Mírenlo eh, mírenlo eh! ¡Es el {number}!",
      "¡Zas, zas, que sale el {number}!",
      "¡El {number}! ¡Se me chispoteó!",
    ],
  }),
  chilindrina: new VoiceProfile({
    name: 'La Chilindrina',
    lang: 'es-MX',
    pitch: 1.8,
    rate: 1.1,
    getAudioPath: (letter, number) => letter ? `/sounds/voices/chilindrina/${letter}${number}.mp3` : null,
    phrases: [
      "¡Fíjate, fíjate, fíjate! ¡Salió el {number}!",
      "¡El {number} salió! ¡Acúsalo con tu mamá, Quico!",
      "¡El {number}! ¡Y no te doy otra nomás porque mi papi me está viendo!",
      "¡Es el {number}! ¡Lo que tienes de bruto lo tienes de bruto!",
      "¡Salió el {number}, matanga dijo la changa!",
      "¡El {number}! ¡Y si no ganas, me pagas la renta!",
      "¡El {number}! ¡Papito lindo, mi amor!",
    ],
  }),
  donramon: new VoiceProfile({
    name: 'Don Ramón',
    lang: 'es-MX',
    pitch: 0.8,
    rate: 1.0,
    getAudioPath: (letter, number) => letter ? `/sounds/voices/donramon/${letter}${number}.mp3` : null,
    phrases: [
      "Salió el {number}... ¿Y qué me importa? ¡Yo le voy al Necaxa!",
      "El {number}... ¡Tenía que ser el Chavo del 8!",
      "¡El {number}! ¡Con permisito, dijo Monchito!",
      "¡El {number}! ¡No te doy otra nomás porque... ya me cansé!",
      "¡El {number}! ¡Si serás, si serás...!",
      "¡El {number}! ¡Como los meses de renta que debo!",
      "¡El {number}! ¡Y la próxima te va a tocar un coscorrón!",
    ],
  }),
};