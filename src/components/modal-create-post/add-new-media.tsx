import { observer } from "mobx-react"
import { useCreatePostContext } from "src/core/modules"
import { ItemImageCreate } from "./item-image-create"
import { ButtonLoading } from "../Button"
import { AuthApi } from "src/core/api"
import { SelectFileCase } from "src/core/services"
import { Colors } from "src/assets"
import { IconBase } from "../icon-base"
import { PostModel } from "src/core/models"
import { ItemVideoCreate } from "./item-video-create-post"
import { SpaceContext } from "antd/es/space"

interface IProps {
    type?: string
    label?: string
    data: string[]
    err?: string
    onChange: (newData: string[]) => void
}

export const AddNewMedia = observer(({ type, label, data, err, onChange }: IProps) => {

    const onUpload = async (files: File[], type?: string) => {
        const form = new FormData();
        for (let i = 0; i < files.length; i++) {
            form.append('files', files[i], files[i].name);
        }
        form.append('type', type ? type : 'image');
        const res = await AuthApi.upload(form);
        if (res.Status) {
            onChange([...data, ...res.Data.data])
            return
        }
        console.log(res.Message)
    }

    const handleUpload = async (type: string) => {
        const input = new SelectFileCase(type, true);

        await input.process()
            .then(res => {
                if (res.length > 0) {
                    onUpload(res, type)
                }
            })
            .catch(err => console.log(err));
    }
    return (
        <div className="w-full px-3 flex flex-col items-start space-y-1">
            <span className="text-xl font-medium text-gray-900">
                {label}:
            </span>
            <div className="w-full grid-cols-5 grid gap-1">
                {type === 'image' ?
                    (data.length > 0 ?
                        data.map((item, index) => {
                            return (
                                <ItemImageCreate key={index} item={item} onRemove={() => {
                                    onChange(data.filter((i) => i !== item))
                                }} />
                            )
                        })
                        :
                        <ButtonLoading
                            label={label}
                            template="ActionBlueNoBorder"
                            size="xs"
                            iconLeft="upload-outline"
                            onClick={() => {
                                handleUpload('image')
                            }} />)
                    :
                    (
                        data.length > 0 ?
                            data.map((item, index) => {
                                return (
                                    <ItemVideoCreate key={index} item={item} onRemove={() => {
                                        onChange(data.filter((i) => i !== item))
                                    }} />
                                )
                            })
                            :
                            <ButtonLoading
                                label={label}
                                template="ActionBlueNoBorder"
                                size="xs"
                                iconLeft="upload-outline"
                                onClick={() => {
                                    handleUpload('video')
                                }} />
                    )
                }
                {
                    data.length > 0 &&
                    <div className="size-full flex items-center rounded justify-center cursor-pointer bg-gray-300 hover:bg-gray-200"
                        onClick={() => {
                            handleUpload(type || 'image')
                        }}
                    >
                        <IconBase icon="add-outline" size={24} color={Colors.white} />
                    </div>
                }
            </div>
            {err &&
                <span className="text-sm text-red-400">{err}</span>
            }
        </div>
    )
})