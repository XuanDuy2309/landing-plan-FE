import { Modal } from "antd"
import { observer } from "mobx-react"
import { forwardRef, useImperativeHandle, useState } from "react"
import "./modal-base.css"

interface IProps {
    children: React.ReactNode
    destroyOnClose?: boolean
}

export const ModalBase = observer(forwardRef(({ children, destroyOnClose }: IProps, ref) => {
    const [isOpenModal, setOpenModal] = useState(false);

    const open = () => {
        setOpenModal(true);
    };

    const close = () => {
        setOpenModal(false);
    };

    useImperativeHandle(ref, () => ({
        open,
        close,
    }));
    return <Modal
        open={isOpenModal}
        footer={null}
        className='modal-base'
        closable={false}
        centered={true}
        onCancel={close}
        destroyOnClose={destroyOnClose}
    >
        {children}
    </Modal>
}))