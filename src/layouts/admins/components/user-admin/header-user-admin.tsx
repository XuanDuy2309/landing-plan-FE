import { observer } from 'mobx-react';
import { Collapse } from 'react-collapse';
import { ButtonLoading } from 'src/components';
import { useListUserContext } from 'src/core/modules/user/context';
import { CreateAdminUserContainer } from '../../containers/user-admin/create-admin-user-container';

export const HeaderUserAdmin = observer(() => {
    const { isCreate, setCreate } = useListUserContext()
    return (
        <div className='w-full flex flex-col flex-none'>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Quản lý người dùng</h1>
                <ButtonLoading
                    label="Thêm người dùng"
                    iconLeft="add-outline"
                    size="xs"
                    template="ActionBlue"
                    onClick={() => {
                        setCreate(true);
                    }}
                />
            </div>

            <Collapse isOpened={isCreate}>
                <CreateAdminUserContainer />
            </Collapse>
        </div>
    )
})
