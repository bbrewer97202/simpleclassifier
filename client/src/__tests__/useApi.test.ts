import { act, renderHook } from '@testing-library/react-hooks';
import useApi from '../useApi';

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

    const { result, waitForNextUpdate } = renderHook(() => useApi());

    act(() => {
      result.current.api.getAllDefinitions();
    });

    expect(result.current.apiResponse.definitions).toHaveLength(0);
    await waitForNextUpdate();
    expect(result.current.apiResponse.changed).toBeFalsy();
    expect(result.current.apiResponse.definitions).toHaveLength(1);
    expect(result.current.apiResponse.definitions[0].id).toBe('abc');
    expect(result.current.apiResponse.definitions[0].utterances).toHaveLength(2);
  });

  it('creates definitions', async () => {
    jest.spyOn(global, 'fetch').mockImplementation(() => {
      const data = { success: true, data: { id: 'abc', label: 'label', utterances: [] } };
      const json = () => Promise.resolve(data);
      return Promise.resolve({ json });
    });

    const { result, waitForNextUpdate } = renderHook(() => useApi());

    act(() => {
      result.current.api.createDefinition({ id: 'todo', label: 'label', utterances: [] });
    });

    await waitForNextUpdate();
    expect(result.current.apiResponse.changed).toBeDefined();
    expect(result.current.apiResponse.changed!.id).toBe('abc');
    expect(result.current.apiResponse.changed!.utterances).toHaveLength(0);
  });

  it('updates definitions', async () => {
    jest.spyOn(global, 'fetch').mockImplementation(() => {
      const data = { success: true, data: { id: 'abc', label: 'label', utterances: ['utterance 1'] } };
      const json = () => Promise.resolve(data);
      return Promise.resolve({ json });
    });

    const { result, waitForNextUpdate } = renderHook(() => useApi());

    act(() => {
      result.current.api.saveDefinition({ id: 'abc', label: 'label', utterances: ['utterance 1'] });
    });

    await waitForNextUpdate();
    expect(result.current.apiResponse.changed).toBeDefined();
    expect(result.current.apiResponse.changed!.id).toBe('abc');
    expect(result.current.apiResponse.changed!.utterances).toHaveLength(1);
  });

  it('deletes definitions', async () => {
    jest.spyOn(global, 'fetch').mockImplementation(() => {
      const data = { success: true, data: { id: 'abc', label: 'label', utterances: ['utterance 1'] } };
      const json = () => Promise.resolve(data);
      return Promise.resolve({ json });
    });

    const { result, waitForNextUpdate } = renderHook(() => useApi());

    act(() => {
      result.current.api.deleteDefinition('abc');
    });

    await waitForNextUpdate();
    expect(result.current.apiResponse.changed).toBeDefined();
    expect(result.current.apiResponse.changed!.id).toBe('abc');
  });

  it('handles server errors', async () => {
    jest.spyOn(global, 'fetch').mockImplementation(() => {
      const data = { success: false, data: [] };
      const json = () => Promise.resolve(data);
      return Promise.resolve({ json });
    });

    const { result, waitForNextUpdate } = renderHook(() => useApi());

    act(() => {
      result.current.api.getAllDefinitions();
    });

    await waitForNextUpdate();
    expect(result.current.apiResponse.definitions).toHaveLength(0);
    expect(result.current.isError).toBe(true);
  });

  it('returns loading status while busy', async () => {
    jest.spyOn(global, 'fetch').mockImplementation(() => {
      const data = { success: true, data: [{ id: 'abc', label: 'label', utterances: ['utterance 1', 'utterance 2'] }] };
      const json = () => Promise.resolve(data);
      return Promise.resolve({ json });
    });

    const { result, waitForNextUpdate } = renderHook(() => useApi());

    act(() => {
      result.current.api.getAllDefinitions();
    });

    expect(result.current.apiResponse.definitions).toHaveLength(0);
    expect(result.current.isLoading).toBe(true);
    expect(result.current.isError).toBe(false);
    await waitForNextUpdate();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.apiResponse.changed).toBeFalsy();
    expect(result.current.apiResponse.definitions).toHaveLength(1);
  });
});
