import style from './style.module.css';
import { useState } from 'react';
import ClassSelect from './ClassSelect/ClassSelect';
import Leaderboard from './Leaderboard/Leaderboard';
import OpenedImage from '../../components/ImageView/OpenedImage';

export default function Scoreboard() {
    const [openResult, setOpenResult] = useState<string | null>(null);
    const [openImage, setOpenImage] = useState<string | null>(null);

    return (
        <div className={style.scoreboard}>
            {openImage && (
                <OpenedImage
                    openImage={openImage}
                    setOpenImage={setOpenImage}
                />
            )}
            <ClassSelect
                openResult={openResult}
                setOpenResult={setOpenResult}
            />
            <Leaderboard className={openResult} />
        </div>
    );
}
