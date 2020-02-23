import React, { useEffect, useState } from 'react';

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

  return (
    <div>
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
