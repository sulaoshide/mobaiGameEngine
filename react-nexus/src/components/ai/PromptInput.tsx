import React from 'react';

interface PromptInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const PromptInput: React.FC<PromptInputProps> = ({
  value,
  onChange,
  placeholder = '请输入提示词...'
}) => {
  return (
    <div className="w-full">
      <textarea
        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={4}
      />
    </div>
  );
}; 