import { Dropdown, MenuProps, Modal } from 'antd';
import { observer } from 'mobx-react';
import { forwardRef, useImperativeHandle, useMemo, useState } from 'react';
import { landData } from 'src/assets';
import { CutSignOfVietNamese } from 'src/core/base';
import { ButtonLoading } from '../Button';
import './modal-note-planing-map.css';
interface IProps {
    onConfirm?: (e?: Event) => void;
    onCancel?: () => void;
    label?: string;
    centered?: boolean;
}

export const ModalNoteLandingMap = observer(
    forwardRef((props: IProps, ref) => {
        const [isOpenModal, setOpenModal] = useState(false);
        const [searchText, setSearchText] = useState('');
        const [searchCode, setSearchCode] = useState('');

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

        const filteredData = useMemo(() => {
            const normalizedSearchText = CutSignOfVietNamese(searchText.toLowerCase());
            const normalizedSearchCode = searchCode.toLowerCase();

            return landData.filter(item => {
                const normalizedName = CutSignOfVietNamese(item.name.toLowerCase());
                const normalizedCode = item.code.toLowerCase();

                return normalizedName.includes(normalizedSearchText) &&
                    normalizedCode.includes(normalizedSearchCode);
            });
        }, [searchText, searchCode]);

        const items: MenuProps['items'] = [
            {
                key: 1,
                label: 'Hỏi chat bot',
                onClick: () => {

                }
            },
            // {
            //     key: 2,
            //     label: 'Mặt đường',
            //     onClick: () => {
            //     }
            // },
        ]

        return (
            <Modal
                open={isOpenModal}
                footer={null}
                className='modal-confirm'
                closable={false}
                centered={props.centered}
            >
                <div className='w-full h-full flex flex-col bg-white rounded'>
                    <div className='h-[52px] flex justify-center items-center border-b border-gray-200 text-llg font-medium'>
                        <span className='text-gray-700 text-xl'>Ký hiệu các loại đất trên bản đồ quy hoạch</span>
                    </div>
                    <div className='flex flex-col items-center justify-center w-full h-[496px] text-gray-700'>
                        <div className='flex flex-col w-full'>
                            {/* Header */}
                            <div className='grid grid-cols-12 bg-gray-100 font-semibold text-sm py-2'>
                                <div className='col-span-1 px-4'>STT</div>
                                <div className='col-span-8 px-4'>Loại đất</div>
                                <div className='col-span-3 px-4'>Mã đất</div>
                            </div>

                            {/* Updated Search filters */}
                            <div className='grid grid-cols-12 border-b border-gray-100 py-2'>
                                <div className='col-span-1'></div>
                                <div className='col-span-8 px-2'>
                                    <input
                                        type="text"
                                        className="w-full px-3 py-2 border border-gray-200 outline-none  rounded"
                                        placeholder="Tìm loại đất hoặc thứ tự danh mục"
                                        value={searchText}
                                        onChange={(e) => setSearchText(e.target.value)}
                                    />
                                </div>
                                <div className='col-span-3 px-2'>
                                    <input
                                        type="text"
                                        className="w-full px-3 py-2 border border-gray-200 outline-none rounded"
                                        placeholder="Tìm mã đất"
                                        value={searchCode}
                                        onChange={(e) => setSearchCode(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Updated Data rows to use filteredData */}
                            <div className='h-[400px] overflow-y-auto'>
                                {filteredData.map((item, index) => (
                                    <div key={index} className='grid grid-cols-12 hover:bg-gray-50 border-b border-gray-100 py-2 min-h-14'>
                                        <div className='col-span-1 px-4 flex items-center'>{index + 1}</div>
                                        <div className='col-span-8 px-4  flex items-center'>
                                            <Dropdown menu={{ items }} trigger={['click', 'hover']} >
                                                <span>{item.name}</span>
                                            </Dropdown>
                                        </div>
                                        <div
                                            className='col-span-3 text-center px-4 items-center justify-center flex'
                                            style={{ backgroundColor: item.color }}
                                        >
                                            {item.code}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className='flex flex-row items-center justify-end space-x-3 p-3 border-t border-gray-200'>
                        <ButtonLoading
                            className='flex flex-none justify-center'
                            template='ActionBgNone'
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
