import * as React from 'react';
import { useStreamdeck } from './streamdeck';
import { Main, PhotoSelect, VideoRecord, VideoSelect } from './views';
import { PreviewLayout } from './layouts/Preview';

export function Router() {
  const { state } = useStreamdeck();

  switch (state) {
    case 'photo.selecting':
      return (
        <PreviewLayout>
          <PhotoSelect />
        </PreviewLayout>
      );
    case 'photo.capturing':
    case 'photo.reviewing':
      return null;
    case 'video.selecting':
      return (
        <PreviewLayout>
          <VideoSelect />
        </PreviewLayout>
      );
    case 'video.recording':
      return <VideoRecord />;
    case 'video.reviewing':
      return null;
    case 'main.normal':
    default:
      return (
        <PreviewLayout dim>
          <Main />
        </PreviewLayout>
      );
  }
}
