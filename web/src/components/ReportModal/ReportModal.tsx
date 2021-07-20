import React from 'react'
import { useState } from 'react'
import { Button, Modal } from 'react-bootstrap'
import api from '../../api'
import Bot from '../../interfaces/bot.interface'
import { Snackbar } from '@material-ui/core'

interface Props {
    bot: Bot
    isShow: boolean
    setShow: (show: boolean) => void
}

const ReportModal: React.FC<Props> = ({ bot, isShow, setShow }) => {
    const [message, setMessage] = useState('')
    const [isSuccess, setSuccess] = useState(false)

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
                message="Жалоба успешно отправлена!"
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
                        Пожаловаться на бота "{bot.name}"
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <textarea
                        onChange={e => setMessage(e.target.value)}
                        placeholder="Ваша жалоба"
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => setShow(false)}>Закрыть</Button>
                    <Button disabled={message.length === 0} onClick={send}>
                        Отправить
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default ReportModal
