import React from 'react';
import Button from './Button';
import { LabelDefinition } from '../types';

type Props = {
  list: LabelDefinition[];
  selectHandler(id: string | null): void;
};

const DefinitionSelector = ({ list = [], selectHandler }: Props) => {
  const definitionList = list.map(labelDefinition => {
    const { id, label, utterances } = labelDefinition;
    const onEditClick = () => {
      selectHandler(id);
    };
    return (
      <li key={id} className="flex items-center justify-between py-1 px-1 bg-white odd:bg-indigo-100">
        <span>
          {label} ({utterances.length})
        </span>
        <Button onClick={onEditClick}>Edit</Button>
      </li>
    );
  });

  return (
    <>
      <h3 className="mt-4 mb-2 font-bold text-xl">Definitions:</h3>
      <div className="mt-0 mb-3 bg-white">
        <ul>{definitionList}</ul>
      </div>
    </>
  );
};

export default DefinitionSelector;
