
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
      <Hexagon
        className="w-7 h-7"
        style={{
          color: getTextColor(),
          transition: 'color 0.7s ease-in-out'
        }}
        fill={getTextColor()}
        aria-hidden="true"
      />
    </button>
  );
});

HexagonButton.displayName = 'HexagonButton';

export default HexagonButton;
