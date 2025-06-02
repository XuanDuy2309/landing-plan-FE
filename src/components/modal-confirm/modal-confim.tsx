import { Modal } from 'antd';
import { observer } from 'mobx-react';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { Colors } from 'src/assets';
import { ButtonLoading } from '../Button';
import { IconBase } from '../icon-base';
import './modal-confirm.css';

interface ModalConfirmProps {
    // Callback functions
    onConfirm?: (e: React.MouseEvent) => void | Promise<void>;
    onCancel?: (e: React.MouseEvent) => void | Promise<void>;

    // Content
    title?: string;
    label?: string;
    confirmLabel?: string;
    cancelLabel?: string;

    // Styling
    centered?: boolean;
    width?: number;
    icon?: string;
    iconColor?: string;

    // State
    loading?: boolean;
    danger?: boolean;
}

export interface ModalConfirmRef {
    open: () => void;
    close: () => void;
}

export const ModalConfirm = observer(
    forwardRef<ModalConfirmRef, ModalConfirmProps>((props, ref) => {
        const {
            title = 'Thông báo',
            label,
            confirmLabel = 'Xác nhận',
            cancelLabel = 'Huỷ bỏ',
            icon = 'warning',
            iconColor = Colors.orange[400],
            width = 500,
            centered = true,
            loading = false,
            danger = false
        } = props;

        const [isOpenModal, setOpenModal] = useState(false);
        const [isConfirmLoading, setConfirmLoading] = useState(false);

        const open = () => setOpenModal(true);
        const close = () => setOpenModal(false);

        useImperativeHandle(ref, () => ({
            open,
            close,
        }));

        const handleCancel = async (e: React.MouseEvent) => {
            try {
                if (props.onCancel) {
                    await props.onCancel(e);
                }
                close();
            } catch (error) {
                console.error('Error in cancel handler:', error);
            }
            e.stopPropagation();
        };

        const handleConfirm = async (e: React.MouseEvent) => {
            try {
                setConfirmLoading(true);
                if (props.onConfirm) {
                    await props.onConfirm(e);
                }
                close();
            } catch (error) {
                console.error('Error in confirm handler:', error);
            } finally {
                setConfirmLoading(false);
            }
            e.stopPropagation();
        };

        return (
            <Modal
                open={isOpenModal}
                footer={null}
                className='modal-confirm'
                closable={false}
                centered={centered}
                width={width}
            >
                <div className='w-full h-full flex flex-col items-center'>
                    <div className='w-[450px] flex flex-col bg-white rounded-lg shadow-lg'>
                        {/* Header */}
                        <div className='h-14 w-full flex justify-center items-center border-b border-gray-200'>
                            <span className='text-gray-700 text-xl font-medium'>{title}</span>
                        </div>

                        {/* Content */}
                        <div className='flex flex-col items-center justify-center w-full min-h-[100px] p-4'>
                            <div className='flex flex-row items-center space-x-2 mb-2'>
                                <IconBase
                                    icon={icon}
                                    size={16}
                                    color={danger ? Colors.red[400] : iconColor}
                                />
                                <span className={`text-lg font-medium ${danger ? 'text-red-600' : 'text-orange-600'}`}>
                                    Lưu ý
                                </span>
                            </div>
                            <span className='text-md text-center'>{label}</span>
                        </div>

                        {/* Footer */}
                        <div className='flex flex-row items-center justify-center space-x-3 py-3 border-t border-gray-200'>
                            <ButtonLoading
                                className='w-[141px] flex flex-none justify-center'
                                template='ActionOrangeOutline'
                                size='xs'
                                label={cancelLabel}
                                onClick={handleCancel}
                                disabled={loading || isConfirmLoading}
                            />
                            <ButtonLoading
                                className='w-[141px] flex flex-none justify-center'
                                template={danger ? 'ActionOrange' : 'ActionBlue'}
                                size='xs'
                                label={confirmLabel}
                                onClick={handleConfirm}
                                loading={loading || isConfirmLoading}
                            />
                        </div>
                    </div>
                </div>
            </Modal>
        );
    }),
);
