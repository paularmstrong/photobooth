import * as React from 'react';

interface Context {
  addPhoto: (photo: ImageBitmap) => void;
  clear: () => void;
  photos: Array<ImageBitmap>;
}

const PhotoStoreContext = React.createContext<Context>({ addPhoto: () => {}, clear: () => {}, photos: [] });

export function PhotoStoreProvider({ children }: { children: React.ReactNode }) {
  const [photos, setPhotos] = React.useState<Array<ImageBitmap>>([]);

  const addPhoto = (photo: ImageBitmap) => {
    console.log('adding photo', photo);
    setPhotos((photos) => {
      return [...photos, photo];
    });
  };

  const clear = () => {
    setPhotos([]);
  };

  return <PhotoStoreContext.Provider value={{ addPhoto, clear, photos }}>{children}</PhotoStoreContext.Provider>;
}

export function usePhotos() {
  return React.useContext(PhotoStoreContext);
}
