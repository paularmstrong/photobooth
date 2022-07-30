import * as React from 'react';
import produce from 'immer';
import type { Preferences } from '@pb/main';

interface Context {
  getValue: <K extends keyof Preferences>(key: K) => Preferences[K];
  setValue: <K extends keyof Preferences>(key: K, value: Preferences[K]) => void;
}

const PreferencesContext = React.createContext<Context>({ getValue: () => '', setValue: () => {} });

export function PreferencesProvider({ children }: { children: React.ReactNode }) {
  const [preferences, setPreferences] = React.useState<Preferences>({
    mediaPath: '',
    photoboothUrl: '',
    videoSaveMessage: '',
  });

  React.useEffect(() => {
    const removeListener = window.api.addListener('preferences', (newState: Preferences) => {
      setPreferences(
        produce<Preferences>((draft) => {
          for (const key of Object.keys(newState)) {
            draft[key as keyof Preferences] = newState[key as keyof Preferences];
          }
        })
      );
    });

    window.api.send('preferences', {});

    return () => {
      removeListener();
    };
  }, []);

  return (
    <PreferencesContext.Provider
      value={{
        getValue: (key: keyof Preferences) => preferences[key],
        setValue: <K extends keyof Preferences>(key: K, value: Preferences[K]) => {
          window.api.send('preferences', { [key]: value });
        },
      }}
    >
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreference<K extends keyof Preferences>(key: K): [Preferences[K], (value: Preferences[K]) => void] {
  const { getValue, setValue } = React.useContext(PreferencesContext);
  return [getValue(key), (value: Preferences[K]) => setValue(key, value)];
}
