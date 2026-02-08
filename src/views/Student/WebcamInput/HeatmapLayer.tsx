import { useAtomValue } from 'jotai';
import style from './webcamInput.module.css';
import { configAtom, studentControlsAtom } from '../../../atoms/state';
import { RefObject } from 'react';

interface Props {
    heatmapRef: RefObject<HTMLCanvasElement | null>;
}

export default function HeatmapLayer({ heatmapRef }: Props) {
    const config = useAtomValue(configAtom);
    const controls = useAtomValue(studentControlsAtom);

    return (
        <div
            className={` ${(config.heatmap.on && controls.heatmap) || config.heatmap.force ? style.heatmapCanvas : style.hiddenCanvas}`}
        >
            <canvas
                ref={heatmapRef}
                width={224}
                height={224}
            />
        </div>
    );
}
