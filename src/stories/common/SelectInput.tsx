import { ReInputRendererProps, ReInput } from '../../lib';

function SelectInputRenderer(props: ReInputRendererProps) {
    // Props
    const { value, errors, onChange, onBlur } = props;

    // Methods
    const _onChange: React.ChangeEventHandler<HTMLSelectElement> = e => onChange(e.target.value);

    // Render
    return (
        <div>
            <select value={value} onBlur={onBlur} onChange={_onChange}>
                <option value='Unkown'>No selection</option>
                <option value='IT'>Italy</option>
                <option value='FR'>France</option>
                <option value='DE'>Germany</option>
            </select>
            <ul>{errors?.map(e => <li key={e.code}>{e.message}</li>)}</ul>
        </div>
    );
}

type SelectInputProps = {
    label: string;
    property: string;
};

function SelectInput(props: SelectInputProps) {
    // Render
    return (
        <>
            <p>{props.label}</p>
            <ReInput property={props.property} renderer={SelectInputRenderer} />
        </>
    );
}

export default SelectInput;
