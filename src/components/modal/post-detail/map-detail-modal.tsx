import { Modal } from "antd";
import { observer } from "mobx-react";
import { useEffect } from "react";
import { LayersControl, MapContainer, Pane, TileLayer, useMap } from "react-leaflet";
import { ButtonLoading } from "src/components/Button";
import { IconBase } from "src/components/icon-base";
import { baseUrl } from "src/core/config";
import { LandingPlanModel } from "src/core/models";

interface PostDetailModalProps {
    map?: LandingPlanModel;
    visible: boolean;
    onClose: () => void;
}

export const MapDetailModal = ({ map, visible, onClose }: PostDetailModalProps) => {
    if (!map) return null;

    return (
        <Modal
            open={visible}
            footer={null}
            width={800}
            closable={false}
        >
            <div className="w-full h-[600px] bg-white flex-none flex flex-col">
                <div className="relative w-full h-14 px-3 flex-none border-b border-gray-200 flex items-center justify-start">
                    <span className="text-2xl font-semibold text-gray-700">Chi tiết bản đồ</span>
                    <div
                        className="absolute right-3 size-9 text-gray-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-200"
                        onClick={() => {
                            onClose()
                        }}
                    >
                        <IconBase icon='close-outline' size={24} />
                    </div>
                </div>
                <div className="w-full h-full overflow-y-auto flex flex-col p-3">
                    <div className="space-y-6 bg-white w-full h-[600px]">
                        <MapContainer
                            style={{ width: '100%', height: '100%', zIndex: 0 }}
                            center={[map.lat || 0, map.lng || 0]}
                            zoom={14}
                            maxZoom={22}
                            minZoom={8}
                            attributionControl={true}
                        >
                            <MapViewUpdater />

                            <LayersControl>
                                <LayersControl.BaseLayer checked name="Map mặc định">
                                    <TileLayer
                                        url="https://{s}.google.com/vt/lyrs=m@189&gl=cn&x={x}&y={y}&z={z}"
                                        subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
                                        maxZoom={30}
                                        minZoom={0}
                                        maxNativeZoom={21}    // Nhưng chỉ tải tile tới mức 18
                                        attribution="&copy; <a href='https://www.google.com/maps'>Google Maps</a> contributors"
                                    />
                                </LayersControl.BaseLayer>
                                <LayersControl.BaseLayer name="Map vệ tinh">
                                    <TileLayer
                                        url="http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}"
                                        subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
                                        maxZoom={30}
                                        minZoom={0}
                                        maxNativeZoom={21}    // Nhưng chỉ tải tile tới mức 18
                                        attribution="&copy; <a href='https://www.google.com/maps'>Google Maps</a> contributors"
                                    />
                                </LayersControl.BaseLayer>
                            </LayersControl>
                            <Pane name="customOverlayPane" style={{ zIndex: 400 }}>
                                {map && map.folder_path && (
                                    <TileLayer
                                        url={`${baseUrl}/landing-plan/${map.folder_path}/{z}/{x}/{y}.png`}
                                        pane="customOverlayPane"
                                        minZoom={0}
                                        maxZoom={30}
                                        maxNativeZoom={18}
                                        opacity={1}
                                    />
                                )}
                            </Pane>
                        </MapContainer>
                    </div>
                </div>
                <div className="w-full h-14 flex-none px-3 border-t border-gray-200 flex items-center justify-end space-x-2">
                    <ButtonLoading
                        label="Huỷ bỏ"
                        template="ActionBase"
                        className="h-10 w-32 flex items-center justify-center text-xl font-medium"
                        onClick={() => {
                            onClose()
                        }}
                    />
                    {/* <ButtonLoading
                        label={"Câp nhật"}
                        template="ActionBlue"
                        className="h-10 w-32 flex items-center justify-center text-xl font-medium"
                    onClick={async () => {
                        const res = onSubmit && await onSubmit()
                        if (res?.Status) {
                            toast.success(res.Message)
                            onSave()
                            onRefresh()
                            return
                        }
                        toast.error(res?.Message)
                    }}
                    /> */}
                </div>

            </div>
        </Modal>
    );
};



const MapViewUpdater = observer(() => {
    const map = useMap();

    useEffect(() => {

        map.invalidateSize();

    }, [map]);

    return null;
});