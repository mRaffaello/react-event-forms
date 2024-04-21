import { ReInputRendererProps, ReInput } from '../../lib';

function TextInputRenderer(props: ReInputRendererProps) {
    // Props
    const { value, errors, onChange, onBlur } = props;

    // Methods
    const _onChange: React.ChangeEventHandler<HTMLInputElement> = e => onChange(e.target.value);

    // Render
    return (
        <div>
            <input value={value} onChange={_onChange} onBlur={onBlur} />
            <ul>{errors?.map(e => <li key={e.code}>{e.message}</li>)}</ul>
        </div>
    );
}

type TextInputProps = {
    label: string;
    property: string;
};

function TextInput(props: TextInputProps) {
    // Render
    return (
        <>
            <p>{props.label}</p>
            <ReInput property={props.property} renderer={TextInputRenderer} />
        </>
    );
}

export default TextInput;
