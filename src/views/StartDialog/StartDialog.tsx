import style from './style.module.css';
import { Trans, useTranslation } from 'react-i18next';
import { menuShowShareAtom, UserInfo } from '../../atoms/state';
import { useAtom } from 'jotai';
import { useCallback } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@mui/material';
import { LargeButton, QRCode } from '@knicos/genai-base';

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
                    <QRCode
                        url={`${window.location.origin}/student/${code}/main`}
                        size="large"
                        label={t('teacher.aria.linkForFeed')}
                    />
                    <div className={style.column}>
                        <div style={{ textAlign: 'center' }}>
                            <Trans
                                values={{ codeText: code }}
                                i18nKey="teacher.messages.connection"
                                components={{
                                    Code: <em />,
                                }}
                            />
                        </div>
                        <a
                            href={`${window.location.origin}`}
                            target="_blank"
                            rel="noreferrer"
                        >
                            {window.location.host}
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
                            color="secondary"
                            data-testid="teacher-start-button"
                            onClick={doClose}
                        >
                            {t('teacher.actions.start')}
                        </LargeButton>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
