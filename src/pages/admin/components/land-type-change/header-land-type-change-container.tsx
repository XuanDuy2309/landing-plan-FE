import { observer } from 'mobx-react';
import { Collapse } from 'react-collapse';
import { useNavigate } from 'react-router-dom';
import { ButtonLoading } from 'src/components';
import { useLandTypeChangeContext } from 'src/core/modules';
import { CreateLandTypeChangeContainer } from '../../containers/land-type-change/create-land-type-change-container';

export const HeaderLandTypeChangeContainer = observer(() => {
    const { isCreate, setCreate, itemUpdate } = useLandTypeChangeContext()
    const navigate = useNavigate()
    return (
        <div className='w-full flex flex-col flex-none'>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Quản lý khu vực chuyển dổi</h1>
                {!isCreate && <ButtonLoading
                    label="Thêm mới"
                    iconLeft="add-outline"
                    size="xs"
                    template="ActionBlue"
                    onClick={() => {
                        navigate('/')
                    }}
                />}
            </div>

            <Collapse isOpened={isCreate}>
                <CreateLandTypeChangeContainer />
            </Collapse>
        </div>
    )
})
