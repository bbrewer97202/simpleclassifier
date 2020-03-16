import { act, renderHook } from '@testing-library/react-hooks';
import useDefinitionApi from '../useDefinitionApi';
// import { LabelDefinition } from '../types';

describe('definition api', () => {
  afterEach(() => {
    global.fetch.mockClear();
  });

  it('loads definitions', async () => {
    jest.spyOn(global, 'fetch').mockImplementation(() => {
      const data = { success: true, data: [{ id: 'abc', label: 'label', utterances: ['utterance 1', 'utterance 2'] }] };
      const json = () => Promise.resolve(data);
      return Promise.resolve({ json });
    });

    const { result, waitForNextUpdate } = renderHook(() => useDefinitionApi());

    act(() => {
      result.current.loadAllDefinitions();
    });

    await waitForNextUpdate();
    expect(result.current.allDefinitions).toHaveLength(1);
    expect(result.current.allDefinitions[0].id).toBe('abc');
    expect(result.current.allDefinitions[0].utterances).toHaveLength(2);
  });

  it('handles server errors', async () => {
    jest.spyOn(global, 'fetch').mockImplementation(() => {
      const data = { success: false, data: [] };
      const json = () => Promise.resolve(data);
      return Promise.resolve({ json });
    });

    const { result, waitForNextUpdate } = renderHook(() => useDefinitionApi());

    act(() => {
      result.current.loadAllDefinitions();
    });

    await waitForNextUpdate();
    expect(result.current.allDefinitions).toHaveLength(0);
    expect(result.current.isError).toBe(true);
  });

  // expect(global.fetch).toHaveBeenCalledWith('https://jsonplaceholder.typicode.com/posts/1');
});
