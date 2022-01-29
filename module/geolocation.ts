import {createSlice, PayloadAction} from '@reduxjs/toolkit';

export interface Geolocation {
  latitude : number
  longitude: number
}

export interface GeolocationState {
  geolocation: Geolocation | null;
}

const initialState: GeolocationState = {
  geolocation: null,
};

const geolocationSlice = createSlice({
  name: 'geolocation',
  initialState,
  reducers: {
    setGeolocation(state, action: PayloadAction<Geolocation>) {
      state.geolocation = action.payload;
    },
    removeGeolocation(state) {
      state.geolocation = null;
    },
  },
});

export default geolocationSlice.reducer;
export const {setGeolocation, removeGeolocation} = geolocationSlice.actions;
