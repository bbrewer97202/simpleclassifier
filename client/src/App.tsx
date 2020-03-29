import React, { useEffect, useRef, useState } from 'react';
import TestClassifier from './components/TestClassifier';
import DefinitionSelector from './components/DefinitionSelector';
import DefinitionEditor from './components/DefinitionEditor';
import Button from './components/Button';
import Panel from './components/Panel';
import useApi from './useApi';
import { LabelDefinition } from './types';

function App() {
  const NEW_DEFINITION_ID = '_new_';
  const refInitialized = useRef(false);
  const [activeDefinitionId, setActiveDefinitionId] = useState<string | null>(null);
  const { api, isLoading, isError, apiResponse } = useApi();
  const { getAllDefinitions, createDefinition, deleteDefinition, saveDefinition } = api;
  const { definitions, changed } = apiResponse;

  const getActiveDefinition = (): LabelDefinition | null => {
    if (!definitions) return null;

    if (activeDefinitionId === NEW_DEFINITION_ID) {
      return { id: activeDefinitionId, label: '', utterances: [] };
    }

    const definition = definitions.find(definition => definition.id === activeDefinitionId);
    return definition ? definition : null;
  };

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
    await getAllDefinitions();
  };

  const onDefinitionDelete = async (id: string) => {
    await deleteDefinition(id);
    await getAllDefinitions();
  };

  const onCreateDefinition = () => {
    onDefinitionSelect(NEW_DEFINITION_ID);
  };

  //load definitions by default
  useEffect(() => {
    if (!refInitialized.current) {
      refInitialized.current = true;
      getAllDefinitions();
    }
  }, [getAllDefinitions]);

  //on DB update ensure open/active state of the affected definition
  useEffect(() => {
    if (changed?.id) {
      setActiveDefinitionId(changed.id);
    }
  }, [changed]);

  const activeDefinition = getActiveDefinition();
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
              isNew={activeDefinitionId === NEW_DEFINITION_ID}
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
