import { ReButtonRendererProps } from '../../lib/components/re-button/ReButton';

export function ButtonRenderer(props: ReButtonRendererProps) {
    // Render
    return (
        <button
            onSubmit={e => e.preventDefault()}
            disabled={!props.isFormValid}
            style={{
                cursor: 'pointer',
                padding: '5px',
                backgroundColor: props.isFormValid ? 'blue' : 'gray',
                color: props.isFormValid ? 'white' : 'black'
            }}
            data-testid='submit-buttom'>
            Save
        </button>
    );
}
