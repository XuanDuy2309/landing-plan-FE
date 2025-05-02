import { observer } from "mobx-react"
import { useMemo } from "react";
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatMoney } from "src/core/base";
import { usePostDetailContext } from "src/core/modules/post";


export const ChartBids = observer(() => {
    const { data } = usePostDetailContext()
    const dataChart = useMemo(() => {
        if (data.bids.length > 0) {
            return data.bids.slice().sort((a, b) => (a.id ?? 0) - (b.id ?? 0))
        }
        return []
    }, [data.bids.length])
    return (
        <div className="w-full h-full">
            <ResponsiveContainer width={"100%"} height={600}>
                <LineChart data={dataChart} margin={{ top: 20 }} accessibilityLayer>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="create_at" padding={{ left: 0, right: 10 }} />
                    <YAxis width={100} type="number" domain={['dataMin', 'dataMax']} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Line
                        type="monotone"
                        dataKey="price"
                        stroke="#8884d8"
                        activeDot={{ r: 8 }}
                        autoReverse
                    ></Line>
                </LineChart>
            </ResponsiveContainer>
        </div>
    )
})

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-gray-100 px-2 py-1 rounded">
                <span className="label">{`${payload[0].payload.user_name} : ${formatMoney(payload[0].value, 1, 'vn')} VND`}</span>
            </div>
        );
    }
    return null
}