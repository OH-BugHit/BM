import SaveAltIcon from '@mui/icons-material/SaveAlt';
import IconMenuItem from '../IconMenu/Items';
import { MenuButton } from '../Buttons/MenuButton';
import React from 'react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { canvasToBlob, mergeCanvases } from '../../utils/save';
import { useTranslation } from 'react-i18next';
import { useStore } from 'jotai';
import { studentDataAtom } from '../../atoms/state';

interface Props {
    showText: boolean;
}
function SaveButton({ showText }: Props) {
    const { t } = useTranslation();
    const store = useStore();

    async function downloadResults() {
        const data = store.get(studentDataAtom);

        const zip = new JSZip();

        for (const [studentId, scores] of data.students) {
            for (const [term, scoreData] of scores.data) {
                const folder = zip.folder(term);
                if (!folder) continue;

                const merged = mergeCanvases(scoreData.topCanvas, scoreData.topHeatmap);

                if (!merged) continue;

                const blob = await canvasToBlob(merged);

                const filename =
                    [scoreData.score ?? 'NA', scoreData.hidden ? 'hidden' : 'visible', term, studentId].join('_') +
                    '.png';

                folder.file(filename, blob);
            }
        }

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
