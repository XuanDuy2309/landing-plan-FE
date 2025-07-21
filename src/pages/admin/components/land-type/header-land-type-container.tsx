import { observer } from 'mobx-react';
import { Collapse } from 'react-collapse';
import { ButtonLoading } from 'src/components';
import { useListLandTypeContext } from 'src/core/modules';
import { CreateLandTypeContainer } from '../../containers/land-type/create-land-type-container';

export const HeaderLandTypeContainer = observer(() => {
    const { isCreate, setCreate } = useListLandTypeContext()
    return (
        <div className='w-full flex flex-col flex-none'>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Quản lý loại đất</h1>
                {!isCreate && <ButtonLoading
                    label="Thêm loại đất"
                    iconLeft="add-outline"
                    size="xs"
                    template="ActionBlue"
                    onClick={() => {
                        setCreate(true);
                    }}
                />}
            </div>

            <Collapse isOpened={isCreate}>
                <CreateLandTypeContainer />
            </Collapse>
        </div>
    )
})
