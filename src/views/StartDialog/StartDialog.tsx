import style from './style.module.css';
import { Trans, useTranslation } from 'react-i18next';
import { menuShowShareAtom } from '../../atoms/state';
import { UserInfo } from '../../utils/types';
import { useAtom } from 'jotai';
import { useCallback } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@mui/material';
import { LargeButton, QRCode } from '@genai-fi/base';

interface Props {
    users: UserInfo[];
    code: string;
}

export default function StartDialog({ users, code }: Props) {
    const { t } = useTranslation();
    const [showDialog, setShowDialog] = useAtom(menuShowShareAtom);

    const doClose = useCallback(() => setShowDialog(false), [setShowDialog]);

    return (
        <Dialog
            open={showDialog}
            onClose={doClose}
            maxWidth="md"
        >
            <DialogTitle className={style.title}>{t('teacher.titles.connectUsers')}</DialogTitle>
            <DialogContent>
                <div className={style.connectMessage}>
                    <div className={style.column}>
                        {t('teacher.messages.scanQR')}
                        <QRCode
                            url={`${window.location.origin}/student/${code}/main`}
                            size="large"
                            label={t('teacher.aria.linkForFeed')}
                        />
                    </div>
                    <div className={style.column}>
                        <div>
                            <Trans
                                values={{ codeText: code }}
                                i18nKey="teacher.messages.connection"
                                components={{
                                    Code: <em />,
                                }}
                            />
                        </div>
                        <a
                            style={{ wordBreak: 'break-all' }}
                            href={window.location.host}
                            target="_blank"
                            rel="noreferrer"
                        >
                            {window.location.host}
                        </a>
                        {t('teacher.messages.orGoStraight')}
                        <a
                            style={{ wordBreak: 'break-all' }}
                            href={`${window.location.origin}/student/${code}/main`}
                            target="_blank"
                            rel="noreferrer"
                        >
                            {`${window.location.host}/student/${code}/main`}
                        </a>
                    </div>
                </div>
                <div className={style.userListing}>
                    {users.length === 0 && <div>{t('teacher.messages.waitingPeople')}</div>}
                    {users.length === 1 && <div>{t('teacher.messages.onePerson', { count: users.length })}</div>}
                    {users.length > 1 && <div>{t('teacher.messages.manyPeople', { count: users.length })}</div>}
                    <div className={style.buttonGroup}>
                        <LargeButton
                            variant="contained"
                            color="primary"
                            data-testid="teacher-start-button"
                            onClick={doClose}
                        >
                            {t('common.close')}
                        </LargeButton>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
