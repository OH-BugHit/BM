import { Dispatch, SetStateAction } from 'react';
import { ModelOrigin, SpoofConfig } from '../../utils/types';
import { TFunction } from 'i18next';

interface Props {
    e: React.ChangeEvent<HTMLInputElement>;
    setSelectedFile: Dispatch<SetStateAction<File | null>>;
    setSelectedModel: Dispatch<SetStateAction<string>>;
}
export const handleFileChange = ({ e, setSelectedFile, setSelectedModel }: Props) => {
    if (e.target.files && e.target.files.length > 0) {
        setSelectedFile(e.target.files[0]);
        setSelectedModel('');
    }
};

interface CurrentModelProps {
    config: SpoofConfig;
    t: TFunction<'translation', undefined>;
}

export const currentModelName = ({ config, t }: CurrentModelProps) => {
    if (config.modelData.origin === ModelOrigin.GenAI) {
        return `${t('teacher.labels.currentModel')}: ${
            config.modelData.name
                ? config.modelData.name + ' ' + t('teacher.labels.from') + ' ' + config.modelData.origin
                : t('teacher.labels.noModel')
        }`;
    } else if (config.modelData.origin === ModelOrigin.Local) {
        return `${t('teacher.labels.currentModel')}: ${config.modelData.name.slice(0, -4)} ${t(
            'teacher.labels.from'
        )} ${config.modelData.origin}`;
    } else return '';
};
