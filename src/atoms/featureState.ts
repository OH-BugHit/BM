import { atom } from 'jotai';

interface FeatureFlags {
    allowReportProblem?: boolean;
}

export const featureFlagsAtom = atom(async () => {
    try {
        const isStagingEnv = !window.location.hostname.endsWith('gen-ai.fi');
        const response = await fetch(
            `${import.meta.env.VITE_API_SHARE_BASE_URL}/features/${isStagingEnv ? 'spoof-staging' : 'spoof'}`
        );
        const data: { features: FeatureFlags } = await response.json();
        const features = data.features as FeatureFlags;
        return features;
    } catch {
        return {
            allowReportProblem: false,
        };
    }
});
