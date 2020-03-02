import React, { useEffect, useState } from 'react';
import { LabelDefinition } from '../types';
import { NEW_DEFINITION_ID } from '../constants';
import UtteranceList from './UtteranceList';
import Button from './Button';
import TextInput from './TextInput';
import InputLabel from './InputLabel';
import useKeyDown from '../useKeyDown';

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
  const title = isNewDefinition ? 'New Definition' : `Edit Definition: "${label}"`;

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

  const onLabelSave = async () => {
    await saveUpdate({ label: newLabel });
  };

  useKeyDown(document.activeElement && document.activeElement.id === 'label-update-input', [13], onLabelSave);

  useEffect(() => {
    setNewLabel(label);
  }, [label]);

  return (
    <div className="mb-8 p-6 bg-gray-100 rounded">
      <h3 className="flex align-center justify-between font-bold text-xl mb-2">
        {title}
        <button className="bg-transparent py-1 px-2 border-transparent leading-none" onClick={onCloseClick}>
          &times;
        </button>
      </h3>
      <div className="py-3">
        <div className="my-4">
          <InputLabel forInput="label-update-input">Label</InputLabel>
          <div className="flex items-center">
            <TextInput id="label-update-input" value={newLabel} onChange={onLabelChange} className="mr-5" />
            <Button onClick={onLabelSave}>{isNewDefinition ? 'Save' : 'Update'}</Button>
          </div>
        </div>
        {!isNewDefinition ? (
          <>
            <UtteranceList utterances={utterances} saveHandler={saveUtteranceChanges} />
            <div className="flex justify-end mt-10 mb-5">
              <Button onClick={onDefinitionDeleteClick}>Delete Definition</Button>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default DefinitionEditor;
