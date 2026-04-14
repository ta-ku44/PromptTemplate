import { useEffect, useState } from 'preact/hooks';
import type { Catalog } from '@/types/catalog';
import { getCatalog, watchCatalog } from '@/utils/storage';

export default function useCatalog() {
  const [catalog, setCatalog] = useState<Catalog>({ categories: [], items: [] });

  useEffect(() => {
    getCatalog().then(setCatalog);
    return watchCatalog(setCatalog);
  }, []);

  return catalog;
}
