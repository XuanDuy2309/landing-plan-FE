import { Modal, Switch } from 'antd';
import { observer } from 'mobx-react';
import { forwardRef, useEffect, useImperativeHandle, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { landData } from 'src/assets';
import { LandingMapApi } from 'src/core/api';
import { CutSignOfVietNamese } from 'src/core/base';
import { LandTypeChangeModel, Status } from 'src/core/models';
import { useManagementLandingPlan } from 'src/core/modules';
import { ButtonLoading } from '../Button';
import { DropdownSelectLandingType } from '../dropdown-select-landing-type';
import './modal-note-planing-map.css';
interface IProps {
    onConfirm?: (e?: Event) => void;
    onCancel?: () => void;
    label?: string;
    centered?: boolean;
    onClickDropdown?: (text: string) => void
}

export const ModalChangeLandType = observer(
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

        return (
            <Modal
                open={isOpenModal}
                footer={null}
                className='modal-confirm'
                closable={false}
                centered={props.centered}
            >
                <ContentModal onCancel={props.onCancel} />
            </Modal>
        );
    }),
);


const ContentModal = observer(({ onCancel }: IProps) => {
    const { pointsArea, placementInfo } = useManagementLandingPlan()
    const [data, setData] = useState<LandTypeChangeModel>(new LandTypeChangeModel())

    useEffect(() => {
        if (placementInfo?.display_name) {
            data.name = placementInfo.display_name
        }
        if (!pointsArea.isDraw && pointsArea.points.length > 3) {
            const coordinate = pointsArea.points.map((item) => {
                return item.join(' ')
            }).join(', ')
            data.condinates = 'POLYGON((' + coordinate + '))'
        }
    }, [placementInfo, pointsArea])
    return (
        <div className='w-full h-full flex flex-col bg-white rounded'>
            <div className='h-[52px] flex justify-center items-center border-b border-gray-200 text-llg font-medium'>
                <span className='text-gray-700 text-xl'>Chuyển đổi loại đất</span>
            </div>
            <div className='flex flex-col items-center justify-center w-full h-[496px] text-gray-700'>
                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-2">
                        <span className="w-24 text-end text-[14px] leading-4 text-gray-700">Khu vực:</span>
                        <span className=" text-end text-[14px] leading-4 text-gray-700">{data.name || ''}</span>

                    </div>

                    <div className="flex items-center gap-2">
                        <DropdownSelectLandingType
                            onSelect={(item) => {
                                data.land_type_id = item.id
                                data.land_type_code = item.code
                                data.land_type_name = item.name
                                data.land_type_color = item.color
                            }}
                            value={data.land_type_name}
                            error={data.err_land_type_id}
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="w-24 text-end text-[14px] leading-4 text-gray-700">Trạng thái:</span>
                        <Switch
                            checked={data.status === Status.active}
                            onChange={(checked) => data.status = checked ? Status.active : Status.inactive}
                        />
                        <span>{data.status === Status.active ? 'Hoạt động' : 'Ngưng hoạt động'}</span>
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
                    onClick={async () => {
                        const params = {
                            "name": data.name,
                            "bounds": data.condinates,
                            "land_type_id": data.land_type_id,
                            "status": data.status,
                        }

                        const res = await LandingMapApi.createLandTypeChange(params);
                        if (res.Status) {
                            toast.success(res.Message);
                            onCancel && onCancel()
                        }
                        else {
                            toast.error(res.Message);
                        }
                    }}
                />
            </div>
        </div>
    )
})