import React, { useEffect, useState } from 'react';
import TestClassifier from './components/TestClassifier';
import DefinitionSelector from './components/DefinitionSelector';
import DefinitionEditor from './components/DefinitionEditor';
import Button from './components/Button';
import Panel from './components/Panel';
import { LabelDefinition } from './types';
import { NEW_DEFINITION_ID } from './constants';
import useDefinitionApi from './useDefinitionApi';

//TODO: completely refactor useDefinitionApi, maybe call it individually
//TODO: maybe add isNew flag to LabelDefinition so as to prevent new hackiness

function App() {
  const [activeDefinitionId, setActiveDefinitionId] = useState<string | null>(null);
  const {
    loadAllDefinitions,
    saveDefinition,
    deleteDefinition,
    createDefinition,
    isLoading, //TODO
    isError, //TODO
    allDefinitions: definitionList,
    apiAffectedDefinition,
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
    if (definition.id === NEW_DEFINITION_ID) {
      delete definition.id;
      await createDefinition(definition);
    } else {
      await saveDefinition(definition);
    }
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

  //on DB update ensure open/active state of the affected definition
  useEffect(() => {
    if (apiAffectedDefinition?.id) {
      setActiveDefinitionId(apiAffectedDefinition.id);
    }
  }, [apiAffectedDefinition]);

  const style = isLoading ? { opacity: 0.2 } : {};

  return (
    <div style={style} className="py-10 m-auto max-w-screen-lg">
      <Panel title="Test">
        <TestClassifier />
      </Panel>

      <Panel title="Train">
        <DefinitionSelector list={definitionList} selectHandler={onDefinitionSelect} />
        <div style={{ margin: '30px 0' }}>
          {activeDefinitionId ? (
            <DefinitionEditor
              definition={activeDefinition}
              saveHandler={onDefinitionSave}
              deleteHandler={onDefinitionDelete}
              closeHandler={onDefinitionSelect}
            />
          ) : (
            <Button onClick={onCreateDefinition}>Create new definition</Button>
          )}
        </div>
      </Panel>
    </div>
  );
}

export default App;
