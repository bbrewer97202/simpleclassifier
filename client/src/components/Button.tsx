import React from 'react';

type Props = {
  children: React.ReactNode;
  onClick(): void;
};

const Button = ({ onClick = () => {}, children }: Props) => {
  return (
    <button
      onClick={onClick}
      className="text-white bg-blue-500 hover:bg-blue-700 py-1 px-2 mr-2 rounded whitespace-no-wrap"
    >
      {children}
    </button>
  );
};

export default Button;
