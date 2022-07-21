import * as React from 'react';
import produce from 'immer';

interface Context {
  getValue: (key: string) => unknown;
  setValue: (key: string, value: unknown) => void;
}

const PreferencesContext = React.createContext<Context>({ getValue: () => '', setValue: () => {} });

export function PreferencesProvider({ children }: { children: React.ReactNode }) {
  const [preferences, setPreferences] = React.useState<Record<string, unknown>>({});

  React.useEffect(() => {
    const removeListener = window.api.addListener('preferences', (newState: Record<string, unknown>) => {
      setPreferences(
        produce((draft) => {
          Object.keys(newState).forEach((key) => {
            draft[key] = newState[key];
          });
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
        getValue: (key: string) => preferences[key],
        setValue: (key: string, value: unknown) => {
          window.api.send('preferences', { [key]: value });
        },
      }}
    >
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreference(key: string): [unknown, (value: unknown) => void] {
  const { getValue, setValue } = React.useContext(PreferencesContext);
  return [getValue(key), (value: unknown) => setValue(key, value)];
}
