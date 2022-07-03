import * as React from 'react';
import { useStreamdeck } from './streamdeck';
import { Main, PhotoCapture, PhotoReview, PhotoSelect, Readying, VideoRecord, VideoSelect } from './views';
import { PreviewLayout } from './layouts/Preview';

export function Router() {
  return (
    <Switch>
      <Route state="photo.selecting">
        <PreviewLayout>
          <PhotoSelect />
        </PreviewLayout>
      </Route>

      <Route state="photo.readying">
        <Readying type="photo" />
      </Route>

      <Route state="photo.capturing">
        <PhotoCapture />
      </Route>

      <Route state="photo.reviewing">
        <PhotoReview />
      </Route>

      <Route state="video.selecting">
        <PreviewLayout>
          <VideoSelect />
        </PreviewLayout>
      </Route>

      <Route state="video.readying">
        <Readying type="video" />
      </Route>

      <Route state="video.recording">
        <VideoRecord />
      </Route>

      <Route state="video.reviewing">{null}</Route>

      <Route>
        <PreviewLayout dim>
          <Main />
        </PreviewLayout>
      </Route>
    </Switch>
  );
}

interface RouteProps {
  children: React.ReactNode;
  exact?: boolean;
  state?: string;
}

function Route({ children }: RouteProps) {
  return <>{children}</>;
}

function Switch({ children }: { children: Array<React.ReactElement<RouteProps>> }) {
  const { state: currentState, ...rest } = useStreamdeck();
  console.log(currentState, rest);
  return (
    <>
      {children.find((child) => {
        const { exact, state } = child.props;
        return !state || (exact && currentState === state) || currentState.startsWith(state);
      })}
    </>
  );
}
