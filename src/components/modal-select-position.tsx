import { observer } from 'mobx-react'
import React, { useRef, useState } from 'react'
import { MapContainer, Marker, TileLayer, useMapEvents } from 'react-leaflet'
import { useCoreStores } from 'src/core/stores'
import { ModalBase } from './modal/modal-base'

interface IProps {
    onConfirm: (lat: number, lng: number) => void
    onCancel: () => void
    onOpen: (ref) => void
}

const SelectPositionMap = ({ setLocation }: { setLocation: (loc: { lat: number, lng: number }) => void }) => {
    useMapEvents({
        click(e) {
            setLocation({ lat: e.latlng.lat, lng: e.latlng.lng })
        },
    })
    return null
}

export const ModalSelectPosition = observer(({ onConfirm, onCancel }: IProps) => {
    const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null)
    const modalRef = useRef<any>(null)
    const { location: locationStore } = useCoreStores().sessionStore

    const handleConfirm = () => {
        if (location) {
            onConfirm(location.lat, location.lng)
            modalRef.current?.close()
        }
    }

    const handleCancel = () => {
        onCancel()
        modalRef.current?.close()
    }

    return (
        <ModalBase ref={modalRef}>
            <div className="flex flex-col gap-4">
                <div className="h-[52px] flex items-center p-3">
                    <span className='text-md'>Chọn vị trí trên bản đồ</span>
                </div>
                <div className="h-">
                    <MapContainer
                        center={[locationStore.lat, locationStore.lng]} // Mặc định: Hồ Chí Minh
                        zoom={13}
                        style={{ height: "100%", width: "100%" }}
                    >
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <SelectPositionMap setLocation={setLocation} />
                        {location && (
                            <Marker
                                position={[location.lat, location.lng]}
                            />
                        )}
                    </MapContainer>
                </div>
                <div className="flex justify-end gap-2 h-[52px]">
                    {/* <button className="px-4 py-2 bg-gray-300 rounded" onClick={handleCancel}>Hủy</button>
                    <button className="px-4 py-2 bg-blue-500 text-white rounded" onClick={handleConfirm}>Xác nhận</button> */}
                </div>
            </div>
        </ModalBase>
    )
})
