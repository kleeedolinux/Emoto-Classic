import { Howl, Howler } from 'howler';

let soundsInitialized = false;
let audioSupported = true;

const checkAudioSupport = () => {
  try {
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

const sounds = {
  correct: new Howl({
    src: ['/sound/correcty.mp3'],
    volume: 1.0,
    preload: true,
    html5: true,
    format: ['mp3']
  }),
  
  incorrect: new Howl({
    src: ['/sound/incorrecty.mp3'],
    volume: 1.0,
    preload: true,
    html5: true,
    format: ['mp3']
  }),
  
  alarm: new Howl({
    src: ['/sound/alarm.mp3'],
    volume: 1.0,
    preload: true,
    html5: false, 
    format: ['mp3']
  })
};

export const initSounds = () => {
  if (soundsInitialized) return;
  
  console.log('Initializing sound system...');
  
  const unlockAudio = () => {
    console.log('Unlocking audio...');
    const sound = new Howl({
      src: ['/sound/correcty.mp3'],
      volume: 0.01
    });
    sound.play();
    
    soundsInitialized = true;
    
    document.removeEventListener('click', unlockAudio);
    document.removeEventListener('touchstart', unlockAudio);
    document.removeEventListener('keydown', unlockAudio);
  };
  
  document.addEventListener('click', unlockAudio);
  document.addEventListener('touchstart', unlockAudio);
  document.addEventListener('keydown', unlockAudio);
  
  try {
    unlockAudio();
  } catch (error) {
    console.log('Initial audio unlock failed, waiting for user interaction');
  }
};

/**
 * Simple sound play function
 */
export const playSound = (type: 'correct' | 'incorrect' | 'alarm'): boolean => {
  if (!audioSupported) return false;
  
  if (!soundsInitialized) {
    initSounds();
  }
  
  try {
    Howler.mute(false);
    
    sounds[type].volume(1.0);
    sounds[type].play();
    return true;
  } catch (error) {
    console.error(`Error playing ${type} sound:`, error);
    return false;
  }
};

export const startAlarmSound = (): number => {
  playSound('alarm');
  return 1; 
};

export const stopAlarmSound = (): void => {
  sounds.alarm.stop();
};

/**
 * For debugging
 */
export const testAlarm = (): void => {
  console.log('Testing alarm sound...');
  playSound('alarm');
};

export default sounds; 