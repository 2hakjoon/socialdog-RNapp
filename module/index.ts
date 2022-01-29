import {combineReducers} from 'redux';
import auth from './auth';
import geolocation from './geolocation';

const rootReducer = combineReducers({
  auth,
  geolocation
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
