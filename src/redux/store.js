import rootReducer from './reducers/rootReducer';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const persistConfig = {
  key: 'root',
  storage
}

const persistedReducer = persistReducer(persistConfig, rootReducer);
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const middlewares = [thunk];

// export const store = createStore(rootReducer, composeEnhancers(
//   applyMiddleware(thunk)
// ))

export const store = createStore(persistedReducer, composeEnhancers(
  applyMiddleware(thunk)
))

export const persistor = persistStore(store)