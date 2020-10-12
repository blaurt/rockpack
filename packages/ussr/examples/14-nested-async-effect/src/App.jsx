import React from 'react';
import { useUssrState, useWillMount, useUssrEffect } from '../../../src';

const effect = () => new Promise((resolve) => setTimeout(() => resolve({ text: 'Hello world' }), 1000));

const asyncFn = async (resolve) => {
  const data = await effect();
  resolve(data);
}

const simpleFn = (resolve) => asyncFn(resolve);

export const App = () => {
  const effect = useUssrEffect('test');
  const [state, setState] = useUssrState('appState.text', { text: 'text here' });

  useWillMount(effect, effect.install((resolve) => {
      simpleFn(resolve)
    }, (data) => {
      setState(data);
    })
  );

  return (
    <div>
      <h1>{state.text}</h1>
    </div>
  );
};
