
export type NavigationFn = (path: string) => void;

export type NavigationContextValue = {
    navigate: NavigationFn;
    replace: NavigationFn;
};

export const noopNavigation = () => {
    // Fallback for environments without a navigation provider
    // eslint-disable-next-line no-console
    console.warn("NavigationProvider not found; falling back to document navigation.");
};

export const defaultNavigate: NavigationFn = (path: string) => {
    if (typeof window !== "undefined") {
        window.location.href = path;
    } else {
        noopNavigation();
    }
};

export const defaultReplace: NavigationFn = (path: string) => {
    if (typeof window !== "undefined") {
        window.location.replace(path);
    } else {
        noopNavigation();
    }
};
