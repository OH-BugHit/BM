import SaveAltIcon from '@mui/icons-material/SaveAlt';
import IconMenuItem from '../IconMenu/Items';
import { MenuButton } from '../Buttons/MenuButton';
import React from 'react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { canvasToBlob, mergeCanvases, upscaleCanvasToSameSize } from '../../utils/save';
import { useTranslation } from 'react-i18next';
import { useStore } from 'jotai';
import { modelAtom, studentDataAtom } from '../../atoms/state';

interface Props {
    showText: boolean;
}

function SaveButton({ showText }: Props) {
    const { t } = useTranslation();
    const store = useStore();

    async function downloadResults() {
        const data = store.get(studentDataAtom);
        const model = store.get(modelAtom);
        if (!data || !model) {
            console.error('No data or model found to save');
            return;
        }

        const zip = new JSZip();

        // Build metadata
        const metadata: Record<string, Record<string, { filename: string; score?: number; hidden: boolean }>> = {};

        for (const [studentId, scores] of data.students) {
            for (const [term, scoreData] of scores.data) {
                const folder = zip.folder(term);
                if (!folder) continue;

                const upScaledHeatmap = scoreData.topHeatmap
                    ? upscaleCanvasToSameSize(scoreData.topHeatmap, scoreData.topCanvas)
                    : null;
                const merged = mergeCanvases(scoreData.topCanvas, upScaledHeatmap);
                if (!merged) continue;
                const blob = await canvasToBlob(merged);

                const filename =
                    [scoreData.score ?? 'NA', scoreData.hidden ? 'hidden' : 'visible', term, studentId].join('_') +
                    '.png';

                folder.file(filename, blob);

                // Track in metadata instead of storing canvas data
                if (!metadata[studentId]) metadata[studentId] = {};
                metadata[studentId][term] = {
                    filename,
                    score: scoreData.score,
                    hidden: scoreData.hidden,
                };
            }
        }

        // Save metadata JSON with just filenames and metadata, no canvas data
        zip.file('game-state.json', JSON.stringify(metadata, null, 2));

        const zipBlob = await zip.generateAsync({ type: 'blob' });
        saveAs(zipBlob, 'results.zip');
    }

    return (
        <IconMenuItem
            tooltip={t('menu.labels.save')}
            selected={false}
            fullWidth
        >
            <MenuButton
                style={{}}
                color="inherit"
                onClick={() => downloadResults()}
                aria-label={t('menu.labels.save')}
                size={'large'}
                variant="text"
                fullWidth
            >
                <SaveAltIcon fontSize={'large'} />
                {showText ? `${t('menu.labels.saveShort')}` : ''}
            </MenuButton>
        </IconMenuItem>
    );
}

export default React.memo(SaveButton);
