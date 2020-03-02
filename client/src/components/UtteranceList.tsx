import React, { useEffect, useState } from 'react';
import Button from './Button';
import TextInput from './TextInput';

type Props = {
  utterances: string[];
  saveHandler(utterances: string[]): void;
};

export default ({ utterances, saveHandler }: Props) => {
  const [editIndex, setEditIndex] = useState<number>(-1);
  const [editUtterance, setEditUtterance] = useState<string>('');
  const [newUtterance, setNewUtterance] = useState<string>('');

  const isSaveableUtterance = (entry: string) => entry && entry.trim() !== '';

  const onNewUtteranceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewUtterance(e.target.value);
  };

  const onNewUtteranceAdd = async () => {
    if (isSaveableUtterance(newUtterance)) {
      await saveHandler([...utterances, newUtterance]);
    }
    setNewUtterance('');
  };

  const onEditUtteranceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditUtterance(e.target.value);
  };

  const onEditUtteranceCancel = (): void => {
    setEditUtterance('');
    setEditIndex(-1);
  };

  const onEditUtteranceUpdate = async () => {
    if (isSaveableUtterance(editUtterance)) {
      const newList = [...utterances];
      newList.splice(editIndex, 1, editUtterance);
      //TODO: what if update failed
      await saveHandler(newList);
    }
    setEditUtterance('');
    setEditIndex(-1);
  };

  const utteranceList = utterances.map((utterance, index) => {
    const onUtteranceEdit = () => {
      setEditIndex(index);
    };

    const onUtteranceDelete = async () => {
      const newList = utterances.filter((item, i) => index !== i);
      await saveHandler(newList);
    };

    if (index === editIndex) {
      return (
        <li key={index} className="flex items-center justify-between bg-transparent odd:bg-indigo-100">
          <TextInput id="edited-utterance" value={editUtterance} onChange={onEditUtteranceChange} className="mr-5" />
          <Button onClick={onEditUtteranceUpdate}>Save</Button>
          <Button onClick={onEditUtteranceCancel}>Cancel</Button>
        </li>
      );
    } else {
      return (
        <li key={index} className="flex items-center justify-between p-2 bg-transparent odd:bg-indigo-100">
          <span>{utterance}</span>
          <span className="ml-4">
            <Button onClick={onUtteranceEdit}>Edit</Button>
            <Button onClick={onUtteranceDelete}>Delete</Button>
          </span>
        </li>
      );
    }
  });

  useEffect(() => {
    if (editIndex >= 0 && utterances[editIndex]) {
      setEditUtterance(utterances[editIndex]);
    }
  }, [editIndex, utterances]);

  return (
    <div>
      <h4 className="mt-6 font-bold">Utterances:</h4>
      <ul>
        {utteranceList}
        <li className="mt-6">
          <h4 className="font-bold">Add Utterance:</h4>
          <div className="flex items-center">
            <TextInput id="new-utterance" value={newUtterance} onChange={onNewUtteranceChange} className="mr-5" />
            <Button onClick={onNewUtteranceAdd}>Add</Button>
          </div>
        </li>
      </ul>
    </div>
  );
};
