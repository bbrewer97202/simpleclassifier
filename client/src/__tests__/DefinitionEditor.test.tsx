import React from 'react';
import { cleanup, fireEvent, render, waitForElement } from '@testing-library/react';
import DefinitionEditor from '../components/DefinitionEditor';

const onDefinitionSave = jest.fn();
const onDefinitionDelete = jest.fn();
const onDefinitionClose = jest.fn();

const definitionNew = { id: '_new_', label: '', utterances: [] };
const definitionExisting = { id: 'abc', label: 'existing label', utterances: ['utterance 1', 'utterance 2'] };

afterEach(() => {
  cleanup();
});

describe('definition editor', () => {
  it('renders a distinct interface for new definitions', () => {
    const { getByText, queryByLabelText } = render(
      <DefinitionEditor
        isNew={true}
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

  it('invokes close handler when close button clicked', () => {
    const { getByLabelText } = render(
      <DefinitionEditor
        isNew={false}
        definition={definitionNew}
        saveHandler={onDefinitionSave}
        deleteHandler={onDefinitionDelete}
        closeHandler={onDefinitionClose}
      />
    );
    fireEvent.click(getByLabelText('Close'));
    expect(onDefinitionClose).toHaveBeenCalled();
  });

  it('renders existing label name', () => {
    const { getByLabelText } = render(
      <DefinitionEditor
        isNew={false}
        definition={definitionExisting}
        saveHandler={onDefinitionSave}
        deleteHandler={onDefinitionDelete}
        closeHandler={onDefinitionClose}
      />
    );
    expect(getByLabelText('Label')).toHaveValue('existing label');
  });

  // it('allows existing label name to be updated', () => {});
});
