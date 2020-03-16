import React from 'react';
import { cleanup, fireEvent, render, waitForElement } from '@testing-library/react';
import DefinitionEditor from '../components/DefinitionEditor';
import { NEW_DEFINITION_ID } from '../constants';
import useDefinitionApi from '../useDefinitionApi';

// jest.mock('useDefinitionApi');

const onDefinitionSave = jest.fn();
const onDefinitionDelete = jest.fn();
const onDefinitionClose = jest.fn();

const definitionNew = { id: NEW_DEFINITION_ID, label: '', utterances: [] };

afterEach(() => {
  cleanup();
});

describe('definition editor', () => {
  it('renders a distinct interface when creating new definitions', () => {
    const { getByText, queryByLabelText } = render(
      <DefinitionEditor
        definition={definitionNew}
        saveHandler={onDefinitionSave}
        deleteHandler={onDefinitionDelete}
        closeHandler={onDefinitionClose}
      />
    );
    expect(getByText(/New Definition/)).toBeTruthy();
    expect(getByText(/Save/)).toBeTruthy();
    expect(queryByLabelText(/Utterances/)).toBeNull();
  });

  // it('adds additional elements after saving the new definition', async () => {
  //   // useDefinitionApi.

  //   const { getByText, queryByLabelText } = render(
  //     <DefinitionEditor
  //       definition={definitionNew}
  //       saveHandler={onDefinitionSave}
  //       deleteHandler={onDefinitionDelete}
  //       closeHandler={onDefinitionClose}
  //     />
  //   );
  //   fireEvent.click(getByText('Save'));
  //   expect(onDefinitionSave).toHaveBeenCalled();
  //   // await waitForElement(() => {
  //   //   expect(getByText(/Update/)).toBeTruthy();
  //   // });
  // });
});

it('invokes close handler when close button clicked', () => {
  const { getByLabelText } = render(
    <DefinitionEditor
      definition={definitionNew}
      saveHandler={onDefinitionSave}
      deleteHandler={onDefinitionDelete}
      closeHandler={onDefinitionClose}
    />
  );
  fireEvent.click(getByLabelText('Close'));
  expect(onDefinitionClose).toHaveBeenCalled();
});
