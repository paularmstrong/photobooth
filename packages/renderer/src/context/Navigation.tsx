import * as React from 'react';
import { useLocation as useRRLocation, useNavigate } from 'react-router-dom';

interface Meta {
  lastVideo?: string;
  photos: Array<string>;
  photoType?: string;
}

export function NavigationProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();

  React.useEffect(() => {
    const remove = window.api.addListener('transition', ({ value, meta }) => {
      navigate({ pathname: `/${value[value.length - 1].replace(/\./g, '/')}` }, { state: meta });
    });

    return remove;
  }, []);

  return <>{children}</>;
}

export function useLocation() {
  const { state, ...location } = useRRLocation();
  return { state: state as Meta, ...location };
}
