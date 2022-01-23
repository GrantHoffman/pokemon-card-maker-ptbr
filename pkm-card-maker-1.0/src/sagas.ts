import { call, put, takeLatest } from 'redux-saga/effects'
import { CardOptionsAction } from 'interfaces';
import { getCardOptions } from 'api';
import { requestCardOptionsSuccess, requestCardOptionsFailed, REQUEST_CARD_OPTIONS } from 'actions';

function* fetchCardOptions(action: CardOptionsAction) {
  try {
    const cardOptions = yield call(getCardOptions);
    yield put(requestCardOptionsSuccess(cardOptions));
  } catch(e) {
    console.error(e);
    yield put(requestCardOptionsFailed('Request failed'));
  }
}


export default function* mySaga() {
  yield takeLatest(REQUEST_CARD_OPTIONS, fetchCardOptions);
}
