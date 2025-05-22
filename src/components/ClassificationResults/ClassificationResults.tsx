import { useAtom } from 'jotai';
import { classificationResultAtom } from '../../atoms/state';
import style from './style.module.css';

export function ClassificationResults() {
    const [classificationResult] = useAtom(classificationResultAtom);
    return (
        <>
            {classificationResult && (
                <div className={style.classificationBox}>
                    <h3>Luokittelutulos:</h3>
                    <ul>
                        {classificationResult.map((res, idx) => (
                            <li key={idx}>
                                {res.className} ({(res.probability * 100).toFixed(1)} %)
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </>
    );
}
