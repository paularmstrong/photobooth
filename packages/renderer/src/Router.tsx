import * as React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useLocation } from './context';
import {
  Main,
  PhotoCapture,
  PhotoReview,
  PhotoSave,
  PhotoConfirm,
  Readying,
  Startup,
  VideoRecord,
  VideoReview,
  VideoConfirm,
} from './views';

export function Router() {
  const location = useLocation();

  return (
    <Routes location={location}>
      <Route path="/photo/confirming" element={<PhotoConfirm />} />
      <Route path="/photo/capturing" element={<PhotoCapture />} />
      <Route path="/photo/reviewing/*" element={<PhotoSave />} />
      <Route path="/photo/saving" element={null} />
      <Route path="/photo/complete" element={<PhotoReview />} />
      <Route path="/video/confirming" element={<VideoConfirm />} />
      <Route path="/video/recording/readying" element={<Readying type="video" />} />
      <Route path="/video/recording/*" element={<VideoRecord />} />
      <Route path="/video/saving" element={null} />
      <Route path="/video/reviewing" element={<VideoReview />} />
      <Route path="/main/*" element={<Main />} />
      <Route path="*" element={<Startup />} />
    </Routes>
  );
}
