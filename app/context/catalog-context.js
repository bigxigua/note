import { createContext } from 'react';

export const catalogContext = createContext();

export const initialState = {
  catalog: []
};

export function catalogReducer(state, action) {
  switch (action.type) {
    case 'UPDATE_CATALOG':
      return {
        ...state,
        ...action.payload
      };
    default:
      return state;
  }
}
