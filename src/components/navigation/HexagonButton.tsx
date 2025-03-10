
import { memo } from 'react';
import { Hexagon } from 'lucide-react';

const HexagonButton = memo(() => {
  const getTextColor = () => '#c8c5ad';

  return (
    <button
      className="absolute left-[calc(25%-200px)] top-[calc(50%+20px)] transform -translate
      y-1/2 p-2 transition-all duration-700"
      aria-label="Hexagon Button"
    >
      <div className="relative">
        <Hexagon
          className="w-7 h-7"
          style={{
            color: getTextColor(),
            transition: 'color 0.7s ease-in-out'
          }}
          fill={getTextColor()}
          aria-hidden="true"
        />
        {/* Transparent round hole in the center */}
        <div 
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full w-3 h-3"
          style={{ backgroundColor: 'transparent', border: '2px solid transparent' }}
          aria-hidden="true"
        ></div>
      </div>
    </button>
  );
});

HexagonButton.displayName = 'HexagonButton';

export default HexagonButton;
