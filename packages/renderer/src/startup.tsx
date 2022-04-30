import * as React from 'react';
import { render } from 'react-dom';
import { App } from './app';

const root = document.getElementById('root');
if (!root) {
  throw new Error('no document root');
}

render(<App />, root);
