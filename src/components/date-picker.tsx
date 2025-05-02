import { DatePicker } from "antd";
import classNames from "classnames";
import dayjs from 'dayjs';
import moment, { Moment } from "moment";
import { useCallback, useMemo } from "react";
type Enumerate<N extends number, Acc extends number[] = []> = Acc['length'] extends N ? Acc[number] : Enumerate<N, [...Acc, Acc['length']]>;
type IntRange<F extends number, T extends number> = Exclude<Enumerate<T>, Enumerate<F>> | F;

interface IProps {
    value?: Moment;
    onChange?: (value?: Moment) => void;
    disableDate?: 'before' | 'after';
    format: string;
    showIcon?: boolean;
    placeholder?: string;
    showTime?: string;
    className?: string;
    minimumDate?: Moment;
    maximumDate?: Moment;
    inputClassName?: string;
    clearIcon?: boolean;
    disabled?: boolean;
    picker?: 'time' | 'date' | 'week' | 'month' | 'quarter' | 'year';
    disabledHours?: () => number[];
    disabledMinutes?: (value: number) => number[];
    needConfirm?: boolean;
    minuteStep?: IntRange<1, 59>;
}

export const DatePickerAnt = ({
    needConfirm = false,
    picker = 'date',
    clearIcon = false,
    minimumDate,
    maximumDate,
    value,
    onChange,
    showTime,
    disableDate,
    format,
    showIcon = true,
    placeholder,
    inputClassName,
    className,
    disabled = false,
    minuteStep,
}: IProps) => {

    const disabledDate = useCallback((currentDate) => {
        if (!currentDate) return false;
        if (minimumDate && currentDate.isBefore(minimumDate, 'day')) return true;
        if (maximumDate && currentDate.isAfter(maximumDate, 'day')) return true;
        if (disableDate === 'before' && currentDate.isBefore(moment(), 'day')) return true;
        if (disableDate === 'after' && currentDate.isAfter(moment(), 'day')) return true;
        return false;
    }, [minimumDate, maximumDate, disableDate]);

    const handleDatePickerChange = useCallback((date) => {
        if (!date) {
            onChange && onChange(undefined);
        } else {
            onChange && onChange(moment(new Date(date.toString())))
        }
    }, [onChange]);

    const memoizedShowTime = useMemo(() => showTime ? { format: showTime } : undefined, [showTime]);

    const memoizedClassNames = useMemo(() =>
        classNames(`ranger-picker-single rounded-none flex justify-center items-center hover:border-b bg-transparent border-b border-blue-600 ${className}`),
        [className]
    );

    const memoizedValue = useMemo(() => value ? dayjs(value.format("YYYY-MM-DD HH:mm:ss")) : undefined, [value]);

    return (
        <DatePicker
            picker={picker}
            format={format}
            suffixIcon={false}
            showTime={memoizedShowTime}
            placeholder={placeholder}
            allowClear={false}
            minuteStep={minuteStep}
            className={memoizedClassNames}
            value={memoizedValue}
            onChange={handleDatePickerChange}
            disabledDate={disabledDate}
            variant="outlined"
            disabled={disabled}
            style={{height: '20px', background: 'transparent'}}
        />
    );
};
