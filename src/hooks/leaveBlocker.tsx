import { useEffect } from 'react';

/**
 * Warn the user about leaving the page if 'shoudlblock' is true.
 * @param shouldBlock True if the user should be warned about leaving the page
 */
export function useLeaveWarning(shouldBlock: boolean) {
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (shouldBlock) {
                e.preventDefault();
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [shouldBlock]);
}
