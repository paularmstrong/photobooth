import * as React from 'react';
import { useLocation as useRRLocation, useNavigate } from 'react-router-dom';
import type { TransitionData } from '@pb/main';

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
  return { state: state as TransitionData['meta'], ...location };
}
