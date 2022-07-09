import * as React from 'react';
import { useNavigation } from './context';
import {
  Main,
  PhotoCapture,
  PhotoReview,
  PhotoConfirm,
  Readying,
  VideoRecord,
  VideoReview,
  VideoSelect,
} from './views';
import { PreviewLayout } from './layouts/Preview';

export function Router() {
  return (
    <Switch>
      <Route state="photo.confirming">
        <PreviewLayout>
          <PhotoConfirm />
        </PreviewLayout>
      </Route>

      <Route state="photo.capturing">
        <PreviewLayout>
          <PhotoCapture />
        </PreviewLayout>
      </Route>

      <Route state="photo.reviewing">
        <PhotoReview />
      </Route>

      <Route state="video.confirming">
        <PreviewLayout>
          <VideoSelect />
        </PreviewLayout>
      </Route>

      <Route state="video.recording.readying">
        <PreviewLayout>
          <Readying type="video" />
        </PreviewLayout>
      </Route>

      <Route state="video.recording">
        <PreviewLayout>
          <VideoRecord />
        </PreviewLayout>
      </Route>

      <Route state="video.reviewing">
        <VideoReview />
      </Route>

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
  const { state: currentState, ...rest } = useNavigation();
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
