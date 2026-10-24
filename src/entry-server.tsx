import React from 'react';
import { renderToString } from 'react-dom/server';
import { App } from './App';

export function render(route: string, data: any) {
  const appHtml = renderToString(<App route={route} data={data} />);
  return { appHtml };
}
