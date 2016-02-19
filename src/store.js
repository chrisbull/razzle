import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import {callAPIMiddleware} from './middleware/callAPIMiddleware';
import createReducer from './reducers';

export function configureStore(initialState = {}) {
  let store = createStore(createReducer(), initialState, compose(
    applyMiddleware(
      thunk,
      callAPIMiddleware
    ),

    window.devToolsExtension && __DEV__ ? window.devToolsExtension() : f => f
  ));
  store.asyncReducers = {};

  if (__DEV__) {
    if (module.hot) {
      module.hot.accept('./reducers', () =>
        store.replaceReducer(require('./reducers').default)
      );
    }
  }

  return store;
}

export function injectAsyncReducer(store, name, asyncReducer) {
  store.asyncReducers[name] = asyncReducer;
  store.replaceReducer(createReducer(store.asyncReducers));
}