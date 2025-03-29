import { Howl, HowlErrorCallback, Howler } from 'howler';

let soundsInitialized = false;
let audioSupported = true;

const checkAudioSupport = () => {
  try {
    if (!Howler.usingWebAudio && !Howler.noAudio) {
      console.warn("WebAudio not available, falling back to HTML5 Audio");
    }
    
    if (Howler.noAudio) {
      console.error("No audio support detected");
      audioSupported = false;
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error checking audio support:", error);
    audioSupported = false;
    return false;
  }
};

checkAudioSupport();

const createSoundInstance = (path: string, label: string) => {
  if (!audioSupported) {
    return {
      play: () => 0,
      volume: () => 0,
      load: () => {}
    };
  }
  
  return new Howl({
    src: [path],
    volume: 1.0,
    preload: true,
    html5: true,
    format: ['mp3'],
    onload: () => console.log(`Sound loaded: ${label}`),
    onloaderror: (id, error) => {
      console.error(`Failed to load sound ${label}:`, error || 'No audio support.');
      
      if (label === 'correct') {
        audioSupported = false;
      }
    }
  });
};

// Sound instances
const sounds = {
  correct: createSoundInstance('/sound/correcty.mp3', 'correct'),
  incorrect: createSoundInstance('/sound/incorrecty.mp3', 'incorrect')
};
export const initSounds = () => {
  if (soundsInitialized || !audioSupported) return;
  
  console.log('Initializing sound system...');
  
  if (!checkAudioSupport()) {
    console.error("Cannot initialize sounds: No audio support");
    soundsInitialized = true;
    return;
  }
  
  const unlockSound = new Howl({
    src: ['/sound/correcty.mp3'],
    volume: 0.01,
    autoplay: false,
    html5: true,
    onend: () => {
      console.log('Sound system initialized successfully');
      soundsInitialized = true;
    },
    onloaderror: (id, error) => {
      console.error('Failed to initialize sound system:', error || 'No audio support.');
      audioSupported = false;
      soundsInitialized = true; 
    }
  });
  
  const unlockAudio = () => {
    if (!audioSupported) return;
    
    console.log('Unlocking audio...');
    unlockSound.play();
    
    Object.values(sounds).forEach(sound => {
      if (typeof sound.load === 'function') {
        sound.load();
      }
    });
    
    document.removeEventListener('click', unlockAudio);
    document.removeEventListener('touchstart', unlockAudio);
    document.removeEventListener('keydown', unlockAudio);
  };
  
  document.addEventListener('click', unlockAudio);
  document.addEventListener('touchstart', unlockAudio);
  document.addEventListener('keydown', unlockAudio);
  
  try {
    unlockSound.play();
  } catch (error) {
    console.log('Initial play failed, waiting for user interaction:', error);
  }
  
  console.log('Sound system setup complete, waiting for user interaction');
};

export const playSound = (type: 'correct' | 'incorrect'): boolean => {
  if (!audioSupported) {
    console.log(`Audio not supported, skipping ${type} sound`);
    return true;
  }
  
  try {
    if (!soundsInitialized) {
      console.log('Sound system not initialized, initializing now...');
      initSounds();
    }
    
    console.log(`Playing ${type} sound...`);
    const id = sounds[type].play();
    
    if (id === undefined || id === null) {
      console.error(`Failed to play ${type} sound`);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error(`Error playing ${type} sound:`, error);
    return false;
  }
};

export const setVolume = (type: 'correct' | 'incorrect', volume: number): void => {
  if (!audioSupported) return;
  
  try {
    sounds[type].volume(volume);
  } catch (error) {
    console.error(`Error setting volume for ${type} sound:`, error);
  }
};

export default sounds; 