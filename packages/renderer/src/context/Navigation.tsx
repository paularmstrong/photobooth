import * as React from 'react';

interface Meta {
  lastVideo?: string;
  photos: Array<string>;
  photoType?: string;
}

const emptyArray: Array<string> = [];

const NavigationContext = React.createContext({ state: '', meta: { photos: emptyArray } as Meta });

export function NavigationProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = React.useState({ state: '', meta: { photos: emptyArray } });

  React.useEffect(() => {
    const remove = window.api.addListener('transition', ({ value, meta }) => {
      setState({ state: value[value.length - 1], meta });
    });

    return remove;
  }, []);

  return <NavigationContext.Provider value={state}>{children}</NavigationContext.Provider>;
}

export function useNavigation() {
  return React.useContext(NavigationContext);
}
