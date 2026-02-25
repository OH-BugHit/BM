import { PropsWithChildren } from 'react';
import style from './style.module.css';
import { AlertPara, Spinner } from '@genai-fi/base';
import { useAtomValue } from 'jotai';
import { loadingErrorAtom } from '../../atoms/state';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import { Trans } from 'react-i18next';

interface Props extends PropsWithChildren {
    loading: boolean;
    message?: string;
}

export default function Loading({ loading, children, message }: Props) {
    const loadingError = useAtomValue(loadingErrorAtom);

    const errorMessage = () => {
        return (
            <>
                <Trans
                    i18nKey={loadingError.message}
                    parent="span"
                    components={{
                        Link: (
                            <a
                                href="https://github.com/OH-BugHit/BM/issues"
                                target="_blank"
                                rel="noreferrer"
                            />
                        ),
                        Model: <b>{loadingError.modelInfo?.name}</b>,
                        Origin: <b>{loadingError.modelInfo?.origin}</b>,
                        br: <br />,
                        Refresh: (
                            <a
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    window.location.reload();
                                }}
                            />
                        ),
                        Main: (
                            <a
                                href="https://spoof.gen-ai.fi/"
                                rel="noreferrer"
                            />
                        ),
                    }}
                />
            </>
        );
    };

    return loading ? (
        <div className={style.container}>
            {loadingError.isError ? (
                <SentimentDissatisfiedIcon
                    color="error"
                    fontSize="large"
                />
            ) : (
                <Spinner />
            )}
            {message && (
                <div>
                    {loadingError.isError ? (
                        <AlertPara severity="info">{errorMessage()}</AlertPara>
                    ) : (
                        <AlertPara severity="info">{message}</AlertPara>
                    )}
                </div>
            )}
        </div>
    ) : (
        children
    );
}
