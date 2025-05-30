import React from 'react';

interface Style {
  id: string;
  name: string;
  description: string;
}

interface StyleSelectorProps {
  styles: Style[];
  selectedStyle: string;
  onSelect: (styleId: string) => void;
}

export const StyleSelector: React.FC<StyleSelectorProps> = ({
  styles,
  selectedStyle,
  onSelect
}) => {
  return (
    <div className="grid grid-cols-2 gap-2">
      {styles.map((style) => (
        <button
          key={style.id}
          className={`p-2 rounded-lg border ${
            selectedStyle === style.id
              ? 'bg-blue-500 text-white'
              : 'bg-white hover:bg-gray-100'
          }`}
          onClick={() => onSelect(style.id)}
        >
          <div className="font-medium">{style.name}</div>
          <div className="text-sm opacity-75">{style.description}</div>
        </button>
      ))}
    </div>
  );
}; 