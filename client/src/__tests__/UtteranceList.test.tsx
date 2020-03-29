import React from 'react';
import { act, cleanup, fireEvent, render } from '@testing-library/react';
import user from '@testing-library/user-event';
import UtteranceList from '../components/UtteranceList';

const saveHandler = jest.fn();

afterEach(() => {
  cleanup();
});

describe('utterance list', () => {
  it('renders list of utterances', () => {
    const { getAllByRole, queryByText } = render(
      <UtteranceList
        utterances={['Utterance 1', 'Utterance 2', 'Utterance 3', 'Utterance 4']}
        saveHandler={saveHandler}
      />
    );

    expect(getAllByRole('listitem').length).toEqual(5);
    expect(queryByText('Utterance 1')).toBeInTheDocument();
    expect(queryByText('Utterance 2')).toBeInTheDocument();
    expect(queryByText('Utterance 5')).not.toBeInTheDocument();
  });

  it('changes interface while editing an utterance', () => {
    const { getByText, queryByText, queryByDisplayValue } = render(
      <UtteranceList utterances={['Utterance 1']} saveHandler={saveHandler} />
    );

    expect(queryByText('Edit')).toBeInTheDocument();
    expect(queryByText('Save')).not.toBeInTheDocument();
    expect(queryByText('Cancel')).not.toBeInTheDocument();
    expect(queryByDisplayValue('Utterance 1')).not.toBeInTheDocument();
    fireEvent.click(getByText('Edit'));
    expect(queryByText('Edit')).not.toBeInTheDocument();
    expect(queryByText('Save')).toBeInTheDocument();
    expect(queryByText('Cancel')).toBeInTheDocument();
    expect(queryByDisplayValue('Utterance 1')).toBeInTheDocument();
  });

  it('allows an utterance to be updated', async () => {
    const userUpdatedUtterance = 'Updated Utterance 1';
    const { getByText, getByDisplayValue, rerender, queryByDisplayValue, queryByText } = render(
      <UtteranceList utterances={['Utterance 1']} saveHandler={saveHandler} />
    );

    fireEvent.click(getByText('Edit'));
    const input = getByDisplayValue('Utterance 1');
    user.type(input, userUpdatedUtterance);

    expect(queryByDisplayValue(userUpdatedUtterance)).toBeInTheDocument();

    await act(async () => {
      await user.click(getByText('Save'));
    });

    expect(saveHandler).toHaveBeenCalledWith([userUpdatedUtterance]);
    rerender(<UtteranceList utterances={[userUpdatedUtterance]} saveHandler={saveHandler} />);
    expect(queryByText(userUpdatedUtterance)).toBeInTheDocument();
  });

  it('allows an utterance to be deleted', async () => {
    const { getByText, rerender, queryByText } = render(
      <UtteranceList utterances={['Utterance 1']} saveHandler={saveHandler} />
    );

    expect(queryByText('Utterance 1')).toBeInTheDocument();

    await act(async () => {
      await user.click(getByText('Delete'));
    });

    expect(saveHandler).toHaveBeenCalledWith([]);
    rerender(<UtteranceList utterances={[]} saveHandler={saveHandler} />);
    expect(queryByText('Utterance 1')).not.toBeInTheDocument();
  });

  it('allows new utterances to be added', async () => {
    const userUtterance = 'New Utterance';
    const { getAllByRole, getByText, getByDisplayValue, rerender, queryByDisplayValue, queryByText } = render(
      <UtteranceList utterances={['Utterance 1']} saveHandler={saveHandler} />
    );

    const input = getByDisplayValue('');
    user.type(input, userUtterance);

    expect(getAllByRole('listitem').length).toEqual(2);
    expect(queryByDisplayValue(userUtterance)).toBeInTheDocument();

    await act(async () => {
      await user.click(getByText('Add'));
    });

    expect(saveHandler).toHaveBeenCalledWith(['Utterance 1', userUtterance]);
    rerender(<UtteranceList utterances={['Utterance 1', userUtterance]} saveHandler={saveHandler} />);

    expect(queryByText(userUtterance)).toBeInTheDocument();
    expect(getAllByRole('listitem').length).toEqual(3);
  });
});
