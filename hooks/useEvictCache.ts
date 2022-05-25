import {useApolloClient} from '@apollo/client';
import React from 'react';

function useEvictCache() {
  const {cache} = useApolloClient();
  const evictCache = (id: string, typename: string) => {
    const identifiedAuthUserId = cache.identify({id: id, __typename: typename});
    cache.evict({id: identifiedAuthUserId});
    cache.gc();
  };
  return evictCache;
}

export default useEvictCache;
