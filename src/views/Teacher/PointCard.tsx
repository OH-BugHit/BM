import { useTranslation } from 'react-i18next';
import { CanvasCopy } from '../../components/CanvasCopy/CanvasCopy';

interface Props {
    place: 'top' | 'rest';
    entry: {
        studentId: string;
        score: number;
        topCanvas: HTMLCanvasElement | null;
        topHeatmap: HTMLCanvasElement | null;
    };
    setOpenImage: (dataUrl: string) => void;
}
export default function PointCard({ place, entry, setOpenImage }: Props) {
    const { t } = useTranslation();
    return (
        <div>
            <div>
                <b>Name:</b> {entry.studentId}
            </div>
            {place === 'top' && (
                <div>
                    <b>Score:</b> {entry.score}
                </div>
            )}
            {entry.topCanvas && (
                <div
                    onClick={() => {
                        const dataUrl = entry.topCanvas?.toDataURL();
                        if (dataUrl) setOpenImage(dataUrl);
                    }}
                    style={{ cursor: 'pointer' }}
                >
                    <h4>{t('scores.bestImage')}</h4>
                    <CanvasCopy
                        sourceCanvas={entry.topCanvas}
                        maxWidth={200}
                    />
                </div>
            )}
            {entry.topHeatmap && (
                <div>
                    <div
                        onClick={() => {
                            const dataUrl = entry.topHeatmap?.toDataURL();
                            if (dataUrl) setOpenImage(dataUrl);
                        }}
                        style={{ cursor: 'pointer' }}
                    >
                        <h4>Heatmap</h4>
                        <CanvasCopy
                            sourceCanvas={entry.topHeatmap}
                            maxWidth={200}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
