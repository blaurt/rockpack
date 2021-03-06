import React from 'react';
import { useUssrState, useUssrEffect } from '../../../src';

const asyncFn = () => new Promise((resolve) => setTimeout(() => resolve('Hello world'), 1000));

export const App = () => {
  const [state, setState] = useUssrState('text here');

  useUssrEffect(async () => {
    const data = await asyncFn()
    setState(data);
  });

  return (
    <div>
      <h1>{state}</h1>
    </div>
  );
};
