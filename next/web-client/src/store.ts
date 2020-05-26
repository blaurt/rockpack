import { configureStore, getDefaultMiddleware, Store } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import { createLogger } from 'redux-logger';
import { isBackend } from '@rockpack/ussr';
import { promiseMiddleware } from '@adobe/redux-saga-promise';
import { isNotProduction } from './utils/mode';
import { localeSaga, localizationReducer as localization } from './features/Localization';
import { postsSaga, createPostSaga, deletePostSaga, postsReducer as posts } from './features/Posts';
import { watchPost, postReducer as post } from './features/PostDetails';
import { commentsSaga, createCommentSaga, commentsReducer as comments } from './features/Comments';
import { signInSaga, signOutSaga, signUpSaga, authReducer as auth } from './features/AuthManager';
import { StoreProps, RootState } from './types/store';

export const createStore = ({ initState = {}, logger }: StoreProps): Store<RootState> => {
  const reduxLogger = createLogger({
    collapsed: true
  });
  const sagaMiddleware = createSagaMiddleware();

  const middleware = getDefaultMiddleware({
    immutableCheck: true,
    serializableCheck: false,
    thunk: false,
  });

  middleware.push(promiseMiddleware);
  middleware.push(sagaMiddleware);

  if (isNotProduction() && !isBackend()) {
    middleware.push(reduxLogger);
  }

  const store = configureStore({
    reducer: {
      localization,
      posts,
      post,
      comments,
      auth
    },
    devTools: isNotProduction(),
    middleware,
    preloadedState: initState
  });

  sagaMiddleware.run(localeSaga, logger);
  sagaMiddleware.run(postsSaga, logger);
  sagaMiddleware.run(createPostSaga, logger);
  sagaMiddleware.run(deletePostSaga, logger);
  sagaMiddleware.run(watchPost, logger);
  sagaMiddleware.run(commentsSaga, logger);
  sagaMiddleware.run(createCommentSaga, logger);
  sagaMiddleware.run(signInSaga, logger);
  sagaMiddleware.run(signOutSaga, logger);
  sagaMiddleware.run(signUpSaga, logger);

  return store;
};
