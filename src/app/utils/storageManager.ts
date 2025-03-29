'use client';

import { getAchievementData, saveAchievementData } from './achievementManager';
import { Achievement, AchievementData } from '../types';

interface UserGameData {
  recordScore: number;
  hasVisitedBefore: boolean;
  recentChannels: string[];
}

const defaultUserData: UserGameData = {
  recordScore: 0,
  hasVisitedBefore: false,
  recentChannels: []
};

const STORAGE_KEY = 'emoto_user_data';

export function getUserData(): UserGameData {
  if (typeof window === 'undefined') {
    return defaultUserData;
  }

  try {
    if (!isLocalStorageAvailable()) {
      console.warn('localStorage is not available.');
      return defaultUserData;
    }
    
    const storedData = localStorage.getItem(STORAGE_KEY);
    if (!storedData) {
      return defaultUserData;
    }
    
    const parsedData = JSON.parse(storedData);
    
    return { ...defaultUserData, ...parsedData };
  } catch (error) {
    console.error('Error retrieving user data from localStorage:', error);
    return defaultUserData;
  }
}

export function saveUserData(data: Partial<UserGameData>, skipAchievementSync: boolean = false): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    if (!isLocalStorageAvailable()) {
      console.warn('localStorage is not available, cannot save user data.');
      return;
    }
    
    const currentData = getUserData();
    const updatedData = { ...currentData, ...data };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
    
    if (data.recordScore !== undefined && data.recordScore > 0 && !skipAchievementSync) {
      const achievementData = getAchievementData();
      if (data.recordScore > achievementData.stats.bestScore) {
        saveAchievementData({
          stats: {
            ...achievementData.stats,
            bestScore: data.recordScore
          }
        });
      }
    }
  } catch (error) {
    console.error('Error saving user data to localStorage:', error);
  }
}

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

export function isFirstTimeUser(): boolean {
  try {
    if (!isLocalStorageAvailable()) {
      return false; 
    }
    const data = getUserData();
    return !data.hasVisitedBefore;
  } catch (error) {
    console.error('Error checking first time user status:', error);
    return false; 
  }
}

export function markUserAsReturning(): void {
  saveUserData({ hasVisitedBefore: true });
}

export function getStoredRecordScore(): number {
  return getUserData().recordScore;
}

export function updateRecordScore(newScore: number, skipAchievementSync: boolean = false): boolean {
  const userData = getUserData();
  
  if (newScore > userData.recordScore) {
    saveUserData({ recordScore: newScore }, skipAchievementSync);
    return true;
  }
  
  return false;
}

export function addRecentChannel(channel: string): void {
  const userData = getUserData();
  
  const filteredChannels = userData.recentChannels.filter(ch => ch !== channel);
  
  const updatedChannels = [channel, ...filteredChannels];
  
  const limitedChannels = updatedChannels.slice(0, 5);
  
  saveUserData({ recentChannels: limitedChannels });
}

export function getRecentChannels(): string[] {
  return getUserData().recentChannels;
}

export function getAchievements(): Achievement[] {
  return getAchievementData().achievements;
}

export function migrateUserDataToAchievementManager(): void {
  try {
    const userData = getUserData();
    const achievementData = getAchievementData();
    
    if (userData.recordScore > achievementData.stats.bestScore) {
      saveAchievementData({
        stats: {
          ...achievementData.stats,
          bestScore: userData.recordScore
        }
      });
      
      saveUserData({ 
        recordScore: Math.max(userData.recordScore, achievementData.stats.bestScore) 
      }, true);
    }
  } catch (error) {
    console.error('Error migrating user data to achievement manager:', error);
  }
} 