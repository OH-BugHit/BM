import style from './style.module.css';
import { Trans, useTranslation } from 'react-i18next';
import { useAtom } from 'jotai';
import { useCallback } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@mui/material';
import { LargeButton } from '@knicos/genai-base';
import { selectedUserAtom, showUserTermDialogAtom } from '../../atoms/state';
import { CanvasCopy } from '../../components/CanvasCopy/CanvasCopy';
import TermSelector from '../../components/TermSelector/TermSelector';

export default function UserTermDialog({ allLabels }: { allLabels: string[] }) {
    const { t } = useTranslation();
    const [showDialog, setShowDialog] = useAtom(showUserTermDialogAtom);
    const [, setSelectedUser] = useAtom(selectedUserAtom);
    const doClose = useCallback(() => {
        setShowDialog(false);
        setTimeout(() => {
            setSelectedUser({ username: '', profilePicture: null });
        }, 300);
    }, [setShowDialog, setSelectedUser]);
    const [selectedUser] = useAtom(selectedUserAtom);

    return (
        <Dialog
            open={showDialog}
            onClose={doClose}
            maxWidth="md"
        >
            <DialogTitle className={style.title}>
                <Trans
                    values={{ user: selectedUser.username }}
                    i18nKey="termSelect.titles.change"
                />
            </DialogTitle>
            <DialogContent>
                <div className={style.selectModelMessage}>
                    <div className={style.columnItem}>
                        {selectedUser.profilePicture && (
                            <CanvasCopy
                                sourceCanvas={selectedUser.profilePicture}
                                maxWidth={200}
                            />
                        )}
                    </div>
                    <div className={style.column}>
                        <div className={style.columnItem}>
                            <TermSelector allLabels={allLabels} />
                        </div>
                    </div>
                </div>
                <div className={style.buttonGroup}>
                    <LargeButton
                        variant="contained"
                        color="primary"
                        onClick={doClose}
                    >
                        {t('common.close')}
                    </LargeButton>
                </div>
            </DialogContent>
        </Dialog>
    );
}
