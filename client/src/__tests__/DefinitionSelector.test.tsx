import React from 'react';
import { cleanup, fireEvent, render } from '@testing-library/react';
import DefinitionSelector from '../components/DefinitionSelector';

const selectHandler = jest.fn();
const definitionList = [
  { id: 'abc', label: 'label 1', utterances: ['utterance 1a', 'utterance 2a'] },
  { id: 'efg', label: 'label 2', utterances: ['utterance 1a', 'utterance 2b'] },
];

afterEach(() => {
  cleanup();
});

describe('definition selector', () => {
  it('renders correctly', () => {
    const { getAllByRole, queryByText } = render(
      <DefinitionSelector list={definitionList} selectHandler={selectHandler} />
    );

    expect(getAllByRole('listitem').length).toEqual(2);
    expect(queryByText('label 2 (2)')).not.toBeNull();
  });

  it('invokes select handler when edit button clicked', () => {
    const { getByText } = render(<DefinitionSelector list={[definitionList[0]]} selectHandler={selectHandler} />);

    fireEvent.click(getByText('Edit'));
    expect(selectHandler).toHaveBeenCalled();
  });
});
