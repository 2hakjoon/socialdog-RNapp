import React, {useRef, useState, useEffect} from 'react';
import {AppState, AppStateStatus} from 'react-native';

export const useAppState = (): AppStateStatus => {
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      appState.current = nextAppState;
      setAppStateVisible(appState.current);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return appStateVisible;
};

export default useAppState;
