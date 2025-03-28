'use client';

// Define the structure of user data to be stored
interface UserGameData {
  recordScore: number;
  hasVisitedBefore: boolean;
  recentChannels: string[];
}

// Default user data for new visitors
const defaultUserData: UserGameData = {
  recordScore: 0,
  hasVisitedBefore: false,
  recentChannels: []
};

// Storage keys
const STORAGE_KEY = 'emoto_user_data';

/**
 * Get the user data from local storage
 */
export function getUserData(): UserGameData {
  // Only run in browser environment
  if (typeof window === 'undefined') {
    return defaultUserData;
  }

  try {
    // Check if localStorage is available
    if (!isLocalStorageAvailable()) {
      console.warn('localStorage is not available.');
      return defaultUserData;
    }
    
    const storedData = localStorage.getItem(STORAGE_KEY);
    if (!storedData) {
      return defaultUserData;
    }
    
    return JSON.parse(storedData) as UserGameData;
  } catch (error) {
    console.error('Error retrieving user data from localStorage:', error);
    return defaultUserData;
  }
}

/**
 * Save the user data to local storage
 */
export function saveUserData(data: Partial<UserGameData>): void {
  // Only run in browser environment
  if (typeof window === 'undefined') {
    return;
  }

  try {
    // Check if localStorage is available
    if (!isLocalStorageAvailable()) {
      console.warn('localStorage is not available, cannot save user data.');
      return;
    }
    
    const currentData = getUserData();
    const updatedData = { ...currentData, ...data };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
  } catch (error) {
    console.error('Error saving user data to localStorage:', error);
  }
}

/**
 * Check if localStorage is available and working
 */
function isLocalStorageAvailable(): boolean {
  try {
    const testKey = '__test_storage__';
    localStorage.setItem(testKey, testKey);
    const result = localStorage.getItem(testKey);
    localStorage.removeItem(testKey);
    return result === testKey;
  } catch (e) {
    return false;
  }
}

/**
 * Check if this is the user's first visit to the game
 */
export function isFirstTimeUser(): boolean {
  try {
    if (!isLocalStorageAvailable()) {
      return false; // If storage isn't available, don't show first-time experience
    }
    const data = getUserData();
    return !data.hasVisitedBefore;
  } catch (error) {
    console.error('Error checking first time user status:', error);
    return false; // If there's an error, don't show first-time experience
  }
}

/**
 * Mark the user as having visited before
 */
export function markUserAsReturning(): void {
  saveUserData({ hasVisitedBefore: true });
}

/**
 * Get the user's record score
 */
export function getStoredRecordScore(): number {
  return getUserData().recordScore;
}

/**
 * Update the user's record score if the new score is higher
 */
export function updateRecordScore(newScore: number): boolean {
  const userData = getUserData();
  
  if (newScore > userData.recordScore) {
    saveUserData({ recordScore: newScore });
    return true;
  }
  
  return false;
}

/**
 * Add a channel to the user's recent channels list
 */
export function addRecentChannel(channel: string): void {
  const userData = getUserData();
  
  // Remove the channel if it already exists to avoid duplicates
  const filteredChannels = userData.recentChannels.filter(ch => ch !== channel);
  
  // Add the channel to the beginning of the array
  const updatedChannels = [channel, ...filteredChannels];
  
  // Keep only the most recent 5 channels
  const limitedChannels = updatedChannels.slice(0, 5);
  
  saveUserData({ recentChannels: limitedChannels });
}

/**
 * Get the user's recent channels
 */
export function getRecentChannels(): string[] {
  return getUserData().recentChannels;
} 