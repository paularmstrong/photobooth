import * as React from 'react';
import { Routes, Route } from 'react-router-dom';
import {
  Main,
  PhotoCapture,
  PhotoReview,
  PhotoSave,
  PhotoConfirm,
  Readying,
  VideoRecord,
  VideoReview,
  VideoConfirm,
} from './views';
import { PreviewLayout } from './layouts';

export function Router() {
  return (
    <Routes>
      <Route
        path="photo/confirming"
        element={
          <PreviewLayout dim>
            <PhotoConfirm />
          </PreviewLayout>
        }
      />

      <Route
        path="photo/capturing"
        element={
          <PreviewLayout>
            <PhotoCapture />
          </PreviewLayout>
        }
      />

      <Route path="photo/reviewing/*" element={<PhotoSave />} />
      <Route path="photo/saving" element={<PreviewLayout>{null}</PreviewLayout>} />
      <Route path="photo/complete" element={<PhotoReview />} />

      <Route
        path="video/confirming"
        element={
          <PreviewLayout dim>
            <VideoConfirm />
          </PreviewLayout>
        }
      />
      <Route
        path="video/recording/readying"
        element={
          <PreviewLayout dim>
            <Readying type="video" />
          </PreviewLayout>
        }
      />
      <Route
        path="video/recording/*"
        element={
          <PreviewLayout>
            <VideoRecord />
          </PreviewLayout>
        }
      />
      <Route path="video/saving" element={<PreviewLayout>{null}</PreviewLayout>} />
      <Route path="video/reviewing" element={<VideoReview />} />

      <Route
        path="*"
        element={
          <PreviewLayout dim>
            <Main />
          </PreviewLayout>
        }
      />
    </Routes>
  );
}
