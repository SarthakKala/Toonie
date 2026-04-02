import React, { useEffect, useState } from 'react';

interface MeteorsProps {
  number?: number;
  minDelay?: number;
  maxDelay?: number;
  minDuration?: number;
  maxDuration?: number;
  angle?: number;
}

const Meteors: React.FC<MeteorsProps> = ({
  number = 18,
  minDelay = 0.2,
  maxDelay = 4,
  minDuration = 3,
  maxDuration = 9,
  angle = 215,
}) => {
  const [styles, setStyles] = useState<React.CSSProperties[]>([]);

  useEffect(() => {
    const s = Array.from({ length: number }, () => ({
      top: '-2%',
      left: `${Math.floor(Math.random() * 100)}%`,
      animationDelay: `${(Math.random() * (maxDelay - minDelay) + minDelay).toFixed(2)}s`,
      animationDuration: `${Math.floor(Math.random() * (maxDuration - minDuration) + minDuration)}s`,
    }));
    setStyles(s);
  }, [number, minDelay, maxDelay, minDuration, maxDuration]);

  const deg = -angle;

  return (
    <>
      <style>{`
        @keyframes meteor-fall {
          0%   { transform: rotate(${deg}deg) translateX(0); opacity: 1; }
          70%  { opacity: 1; }
          100% { transform: rotate(${deg}deg) translateX(600px); opacity: 0; }
        }
        .meteor-item {
          animation-name: meteor-fall;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
          position: absolute;
          width: 2px;
          height: 2px;
          border-radius: 50%;
          background: rgba(200,200,210,0.7);
          box-shadow: 0 0 0 1px rgba(255,255,255,0.06);
          pointer-events: none;
        }
        .meteor-item::after {
          content: '';
          position: absolute;
          top: 50%;
          right: 0;
          transform: translateY(-50%);
          width: 60px;
          height: 1px;
          background: linear-gradient(to left, rgba(200,200,210,0.55), transparent);
        }
      `}</style>
      {styles.map((s, i) => (
        <span
          key={i}
          className="meteor-item"
          style={s}
        />
      ))}
    </>
  );
};

export default Meteors;
