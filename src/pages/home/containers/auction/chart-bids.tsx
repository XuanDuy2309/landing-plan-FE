import { observer } from "mobx-react"
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatMoney } from "src/core/base";
import { usePostDetailContext } from "src/core/modules/post";


const data = [
    {
        name: "Page A",
        uv: 4000,
        pv: 2400,
        amt: 2400,
    },
    {
        name: "Page B",
        uv: 3000,
        pv: 1398,
        amt: 2210,
    },
    {
        name: "Page C",
        uv: 2000,
        pv: 9800,
        amt: 2290,
    },
    {
        name: "Page D",
        uv: 2780,
        pv: 3908,
        amt: 2000,
    },
    {
        name: "Page E",
        uv: 1890,
        pv: 4800,
        amt: 2181,
    },
    {
        name: "Page F",
        uv: 2390,
        pv: 3800,
        amt: 2500,
    },
    {
        name: "Page G",
        uv: 3490,
        pv: 4300,
        amt: 2100,
    },
];

export const ChartBids = observer(() => {
    const {data} = usePostDetailContext()
    return (
        <div className="w-full h-full">
            <ResponsiveContainer width={"100%"} height={600}>
                <LineChart data={data.bids} margin={{ top: 20 }} accessibilityLayer>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="create_by_name" padding={{ left: 0, right: 10 }} />
                    <YAxis width={100} type="number" domain={['dataMin', 'dataMax']} />
                    <Tooltip content={<CustomTooltip />}/>
                    <Legend />
                    <Line
                        type="monotone"
                        dataKey="price"
                        stroke="#8884d8"
                        activeDot={{ r: 8 }}
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
          <span className="label">{`${label} : ${formatMoney(payload[0].value,1,'vn')} VND`}</span>
        </div>
      );
    }
    return null
}