import React from 'react';
import { useUssrState, useUssrEffect } from '../../../src';

const asyncFn = () => new Promise((resolve) => setTimeout(() => resolve('Hello world 3'), 1000));

export const App = () => {
  const [state, setState] = useUssrState('i am test ');

  useUssrEffect(async () => {
    const data = await asyncFn();
    setState(data);
  });

  return (
    <div>
      <h1>{state}</h1>
    </div>
  );
};
