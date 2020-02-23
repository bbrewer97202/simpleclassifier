import { LabelDefinition } from './types';

interface AppState {
  isBusy: boolean;
  allDefinitions: LabelDefinition[];
  activeDefinitionId: string | null;
}

export const defaultState = {
  isBusy: false,
  allDefinitions: [],
  activeDefinitionId: null,
};

export const appStateReducer = (state: AppState, action): AppState => {
  const { type, data } = action;
  switch (type) {
    case 'app_busy':
      return { ...state, isBusy: data.isBusy };
    case 'definition_select':
      return { ...state, activeDefinitionId: data.id };
    default:
      return state;
  }
};

//prevent isolatedModules complaint
//export {}
