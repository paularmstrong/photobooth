import * as React from 'react';

interface Meta {
  images?: Array<string>;
  photoType?: string;
}

const context = React.createContext({ state: '', meta: {} as Meta });

export function Provider({ children }: { children: React.ReactNode }) {
  const [state, setState] = React.useState({ state: '', meta: {} });

  React.useEffect(() => {
    const remove = window.api.addListener('transition', ({ value, meta }) => {
      setState({ state: value[value.length - 1], meta });
    });

    return remove;
  }, []);

  return <context.Provider value={state}>{children}</context.Provider>;
}

export function useStreamdeck() {
  return React.useContext(context);
}
