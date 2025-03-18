import classNames from 'classnames';
import { InputEditing } from './input-editing';

interface IProps {
    type?: 'password';
    label: string;
    size?: 'large' | 'medium';
    placeholder: string;
    value?: string;
    error?: string;
    onChange: (value?: string) => void;
    disabled?: boolean;
    labelClassName?: string;
}

export const InputLabel = (props: IProps) => {

    return (
        <div className='w-full flex flex-row space-x-2 items-center'>
            <div className={'w-[130px] flex-none flex flex-row justify-end ' + props.labelClassName}>
                <span className={classNames({ 'text-llg font-medium': props.size == 'large' })}>{props.label}:</span>
            </div>
            <div className='w-full'>

                <input
                    className={classNames(
                        'font-normal outline-none',
                        { 'text-llg font-medium': props.size == 'large' },
                        { 'text-gray-500 font-normal': !props.value }
                    )}
                    value={props.value}
                    placeholder={props.placeholder}
                    autoFocus={!props.value ? true : false}
                    onChange={(e) => { props.onChange(e.target.value) }}
                    onBlur={() => { }}
                    disabled={props.disabled}
                />
                <div className='flex flex-col space-y-1'>
                    {props.error && <span className=' font-normal text-lsm text-red-300'>{props.error}</span>}
                </div>
            </div>
        </div>
    );
};
