import { h, render } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { Category, Item } from '@/types/catalog';

interface SuggestProps {
  items: Item[];
  categories: Category[];
  onSelect: (item: Item) => void;
}

export default function Suggest(SuggestProps: SuggestProps) {
  
  return <div className="suggest">suggest</div>;
}
