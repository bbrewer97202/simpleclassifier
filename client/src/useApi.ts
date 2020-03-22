import { useCallback, useReducer } from 'react';
import { LabelDefinition } from './types';

interface ApiState {
  isLoading: boolean;
  isError: boolean;
  allDefinitions: LabelDefinition[];
  changedDefinition: LabelDefinition | null;
}

interface ApiAction {
  type: 'loading' | 'error' | 'success_all' | 'success_single';
  payload: LabelDefinition[] | LabelDefinition | null;
}

interface ApiResponse {
  definitions: LabelDefinition[];
  changed: LabelDefinition | null;
}

const defaultState = {
  isLoading: false,
  isError: false,
  allDefinitions: [],
  changedDefinition: null,
};

const apiReducer = (state: ApiState, action: ApiAction): ApiState => {
  const { type, payload } = action;
  switch (type) {
    case 'loading':
      return { ...state, isError: false, isLoading: true, changedDefinition: null };
    case 'error':
      return { ...state, isError: true, isLoading: false };
    case 'success_all':
      return { ...state, isLoading: false, allDefinitions: payload as LabelDefinition[] };
    case 'success_single':
      return { ...state, isLoading: false, changedDefinition: payload as LabelDefinition };
    default:
      return state;
  }
};

export default () => {
  const [state, dispatch] = useReducer(apiReducer, defaultState);

  const callApi = async (path = '', params: RequestInit = {}) => {
    const controller = new AbortController();
    params.signal = controller.signal;
    const actionType = path || (params.method && params.method === 'POST') ? 'success_single' : 'success_all';

    if (!process.env.REACT_APP_SERVICE_URL) {
      console.log('missing required environment variable: REACT_APP_SERVICE_URL');
    }

    const timeout = setTimeout(() => {
      controller.abort();
      console.log('request timed out');
      dispatch({ type: 'error', payload: [] });
    }, 6000);

    dispatch({ type: 'loading', payload: [] });
    try {
      const ENDPOINT = `${process.env.REACT_APP_SERVICE_URL}/prod/labels`;
      const url = `${ENDPOINT}/${path}`;
      const results = await fetch(url, params);
      const json = await results.json();
      if (json.success) {
        dispatch({ type: actionType, payload: json.data });
      } else {
        dispatch({ type: 'error', payload: [] });
      }
    } catch (e) {
      if (e.name === 'AbortError') {
        dispatch({ type: actionType, payload: [] });
      } else {
        dispatch({ type: 'error', payload: [] });
      }
    } finally {
      clearTimeout(timeout);
    }
  };

  const api = {
    getAllDefinitions: useCallback(async () => {
      await callApi();
    }, []),

    saveDefinition: async (definition: LabelDefinition) => {
      const { id } = definition;
      await callApi(id, {
        method: 'PUT',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(definition),
      });
    },

    createDefinition: async (definition: LabelDefinition) => {
      await callApi(undefined, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(definition),
      });
    },

    deleteDefinition: async (id: string) => {
      await callApi(id, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    },
  };

  const apiResponse: ApiResponse = {
    definitions: state.allDefinitions,
    changed: state.changedDefinition,
  };

  return {
    api,
    isLoading: state.isLoading,
    isError: state.isError,
    apiResponse,
  };
};
