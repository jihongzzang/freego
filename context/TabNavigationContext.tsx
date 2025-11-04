import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSegments } from 'expo-router';

type TabNavigationContextType = {
  currentTabIndex: number;
  previousTabIndex: number;
  direction: 'left' | 'right' | 'none';
};

const TabNavigationContext = createContext<TabNavigationContextType>({
  currentTabIndex: 0,
  previousTabIndex: 0,
  direction: 'none',
});

const TAB_ORDER = ['index', 'add', 'shopping', 'statistics', 'settings'];

export function TabNavigationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const segments = useSegments();
  const [previousTabIndex, setPreviousTabIndex] = useState(0);
  const [currentTabIndex, setCurrentTabIndex] = useState(0);
  const [direction, setDirection] = useState<'left' | 'right' | 'none'>('none');

  useEffect(() => {
    const currentTab = segments[1] || 'index';
    const newIndex = TAB_ORDER.indexOf(currentTab);

    if (newIndex !== -1 && newIndex !== currentTabIndex) {
      setPreviousTabIndex(currentTabIndex);

      if (newIndex > currentTabIndex) {
        setDirection('right');
      } else if (newIndex < currentTabIndex) {
        setDirection('left');
      }

      setCurrentTabIndex(newIndex);
    }
  }, [segments]);

  return (
    <TabNavigationContext.Provider
      value={{ currentTabIndex, previousTabIndex, direction }}
    >
      {children}
    </TabNavigationContext.Provider>
  );
}

export function useTabNavigation() {
  return useContext(TabNavigationContext);
}

export { TAB_ORDER };
