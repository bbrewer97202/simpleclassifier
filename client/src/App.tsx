import React, { useEffect, useState } from 'react';
import DefinitionSelector from './DefinitionSelector';
import DefinitionEditor from './DefinitionEditor';
import { LabelDefinition } from './types';
import { NEW_DEFINITION_ID } from './constants';
import useDefinitionApi from './useDefinitionApi';

function App() {
  const [activeDefinitionId, setActiveDefinitionId] = useState<string | null>(null);
  const {
    loadAllDefinitions,
    saveDefinition,
    deleteDefinition,
    isLoading, //TODO
    isError, //TODO
    allDefinitions: definitionList,
  } = useDefinitionApi();

  const getActiveDefinition = (): LabelDefinition | null => {
    //TODO: if API failure, allDefinitions is null
    if (!definitionList) return null;

    if (activeDefinitionId === NEW_DEFINITION_ID) {
      return { id: activeDefinitionId, label: '', utterances: [] };
    }

    const definition = definitionList.find(definition => definition.id === activeDefinitionId);
    return definition ? definition : null;
  };
  const activeDefinition = getActiveDefinition();

  const onDefinitionSelect = (id: string | null = null) => {
    setActiveDefinitionId(id);
  };

  const onDefinitionSave = async (definition: LabelDefinition) => {
    await saveDefinition(definition);
    await loadAllDefinitions();
  };

  const onDefinitionDelete = async (id: string) => {
    await deleteDefinition(id);
    await loadAllDefinitions();
  };

  const onCreateDefinition = () => {
    onDefinitionSelect(NEW_DEFINITION_ID);
  };

  useEffect(() => {
    loadAllDefinitions();
  }, [loadAllDefinitions]);

  const style = isLoading ? { opacity: 0.2 } : {};

  return (
    <div style={style}>
      <DefinitionSelector list={definitionList} selectHandler={onDefinitionSelect} />
      <div style={{ margin: '30px 0' }}>
        <button onClick={onCreateDefinition}>Create new definition</button>
      </div>
      {activeDefinitionId ? (
        <DefinitionEditor
          definition={activeDefinition}
          saveHandler={onDefinitionSave}
          deleteHandler={onDefinitionDelete}
          closeHandler={onDefinitionSelect}
        />
      ) : null}
    </div>
  );
}

export default App;
