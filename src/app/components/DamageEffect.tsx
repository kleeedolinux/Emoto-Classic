import React, { useState, useEffect } from 'react';

interface DamageEffectProps {
  active: boolean;
  duration?: number;
}

const DamageEffect: React.FC<DamageEffectProps> = ({ active, duration = 300 }) => {
  const [showEffect, setShowEffect] = useState(false);

  useEffect(() => {
    if (active) {
      setShowEffect(true);
    } else {
      setShowEffect(false);
    }
  }, [active]);

  if (!showEffect) return null;

  return (
    <div 
      className="damage-effect"
      style={{
        backgroundColor: 'rgba(255, 0, 0, 0.3)',
      }}
    />
  );
};

export default DamageEffect; 