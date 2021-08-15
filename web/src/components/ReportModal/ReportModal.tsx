import React from 'react'
import { useState } from 'react'
import { Button, Modal } from 'react-bootstrap'
import api from '../../api'
import Bot from '../../interfaces/bot.interface'
import { Snackbar } from '@material-ui/core'
import { useTranslation } from 'react-i18next'

interface Props {
    bot: Bot
    isShow: boolean
    setShow: (show: boolean) => void
}

const ReportModal: React.FC<Props> = ({ bot, isShow, setShow }) => {
    const [message, setMessage] = useState('')
    const [isSuccess, setSuccess] = useState(false)
    const { t } = useTranslation()

    const send = async () => {
        const data = await api.sendReport(bot.id, message)
        if (!data) return
        setMessage('')
        setShow(false)
        setSuccess(true)
    }

    return (
        <>
            <Snackbar
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                open={isSuccess}
                onClose={() => setSuccess(false)}
                message={t('reportModal.success')}
            />
            <Modal
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                show={isShow}
                onHide={() => setShow(false)}
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        {t('reportModal.title')} "{bot.name}"
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <textarea
                        onChange={e => setMessage(e.target.value)}
                        placeholder={t('reportModal.placeholder')}
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => setShow(false)}>
                        {t('reportModal.close')}
                    </Button>
                    <Button disabled={message.length === 0} onClick={send}>
                        {t('reportModal.send')}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default ReportModal
