import { useCallback, useState } from "react";

// key - ключ local storage
// useByDefault - с помощью этого флага настраиваем стратегию кэша
export const useCacheStrategy = <T>(key: string, useByDefault = false) => {
  const [isCacheStrategy, setIsCacheStrategy] = useState(useByDefault);
  const toggleCacheStrategy = () => {
    setIsCacheStrategy((prev) => !prev);
  };

  const enableCacheStrategy = () => setIsCacheStrategy(true);
  const disableCacheStrategy = () => setIsCacheStrategy(false);

  const getCachedItem = useCallback(() => {
    const data = window.localStorage.getItem(key);

    if (!data) return undefined;

    return JSON.parse(data) as T;
  }, [key]);

  const setCachedItem = useCallback(
    (data: T) => window.localStorage.setItem(key, JSON.stringify(data)),
    [key]
  );

  return {
    isCacheStrategy,
    toggleCacheStrategy,
    enableCacheStrategy,
    disableCacheStrategy,
    getCachedItem,
    setCachedItem,
  };
};
