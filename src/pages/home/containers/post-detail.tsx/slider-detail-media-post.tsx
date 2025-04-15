import { observer } from "mobx-react"
import { useEffect, useMemo, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Colors } from "src/assets"
import { ButtonIcon } from "src/components/button-icon"
import { usePostDetailContext } from "src/core/modules/post"

export const SliderDetailMediaPost = observer(() => {
    const { data, zoom, setZoom } = usePostDetailContext()
    const [x, setX] = useState<number>(0)
    const [widthContainer, setWidthContainer] = useState<number>(0)
    const navigate = useNavigate()
    const containerRef = useRef<any>(null)

    const handleNext = () => {
        if (x >= (data?.image_links?.length ?? 0) + (data?.video_links?.length ?? 0)-1) {
            setX(0)
            return
        }
        setX(x + 1)
    }

    const handlePrev = () => {
        if (x <= 0) {
            setX((data?.image_links?.length ?? 0) + (data?.video_links?.length ?? 0) - 1)
            return
        }
        setX(x - 1)
    }

    useEffect(() => {
        if (!containerRef.current) return
        const observer = new ResizeObserver(entries => {
            for (let entry of entries) {
                setWidthContainer(entry.contentRect.width)
            }
        })
        observer.observe(containerRef.current)
        return () => observer.disconnect()
    }, [containerRef])
    return (
        <div className="relative w-full h-full flex items-center justify-start bg-black overflow-x-hidden" ref={containerRef}>

            <div className="h-full flex flex-nowrap"
                style={{
                    transform: `translateX(${-x * widthContainer}px)`
                }}
            >
                {
                    data?.image_links && data.image_links.length > 0 &&
                    data.image_links.map((item, index) => {
                        return (
                            <div className="w-full h-full flex-none flex items-center justify-center" key={index}
                                style={{
                                    width: widthContainer,
                                }}
                            >
                                <img key={index} src={'http://localhost:3000/uploads/1743271793930-228510595-avt.jpg'} alt="" className="h-full object-contain" />
                            </div>
                        )
                    })
                }
                {
                    data?.video_links && data.video_links.length > 0 &&
                    data.video_links.map((item, index) => {
                        return (
                            <div className="w-full h-full flex-none flex items-center justify-center" key={index}
                                style={{
                                    width: widthContainer,
                                }}
                            >
                                <video key={index} src={'http://localhost:3000/uploads/1743793873811-37283651-demo.mov'} className="h-full object-contain" controls />
                            </div>
                        )
                    })
                }
            </div>
            <div className="w-full flex items-center justify-between p-3 absolute top-0 left-0 right-0">
                <div className="flex items-center space-x-3">
                    <ButtonIcon icon="close-outline" iconSize="24" color={Colors.gray[500]} onClick={() => {
                        navigate(-1)
                    }}
                    />
                    <img src="/images/logo-landing-plan.png" alt="" className="size-14 object-contain flex-none" />
                </div>
                <ButtonIcon icon={zoom ? 'zoomin-outline' : 'zoomout-outline'} iconSize="24" color={Colors.gray[500]} onClick={() => {
                    setZoom(!zoom)
                }}
                />
            </div>
            <div className="w-full flex items-center justify-between px-6 absolute top-1/2 left-0 right-0 -translate-y-1/2">
                <ButtonIcon icon={'arrowleft'} iconSize="24" color={Colors.gray[400]} onClick={() => {
                    handlePrev()
                }}
                    className="bg-gray-200 hover:bg-gray-300"
                />
                <ButtonIcon icon={'arrowright'} iconSize="24" color={Colors.gray[400]} onClick={() => {
                    handleNext()
                }}
                    className="bg-gray-200 hover:bg-gray-300"
                />
            </div>
        </div>
    )
}
)