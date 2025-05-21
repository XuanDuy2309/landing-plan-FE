import { observer } from "mobx-react";
import moment from "moment";
import { useMemo } from "react";
import { CartesianGrid, Legend, Line, LineChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
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

            <ResponsiveContainer width="100%" height={600}>
                <LineChart data={dataChart} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        dataKey="create_at"
                        tickFormatter={(value) => moment(value, "YYYY/MM/DD HH:mm").format("DD/MM")}
                        padding={{ left: 10, right: 10 }}
                    />
                    <YAxis type="number" domain={['auto', 'auto']} width={80} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend verticalAlign="bottom" height={36} />

                    {/* Nhiều đường */}
                    <Line
                        type="monotone"
                        dataKey="price"
                        stroke="#8884d8"
                        activeDot={{ r: 6 }}
                        animationDuration={1000}
                        dot={false}
                    />
                    <ReferenceLine
                        y={500000000000}
                        stroke="red"
                        strokeDasharray="5 5"
                        label={{ position: 'left', fill: 'red' }}
                    />
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