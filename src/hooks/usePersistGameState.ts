import { useEffect, useRef } from 'react';
import { useAtomValue } from 'jotai';
import { configAtom, usersAtom, studentDataAtom, takenUsernamesAtom, termTransferAtom } from '../atoms/state';
import { serializeStudentData } from '../utils/serializeStudentData';
import { SerializedStudentData, SpoofConfig, Username } from '../utils/types';

// when last save and what was last saved
type TimerInfo<T> = {
    lastSaved: number;
    lastValue: T | null;
};

type Timers = {
    gameConfig: TimerInfo<SpoofConfig>;
    gameUsers: TimerInfo<Username[]>;
    gameScores: TimerInfo<SerializedStudentData>;
};

export function usePersistGameState() {
    const config = useAtomValue(configAtom);
    const users = useAtomValue(usersAtom);
    const takenUsernames = useAtomValue(takenUsernamesAtom);
    const studentData = useAtomValue(studentDataAtom);
    const currentLabel = useAtomValue(termTransferAtom);

    const currentCommonLabelRef = useRef<string>(sessionStorage.getItem('currentCommonLabel') || '');

    const timers = useRef<Timers>({
        gameConfig: { lastSaved: 0, lastValue: null },
        gameUsers: { lastSaved: 0, lastValue: null },
        gameScores: { lastSaved: 0, lastValue: null },
    });

    const delay = 8000; // Throttles saving to delay ms

    useEffect(() => {
        const interval = setInterval(() => {
            const now = Date.now();

            // We have three different things to save
            // key is type of data, value is the actual data
            // Scores are modified to only include scores and drop out canvases.
            const values: [keyof Timers, SpoofConfig | Username[] | SerializedStudentData][] = [
                ['gameConfig', config],
                ['gameUsers', takenUsernames],
                ['gameScores', serializeStudentData(studentData)],
            ];

            values.forEach(([key, value]) => {
                const timer = timers.current[key];
                // only save if value (Jotai object) is different (no actual comparing stuff) and throttle time has passed
                if (timer.lastValue !== value && now - timer.lastSaved >= delay) {
                    sessionStorage.setItem(key, JSON.stringify(value));
                    timer.lastSaved = now;
                    timer.lastValue = value;
                }
            });
        }, 200); // check evert 200ms if we need to save something.

        return () => clearInterval(interval);
    }, [config, users, studentData, takenUsernames]);

    useEffect(() => {
        if (currentLabel.recipient.username === 'a') {
            currentCommonLabelRef.current = currentLabel.term;
        }
        sessionStorage.setItem('currentCommonLabel', currentCommonLabelRef.current);
    }, [currentLabel]);
}
