'use client';

import { useEffect, useState } from 'react';
import { Achievement } from '../types';
import { useAchievementManager } from '../utils/achievementManager';

interface AchievementsDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AchievementsDialog({ isOpen, onClose }: AchievementsDialogProps) {
  const [isVisible, setIsVisible] = useState(false);
  const { getAllAchievements, getStats } = useAchievementManager();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [stats, setStats] = useState({
    totalCorrectGuesses: 0,
    bestScore: 0,
    totalGames: 0
  });
  
  useEffect(() => {
    if (isOpen) {
      setAchievements(getAllAchievements());
      setStats(getStats());
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-md z-[200] flex items-center justify-center">
      <div 
        className={`bg-gradient-to-b from-indigo-900 to-purple-900 text-white p-6 rounded-lg shadow-xl max-w-md w-full max-h-[80vh] overflow-y-auto transition-all duration-300 ${
          isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
        style={{
          boxShadow: '0 0 20px rgba(123, 57, 228, 0.5), 0 0 60px rgba(123, 57, 228, 0.3)',
          border: '2px solid rgba(130, 80, 223, 0.3)'
        }}
      >
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <span className="text-3xl" style={{ color: 'gold' }}>🏆</span>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-yellow-300 to-yellow-500 text-transparent bg-clip-text">
              Conquistas
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors text-2xl"
            style={{ textShadow: '0 0 10px rgba(255, 255, 255, 0.3)' }}
          >
            &times;
          </button>
        </div>
        
        <div className="mb-8 bg-indigo-800/30 p-4 rounded-lg grid grid-cols-3 gap-4 shadow-inner"
          style={{ boxShadow: 'inset 0 0 15px rgba(0, 0, 0, 0.3)' }}
        >
          <div className="text-center p-2 rounded-lg bg-purple-800/20">
            <div className="text-2xl font-bold">{stats.totalCorrectGuesses}</div>
            <div className="text-xs text-purple-300">Acertos Totais</div>
          </div>
          <div className="text-center p-2 rounded-lg bg-blue-800/20">
            <div className="text-2xl font-bold">{stats.bestScore}</div>
            <div className="text-xs text-blue-300">Melhor Pontuação</div>
          </div>
          <div className="text-center p-2 rounded-lg bg-indigo-800/20">
            <div className="text-2xl font-bold">{stats.totalGames}</div>
            <div className="text-xs text-indigo-300">Jogos Jogados</div>
          </div>
        </div>
        
        <h3 className="text-xl font-semibold mb-4 pb-2 border-b border-purple-700">
          Suas Conquistas
        </h3>
        
        <div className="space-y-4">
          {achievements.map(achievement => (
            <div 
              key={achievement.id}
              className={`flex items-center gap-4 p-4 rounded-lg transition-all ${
                achievement.unlocked
                  ? 'bg-gradient-to-r from-indigo-700/50 to-purple-700/50'
                  : 'bg-gray-800/30 text-gray-400'
              }`}
              style={{
                boxShadow: achievement.unlocked 
                  ? '0 0 15px rgba(130, 80, 223, 0.2)' 
                  : 'none',
                border: achievement.unlocked 
                  ? '1px solid rgba(130, 80, 223, 0.3)'
                  : '1px solid rgba(75, 75, 75, 0.2)'
              }}
            >
              <div 
                className={`text-4xl ${!achievement.unlocked ? 'opacity-30 grayscale' : ''}`}
                style={{
                  textShadow: achievement.unlocked ? '0 0 10px rgba(255, 255, 0, 0.5)' : 'none'
                }}
              >
                {achievement.icon}
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-lg">{achievement.title}</h4>
                <p className="text-sm opacity-90">{achievement.description}</p>
                {!achievement.unlocked && (
                  <div className="mt-2">
                    <div className="w-full bg-gray-700 rounded-full h-2 mt-1">
                      <div 
                        className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full"
                        style={{ 
                          width: `${Math.min(100, (stats.totalCorrectGuesses / achievement.requirement) * 100)}%`,
                          transition: 'width 1s ease-in-out'
                        }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      {stats.totalCorrectGuesses}/{achievement.requirement} acertos
                    </div>
                  </div>
                )}
              </div>
              {achievement.unlocked && (
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                  Desbloqueado!
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 