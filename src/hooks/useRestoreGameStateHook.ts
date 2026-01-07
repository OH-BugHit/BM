import { useEffect } from 'react';
import { useAtom } from 'jotai';
import {
    configAtom,
    usersAtom,
    studentDataAtom,
    modelAtom,
    labelsAtom,
    takenUsernamesAtom,
    termTransferAtom,
} from '../atoms/state';
import { deserializeStudentData } from '../utils/serializeStudentData';
import { loadLabels, loadModel } from '../services/loadModel';
import { useTranslation } from 'react-i18next';
import { Username } from '../utils/types';

export function useRestoreGameState() {
    const [, setConfig] = useAtom(configAtom);
    const [, setUsers] = useAtom(usersAtom);
    const [, setAll] = useAtom(takenUsernamesAtom);
    const [, setStudentData] = useAtom(studentDataAtom);
    const [, setModel] = useAtom(modelAtom);
    const [, setLabels] = useAtom(labelsAtom);
    const [, setCurrentLabel] = useAtom(termTransferAtom);
    const { i18n } = useTranslation();

    useEffect(() => {
        const rawConfig = sessionStorage.getItem('gameConfig');
        if (rawConfig) {
            loadModel(JSON.parse(rawConfig).modelData).then((m) => {
                setModel(m);
                setConfig(JSON.parse(rawConfig));
                loadLabels({
                    language: i18n.language,
                    modelName: JSON.parse(rawConfig).modelData.name,
                }).then((labels) => {
                    if (labels) {
                        setLabels(() => {
                            const newLabels = new Map<string, string>();
                            Object.entries(labels).forEach(([label, translation]) => {
                                newLabels.set(label as string, translation as string);
                            });
                            return { labels: newLabels };
                        });
                    } else {
                        setLabels(() => {
                            // Default fallback to model.getLabels!
                            const newLabels = new Map<string, string>();
                            const labelList = m?.getLabels() ?? [];
                            labelList.forEach((label) => {
                                newLabels.set(label, label);
                            });
                            return { labels: newLabels };
                        });
                    }
                });
            });
        }

        const rawUsers = sessionStorage.getItem('gameUsers');
        if (rawUsers) {
            const gameUsers: Username[] = JSON.parse(rawUsers);
            setUsers([]);
            setAll(gameUsers ?? []);
        }

        const rawScores = sessionStorage.getItem('gameScores');
        if (rawScores) setStudentData(deserializeStudentData(JSON.parse(rawScores)));

        const rawCurrentLabel = sessionStorage.getItem('currentCommonLabel');
        if (rawCurrentLabel) {
            setCurrentLabel({
                term: rawCurrentLabel,
                recipient: { username: 'a' },
            });
        }
    }, [setConfig, setUsers, setStudentData, setModel, setLabels, setAll, setCurrentLabel, i18n]);
}
