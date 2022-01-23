import { combineReducers } from 'redux';
import { CardOptionsState, cardOptionsReducer } from './cardOptions';

export interface State {
  cardOptions: CardOptionsState,
}

export default combineReducers<State>({
  cardOptions: cardOptionsReducer,
});
