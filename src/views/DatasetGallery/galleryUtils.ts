import { Labels } from '../../utils/types';

export function isTrashClass(label: string): boolean {
    return label.startsWith('_{') && label.endsWith('}');
}

export function sortLabels(labelList: string[], labels?: Labels): string[] {
    return labelList.slice().sort((a, b) => {
        const va = labels?.labels?.get(a) ?? a;
        const vb = labels?.labels?.get(b) ?? b;
        return va.localeCompare(vb, 'fi', { sensitivity: 'base' });
    });
}

export function formatLabel(label: string, labels?: Labels): string {
    return labels?.labels?.get(label) ?? label;
}

export function formatTrashLabel(label: string, labels?: Labels): string {
    const formatted = labels?.labels?.get(label) ?? label;
    return formatted.replace(/^_\{/, '').replace(/\}$/, '').replace(/_/g, ' ');
}
