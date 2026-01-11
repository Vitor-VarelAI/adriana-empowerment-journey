import { createContext, ReactNode, useContext, useMemo } from "react";
import {
  NavigationContextValue,
  defaultNavigate,
  defaultReplace,
  NavigationFn
} from "./NavigationContext.types";

export const NavigationContext = createContext<NavigationContextValue>({
  navigate: defaultNavigate,
  replace: defaultReplace,
});

export function NavigationProvider({
  navigate,
  replace,
  children,
}: {
  navigate: NavigationFn;
  replace?: NavigationFn;
  children: ReactNode;
}) {
  const value = useMemo(
    () => ({
      navigate,
      replace: replace ?? defaultReplace,
    }),
    [navigate, replace],
  );

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
}


