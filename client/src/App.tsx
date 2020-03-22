import React, { useEffect, useState } from 'react';
import TestClassifier from './components/TestClassifier';
import DefinitionSelector from './components/DefinitionSelector';
import DefinitionEditor from './components/DefinitionEditor';
import Button from './components/Button';
import Panel from './components/Panel';
import { LabelDefinition } from './types';
import { NEW_DEFINITION_ID } from './constants';
import useDefinitionApi from './useApi';

//TODO: completely refactor useDefinitionApi, maybe call it individually
//TODO: maybe add isNew flag to LabelDefinition so as to prevent new hackiness

function App() {
  const [activeDefinitionId, setActiveDefinitionId] = useState<string | null>(null);
  const { api, isLoading, isError, apiResponse } = useDefinitionApi();
  const { getAllDefinitions, createDefinition, deleteDefinition, saveDefinition } = api;
  const { definitions, changed } = apiResponse;

  const getActiveDefinition = (): LabelDefinition | null => {
    //TODO: if API failure, allDefinitions is null
    if (!definitions) return null;

    if (activeDefinitionId === NEW_DEFINITION_ID) {
      return { id: activeDefinitionId, label: '', utterances: [] };
    }

    const definition = definitions.find(definition => definition.id === activeDefinitionId);
    return definition ? definition : null;
  };
  const activeDefinition = getActiveDefinition();

  const onDefinitionSelect = (id: string | null = null) => {
    setActiveDefinitionId(id);
  };

  const onDefinitionSave = async (definition: LabelDefinition) => {
    if (definition.id === NEW_DEFINITION_ID) {
      delete definition.id;
      //TODO: remove new definition id and replace with concept of isNew flag, setting here to false
      await createDefinition(definition);
    } else {
      await saveDefinition(definition);
    }
    await getAllDefinitions();
  };

  const onDefinitionDelete = async (id: string) => {
    await deleteDefinition(id);
    await getAllDefinitions();
  };

  const onCreateDefinition = () => {
    onDefinitionSelect(NEW_DEFINITION_ID);
  };

  useEffect(() => {
    getAllDefinitions();
  }, [getAllDefinitions]);

  //on DB update ensure open/active state of the affected definition
  useEffect(() => {
    if (changed?.id) {
      setActiveDefinitionId(changed.id);
    }
  }, [changed]);

  const style = isLoading ? { opacity: 0.2 } : {};

  if (isError) {
    return <div className="m-auto py-20 text-center">An error occurred communicating with the server.</div>;
  }

  return (
    <div style={style} className="py-10 m-auto max-w-screen-lg">
      <Panel title="Test">
        <TestClassifier />
      </Panel>

      <Panel title="Train">
        <DefinitionSelector list={definitions} selectHandler={onDefinitionSelect} />
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
