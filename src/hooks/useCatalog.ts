import { useEffect, useState, useMemo } from 'react';
import type { Catalog } from '@/types/catalog';
import { getCatalog, watchCatalog } from '@/utils/storage';
import { sortByFractionalIndex } from '@/utils/fractionalIndex';

export function useCatalog() {
  const [catalog, setCatalog] = useState<Catalog>({ categories: [], items: [] });

  useEffect(() => {
    getCatalog().then(setCatalog);
    return watchCatalog(setCatalog);
  }, []);

  const sortedCatalog = useMemo(() => {
    return {
      categories: sortByFractionalIndex(catalog.categories),
      items: sortByFractionalIndex(catalog.items),
    };
  }, [catalog]);

  return sortedCatalog;
}
