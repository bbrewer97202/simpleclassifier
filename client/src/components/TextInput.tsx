import React, { forwardRef } from 'react';

type Props = {
  id?: string;
  value?: string;
  onChange?(e: React.ChangeEvent<HTMLInputElement>): void;
  className?: string;
};

const TextInput = forwardRef<HTMLInputElement, Props>(
  ({ id, value = '', onChange = () => {}, className = '' }, ref) => {
    return (
      <input
        ref={ref}
        id={id}
        type="text"
        value={value}
        onChange={onChange}
        className={`bg-gray-200 appearance-none border-2 border-gray-300 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:border-gray-500 ${className}`}
      />
    );
  }
);

export default TextInput;
