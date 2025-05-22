import React, { useEffect, useState } from 'react';

interface CountdownTimerProps {
    setDisableMoveNext: (value: boolean) => void;
    restart: boolean;
    setRestart: (value: boolean) => void;
}

export default function CountdownTimer({
    setDisableMoveNext,
    restart,
    setRestart,
}: CountdownTimerProps): React.ReactElement {
    const [secondsLeft, setSecondsLeft] = useState<number>(5);

    useEffect(() => {
        if (restart) {
            setRestart(false);
            setDisableMoveNext(true);
            setSecondsLeft(5); // aloita laskuri
        }
    }, [restart, setRestart, setDisableMoveNext]);

    useEffect(() => {
        if (secondsLeft <= 0) {
            setDisableMoveNext(false);
            return;
        }

        const interval = setInterval(() => {
            setSecondsLeft((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [secondsLeft, setDisableMoveNext]);

    return (
        <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
            {secondsLeft > 0 ? `Aikaa jäljellä: ${secondsLeft} s` : 'Siirry seuraavaan vaiheeseen'}
        </div>
    );
}
