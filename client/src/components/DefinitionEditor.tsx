import React, { useEffect, useState } from 'react';
import { LabelDefinition } from '../types';
import { NEW_DEFINITION_ID } from '../constants';
import UtteranceList from './UtteranceList';

//TODO: closeHandler is wrong

type Props = {
  definition: LabelDefinition | null;
  closeHandler(label?: string): void;
  deleteHandler(id: string): void;
  saveHandler(definition: LabelDefinition): void;
};

const DefinitionEditor = ({ closeHandler, deleteHandler, saveHandler, definition }: Props) => {
  const [newLabel, setNewLabel] = useState<string>('');
  const { id = '', label = '', utterances = [] } = definition || {};
  const isNewDefinition = id === NEW_DEFINITION_ID;

  const saveUpdate = async (updates = {}) => {
    const newDefinition = {
      id,
      label,
      utterances,
      ...updates,
    };
    saveHandler(newDefinition);
  };

  const saveUtteranceChanges = async (updatedUtterances: string[]) => {
    await saveUpdate({ utterances: updatedUtterances });
  };

  const onCloseClick = () => {
    closeHandler();
  };

  const onDefinitionDeleteClick = async () => {
    await deleteHandler(id);
    closeHandler();
  };

  const onLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewLabel(e.target.value);
  };

  const onLabelSaveUpdate = async () => {
    await saveUpdate({ label: newLabel });
  };

  //TODO: update antipattern prop -> state var
  useEffect(() => {
    setNewLabel(label);
  }, [label]);

  return (
    <div>
      <h2>{`Definition Editor`}</h2>
      {isNewDefinition ? <h3>THIS IS NEW</h3> : null}
      <button onClick={onCloseClick}>Close</button>
      <button onClick={onDefinitionDeleteClick}>Delete</button>
      <div>
        <input type="text" value={newLabel} onChange={onLabelChange} />
        <button onClick={onLabelSaveUpdate}>{isNewDefinition ? 'Save' : 'Update'}</button>
      </div>
      <UtteranceList utterances={utterances} saveHandler={saveUtteranceChanges} />
    </div>
  );
};

export default DefinitionEditor;
