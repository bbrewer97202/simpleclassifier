import React from 'react';
import { act, cleanup, render } from '@testing-library/react';
import user from '@testing-library/user-event';
import TestClassifier from '../components/TestClassifier';

const userTestUtterance = 'lorem ipsum dolor';
const errorCopy = 'An error occurred, please try again.';

afterEach(() => {
  global.fetch.mockClear();
  cleanup();
});

describe('test classifier', () => {
  it('correctly handles input', async () => {
    global.fetch = jest.fn(() => Promise.resolve());

    const { getByRole, getByText } = render(<TestClassifier />);

    await user.type(getByRole('textbox'), userTestUtterance);
    user.click(getByText('Reset'));
    expect(getByRole('textbox')).toBeEmpty();

    await user.type(getByRole('textbox'), userTestUtterance);

    await act(async () => {
      await user.click(getByText('Run Test'));
    });

    const url = `${process.env.REACT_APP_SERVICE_URL}/prod/classify?utterance=${encodeURIComponent(userTestUtterance)}`;

    expect(fetch).toHaveBeenCalled();
    expect(fetch).toHaveBeenCalledWith(url);
  });

  it('displays expected results ', async () => {
    jest.spyOn(global, 'fetch').mockImplementation(() => {
      const data = { success: true, data: { result: 'positive', utterance: userTestUtterance } };
      const json = () => Promise.resolve(data);
      return Promise.resolve({ json });
    });

    const { getByRole, getByText, queryByText } = render(<TestClassifier />);

    await user.type(getByRole('textbox'), userTestUtterance);

    await act(async () => {
      await user.click(getByText('Run Test'));
    });

    expect(queryByText('positive')).toBeInTheDocument();
    expect(queryByText(errorCopy)).not.toBeInTheDocument();
  });

  it('handles server errors ', async () => {
    jest.spyOn(global, 'fetch').mockImplementation(() => {
      const data = { success: false, data: {} };
      const json = () => Promise.resolve(data);
      return Promise.resolve({ json });
    });

    const { getByRole, getByText, queryByText } = render(<TestClassifier />);

    await user.type(getByRole('textbox'), userTestUtterance);

    await act(async () => {
      await user.click(getByText('Run Test'));
    });

    expect(queryByText('Classified as label')).not.toBeInTheDocument();
    expect(queryByText(errorCopy)).toBeInTheDocument();
  });
});
