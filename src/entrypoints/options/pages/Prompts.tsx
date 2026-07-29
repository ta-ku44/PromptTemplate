import React, { lazy } from 'react';

const CatalogBoard = lazy(() => import('../features/catalog'));

export default function Prompts() {
  return (
    <div>
      <h1>Prompts</h1>
      <CatalogBoard />
    </div>
  );
}
