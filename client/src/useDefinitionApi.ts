import { useCallback, useReducer } from 'react';
import { LabelDefinition } from './types';

interface ApiInterfaceState {
  isLoading: boolean;
  isError: boolean;
  allDefinitions: LabelDefinition[];
}

const defaultState = {
  isLoading: false,
  isError: false,
  allDefinitions: [],
};

const apiReducer = (state: ApiInterfaceState, action): ApiInterfaceState => {
  const { type, data } = action;
  switch (type) {
    case 'loading':
      return { ...state, isError: false, isLoading: true };
    case 'error':
      return { ...state, isError: true, isLoading: false };
    case 'success_mutation':
      return { ...state, isLoading: false };
    case 'success_query':
      return { ...state, isLoading: false, allDefinitions: data };
    default:
      return state;
  }
};

export default () => {
  const [state, dispatch] = useReducer(apiReducer, defaultState);

  const callApi = async (path = '', params = {}) => {
    dispatch({ type: 'loading' });
    try {
      //TODO: move to env var
      const ENDPOINT = 'https://lv1yspajz6.execute-api.us-west-2.amazonaws.com/prod/labels';
      const url = `${ENDPOINT}/${path}`;
      const results = await fetch(url, params);
      const json = await results.json();
      if (json.success) {
        if (path) {
          dispatch({ type: 'success_mutation', data: json.data || {} });
        } else {
          dispatch({ type: 'success_query', data: json.data || {} });
        }
      } else {
        console.log('callAPI failure', json);
        dispatch({ type: 'error' });
      }
    } catch (e) {
      console.log('callAPI error', e);
      dispatch({ type: 'error' });
    }
  };

  const loadAllDefinitions = useCallback(async () => {
    await callApi();
  }, []);

  const saveDefinition = async (definition: LabelDefinition) => {
    const { id } = definition;
    await callApi(id, {
      method: 'PATCH',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(definition),
    });
  };

  const deleteDefinition = async (id: string) => {
    await callApi(id, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  };

  return {
    ...state,
    loadAllDefinitions,
    saveDefinition,
    deleteDefinition,
  };
};
