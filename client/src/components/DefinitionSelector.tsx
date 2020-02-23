import React from 'react';
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
      <li key={id}>
        <span>{label}</span>
        <span>{utterances.length} training utterances</span>
        <button onClick={onEditClick}>Edit</button>
      </li>
    );
  });

  return (
    <div>
      <h2>Select a label</h2>
      <ul>{definitionList}</ul>
    </div>
  );
};

export default DefinitionSelector;
