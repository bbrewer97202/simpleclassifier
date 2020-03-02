import React from 'react';

type Props = {
  forInput: string;
  children: React.ReactNode;
};

const InputLabel = ({ forInput, children }: Props) => {
  return (
    <label className="font-bold" htmlFor={forInput}>
      {children}
    </label>
  );
};

export default InputLabel;
