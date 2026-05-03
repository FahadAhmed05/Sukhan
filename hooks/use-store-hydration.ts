import { useEffect, useState } from 'react';

import { useSukhanStore } from '@/store/sukhan-store';

export function useStoreHydration(): boolean {
  const [hydrated, setHydrated] = useState(() => useSukhanStore.persist.hasHydrated());

  useEffect(() => {
    const unsub = useSukhanStore.persist.onFinishHydration(() => setHydrated(true));
    setHydrated(useSukhanStore.persist.hasHydrated());
    return unsub;
  }, []);

  return hydrated;
}
