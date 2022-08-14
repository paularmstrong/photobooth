import * as React from 'react';

export function Title() {
  return (
    <h1 className="text-center text-white transition-[font-size] duration-500 font-semibold text-dynamic animate-bounce-slow">
      <span className="block transition-transform duration-500 -rotate-12">
        <span className="drop-shadow-lg">Photo</span>
        <span className="relative top-12 md:top-24 -left-4 md-left-8 drop-shadow-lg transition-[top,left] duration-500">
          Booth
        </span>
      </span>
    </h1>
  );
}
