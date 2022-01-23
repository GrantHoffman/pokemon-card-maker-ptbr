import { CardOptions } from "interfaces";

export const REQUEST_CARD_OPTIONS         = 'REQUEST_CARD_OPTIONS';
export const REQUEST_CARD_OPTIONS_SUCCESS = 'REQUEST_CARD_OPTIONS_SUCCESS';
export const REQUEST_CARD_OPTIONS_FAILED  = 'REQUEST_CARD_OPTIONS_FAILED';


export const requestCardOptions = () => ({ type: REQUEST_CARD_OPTIONS });
export const requestCardOptionsSuccess = (cardOptions: CardOptions) => ({ type: REQUEST_CARD_OPTIONS_SUCCESS, payload: { cardOptions } });
export const requestCardOptionsFailed = (errorMessage: string) => ({ type: REQUEST_CARD_OPTIONS_FAILED, payload: { errorMessage } });
