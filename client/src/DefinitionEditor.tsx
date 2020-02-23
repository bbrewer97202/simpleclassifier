import React, { useEffect, useState } from 'react';
import { LabelDefinition } from './types';
import { NEW_DEFINITION_ID } from './constants';

//TODO: closeHandler is wrong

type Props = {
  definition: LabelDefinition | null;
  closeHandler(label?: string): void;
  deleteHandler(id: string): void;
  saveHandler(definition: LabelDefinition): void;
};

const DefinitionEditor = ({ closeHandler, deleteHandler, saveHandler, definition }: Props) => {
  const [newUtterance, setNewUtterance] = useState<string>('');
  const [newLabel, setNewLabel] = useState<string>('');
  const [editUtterance, setEditUtterance] = useState<string>('');
  const [editIndex, setEditIndex] = useState<number>(-1);

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

  const onNewUtteranceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewUtterance(e.target.value);
  };

  const onEditUtteranceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditUtterance(e.target.value);
  };

  const onCloseClick = () => {
    closeHandler();
  };

  const onDefinitionDeleteClick = async () => {
    await deleteHandler(id);
    closeHandler();
  };

  const onEditUtteranceCancel = (): void => {
    setEditUtterance('');
    setEditIndex(-1);
  };

  const onLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewLabel(e.target.value);
  };

  const onLabelSaveUpdate = async () => {
    await saveUpdate({ label: newLabel });
  };

  const onEditUtteranceUpdate = async () => {
    if (isSaveableUtterance(editUtterance)) {
      const newList = [...utterances];
      newList.splice(editIndex, 1, editUtterance);
      //TODO: what if update failed
      await saveUpdate({ utterances: newList });
    }
    setEditUtterance('');
    setEditIndex(-1);
  };

  const onNewUtteranceAdd = async () => {
    if (isSaveableUtterance(newUtterance)) {
      await saveUpdate({ utterances: [...utterances, newUtterance] });
    }
    setNewUtterance('');
  };

  const utteranceList = utterances.map((utterance, index) => {
    const onUtteranceEdit = () => {
      setEditIndex(index);
    };

    const onUtteranceDelete = async () => {
      const newList = utterances.filter((item, i) => index !== i);
      await saveUpdate({ utterances: newList });
    };

    if (index === editIndex) {
      return (
        <li key={index}>
          <input type="text" value={editUtterance} onChange={onEditUtteranceChange} />
          <button onClick={onEditUtteranceUpdate}>Save</button>
          <button onClick={onEditUtteranceCancel}>Cancel</button>
        </li>
      );
    } else {
      return (
        <li key={index}>
          <span>{utterance}</span>
          <button onClick={onUtteranceEdit}>Edit</button>
          <button onClick={onUtteranceDelete}>Delete</button>
        </li>
      );
    }
  });

  useEffect(() => {
    if (editIndex >= 0 && utterances[editIndex]) {
      setEditUtterance(utterances[editIndex]);
    }
  }, [editIndex, utterances]);

  //TODO: update antipattern prop -> state var
  useEffect(() => {
    console.log('updating new label to ', label);
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
      <ul>
        {utteranceList}
        <li>
          <input type="text" value={newUtterance} onChange={onNewUtteranceChange} />
          <button onClick={onNewUtteranceAdd}>Add</button>
        </li>
      </ul>
    </div>
  );
};

const isSaveableUtterance = (entry: string) => entry && entry.trim() !== '';

export default DefinitionEditor;
