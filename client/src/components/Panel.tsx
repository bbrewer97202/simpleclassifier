import React from 'react';

type Props = {
  children: React.ReactNode;
  title: string;
};

const Panel = ({ title, children }: Props) => {
  return (
    <div className="mb-8 bg-white rounded overflow-hidden shadow-md">
      <h2 className="flex align-center justify-between font-bold text-xl mb-2 py-2 px-4 bg-blue-700 text-white">
        {title}
      </h2>
      <div className="py-3 px-6 bg-white">{children}</div>
    </div>
  );
};

export default Panel;
