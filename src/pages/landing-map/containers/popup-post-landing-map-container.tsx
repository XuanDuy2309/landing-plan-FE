import { observer } from 'mobx-react';
import { memo } from 'react';
import { ButtonLoading } from 'src/components';
import { formatMoney } from 'src/core/base';
import { PostModel } from 'src/core/models';

interface IProps {
    item: PostModel
    onCancel?: () => void
    onConfirm?: (value: PostModel) => void
}


export const PopupPostLandingMapContainer = memo(observer((props: IProps) => {
    const onCancel = (e) => {
        close();
        props.onCancel && props.onCancel();
        e.stopPropagation();
    };

    const onConfirm = (e) => {
        close();
        props.onConfirm && props.onConfirm(props.item);
        e.stopPropagation();
    };
    return (
        <div className="w-full h-full flex flex-col">
            <div className="flex flex-col gap-1">
                <img src={props.item.image_links[0]} className='w-full h-[200px] object-cover' />
                <div className="flex flex-col gap-1 p-2">
                    <span className="font-medium text-[16px] line-clamp-2 overflow-hidden text-gray-900 leading-[20px]">
                        {props.item.title}
                    </span>
                    <span>Diện tích: <strong >{props.item.area} m²</strong> - {formatMoney(Number(props.item?.price_for_buy), 1, 'vn')}</span>
                </div>
            </div>

            <div className="w-full h-[52px] flex-none px-3 border-t border-gray-200 flex items-center justify-end space-x-2">
                <ButtonLoading
                    label="Huỷ bỏ"
                    template="ActionBase"
                    className="!h-8 w-[100px] flex items-center justify-center text-[14px] leading-[16px] font-medium"
                    onClick={(e) => {
                        onCancel(e)
                        close()
                    }}
                />
                <ButtonLoading
                    label="Chỉ đường"
                    template="ActionBlue"
                    className="!h-8 w-[100px] flex items-center justify-center text-[14px] leading-[16px] font-medium"
                    onClick={(e) => {
                        onConfirm(e)
                        close()
                    }}
                />
            </div>
        </div>
    )
}
))
