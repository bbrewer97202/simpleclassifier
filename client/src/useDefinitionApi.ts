import { useCallback, useReducer } from 'react';
import { LabelDefinition } from './types';

interface ApiInterfaceState {
  isLoading: boolean;
  isError: boolean;
  allDefinitions: LabelDefinition[];
  apiAffectedDefinition: LabelDefinition | null;
}
type ReducerType = 'loading' | 'error' | 'success_mutation' | 'success_query' | 'success_create';
type Action = {
  type: ReducerType;
  data: LabelDefinition[] | LabelDefinition | null;
};

const defaultState = {
  isLoading: false,
  isError: false,
  allDefinitions: [],
  apiAffectedDefinition: null,
};

const apiReducer = (state: ApiInterfaceState, action: Action): ApiInterfaceState => {
  const { type, data } = action;
  switch (type) {
    case 'loading':
      return { ...state, isError: false, isLoading: true, apiAffectedDefinition: null };
    case 'error':
      return { ...state, isError: true, isLoading: false };
    case 'success_create':
      return { ...state, isLoading: false, apiAffectedDefinition: data as LabelDefinition };
    case 'success_mutation':
      return { ...state, isLoading: false, apiAffectedDefinition: data as LabelDefinition };
    case 'success_query':
      return { ...state, isLoading: false, allDefinitions: data as LabelDefinition[] };
    default:
      return state;
  }
};

export default () => {
  const [state, dispatch] = useReducer(apiReducer, defaultState);

  //TODO: cancel
  //TODO: timeout
  //TODO: auth
  const callApi = async (path = '', params: RequestInit = {}) => {
    dispatch({ type: 'loading', data: [] });
    try {
      //TODO: move to env var
      const ENDPOINT = 'https://lv1yspajz6.execute-api.us-west-2.amazonaws.com/prod/labels';
      const url = `${ENDPOINT}/${path}`;
      const results = await fetch(url, params);
      const json = await results.json();
      if (json.success) {
        if (path) {
          dispatch({ type: 'success_mutation', data: json.data });
        } else {
          if (params.method && params.method === 'POST') {
            dispatch({ type: 'success_create', data: json.data });
          } else {
            dispatch({ type: 'success_query', data: json.data });
          }
        }
      } else {
        console.log('callAPI failure', json);
        dispatch({ type: 'error', data: [] });
      }
    } catch (e) {
      console.log('callAPI error', e);
      dispatch({ type: 'error', data: [] });
    }
  };

  const loadAllDefinitions = useCallback(async () => {
    await callApi();
  }, []);

  const saveDefinition = async (definition: LabelDefinition) => {
    const { id } = definition;
    await callApi(id, {
      method: 'PUT',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(definition),
    });
  };

  const createDefinition = async (definition: LabelDefinition) => {
    await callApi(undefined, {
      method: 'POST',
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
    createDefinition,
    deleteDefinition,
  };
};
