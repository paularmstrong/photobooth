import * as React from 'react';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import { matchRoutes } from 'react-router-dom';
import { useLocation } from './context';
import type { Props } from './views/props';
import {
  Main,
  MainHelp,
  PhotoCapture,
  PhotoReview,
  PhotoSave,
  PhotoConfirm,
  Preferences,
  Readying,
  Startup,
  VideoRecord,
  VideoReview,
  VideoConfirm,
} from './views';

export function Router() {
  const location = useLocation();

  const match = React.useMemo(() => {
    const matched = matchRoutes(routes, location);
    return !matched ? null : matched[0].route;
  }, [location]);

  return (
    <SwitchTransition>
      <CSSTransition timeout={match?.path ? 250 : 0} key={match?.path || ''}>
        {(status) => {
          if (!match || !match.path) {
            return null;
          }
          const Component = routeMap[match.path];
          return <Component status={status} />;
        }}
      </CSSTransition>
    </SwitchTransition>
  );
}

const routeMap: Record<string, React.FunctionComponent<Props>> = {
  '/photo/confirming': PhotoConfirm,
  '/photo/capturing': PhotoCapture,
  '/photo/reviewing/*': PhotoSave,
  // '/photo/saving': PhotoSave,
  '/photo/complete': PhotoReview,
  '/video/confirming': VideoConfirm,
  '/video/recording/readying': Readying,
  '/video/recording/*': VideoRecord,
  // '/video/saving': null,
  '/video/reviewing': VideoReview,
  '/main/preferences': Preferences,
  '/main/help': MainHelp,
  '/main/*': Main,
  '/setup': Startup,
};

const routes = Object.keys(routeMap).map((path) => ({ path }));
