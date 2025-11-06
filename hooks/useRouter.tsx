import { useRouter as useExpoRouter, Href } from 'expo-router';
import { NavigationOptions } from 'expo-router/build/global-state/routing';
import { useCallback } from 'react';

export function useRouter() {
  const router = useExpoRouter();

  const push = useCallback(
    (href: Href, options?: NavigationOptions) => {
      router.push(href, options);
    },
    [router.push],
  );

  const replace = useCallback(
    (href: Href, options?: NavigationOptions) => {
      router.replace(href, options);
    },
    [router.replace],
  );

  const back = useCallback(() => {
    router.back();
  }, [router.back]);

  const canGoBack = useCallback(() => {
    return router.canGoBack();
  }, [router.canGoBack]);

  const setParams = useCallback(
    (params: Record<string, string>) => {
      router.setParams(params);
    },
    [router.setParams],
  );

  const navigate = useCallback(
    (href: Href, options?: NavigationOptions) => {
      router.navigate(href, options);
    },
    [router.navigate],
  );

  return {
    push,
    replace,
    back,
    canGoBack,
    setParams,
    navigate,
  };
}
