import * as React from 'react';

export function Shutter() {
  return (
    <div className="absolute top-0 left-0 w-screen h-screen">
      <div className="transform-gpu animate-flap0 flap0 flap" />
      <div className="transform-gpu animate-flap1 flap1 flap" />
      <div className="transform-gpu animate-flap2 flap2 flap" />
      <div className="transform-gpu animate-flap3 flap3 flap" />
      <div className="transform-gpu animate-flap4 flap4 flap" />
      <div className="transform-gpu animate-flap5 flap5 flap" />
    </div>
  );
}
