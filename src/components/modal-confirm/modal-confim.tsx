import { Modal } from 'antd';
import { observer } from 'mobx-react';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { Colors } from 'src/assets';
import { ButtonLoading } from '../Button';
import { IconBase } from '../icon-base';
import './modal-confirm.css';
interface IProps {
    onConfirm?: (e?: Event) => void;
    onCancel?: () => void;
    label?: string;
    centered?: boolean;
}

export const ModalConfirm = observer(
    forwardRef((props: IProps, ref) => {
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

        const onCancel = (e) => {
            close();
            props.onCancel && props.onCancel();
            e.stopPropagation();
        };

        const onConfirm = (e) => {
            close();
            props.onConfirm && props.onConfirm(e);
            e.stopPropagation();
        };

        return (
            <Modal
                open={isOpenModal}
                footer={null}
                className='modal-confirm'
                closable={false}
                centered={props.centered}
            >
                <div className='w-full h-full flex flex-col'>
                    <div className='h-10 flex justify-center items-center border-b border-gray-200 text-llg font-medium'>
                        <span>Thông báo</span>
                    </div>
                    <div className='flex flex-col items-center justify-center w-full h-[100px]'>
                        <div className='flex flex-row items-center space-x-2'>
                            <IconBase icon='warning' size={16} color={Colors.orange[400]} />
                            <span className='text-orange-600 text-lg font-medium'>Lưu ý</span>
                        </div>
                        <span className='text-md'>{props.label}</span>
                    </div>
                    <div className='flex flex-row items-center justify-center space-x-3 py-3 border-t border-gray-200'>
                        <ButtonLoading
                            className='w-[141px] flex flex-none justify-center'
                            template='ActionOrangeOutline'
                            size='xs'
                            label={'Huỷ bỏ'}
                            onClick={onCancel}
                        />
                        <ButtonLoading
                            className='w-[141px] flex flex-none justify-center'
                            template='ActionBlue'
                            size='xs'
                            label={'Xác nhận'}
                            onClick={onConfirm}
                        />
                    </div>
                </div>
            </Modal>
        );
    }),
);
