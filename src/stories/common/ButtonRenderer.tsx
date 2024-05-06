import { ReButtonRendererProps } from '../../lib';

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
            data-testid='submit-button'>
            Save
        </button>
    );
}

export function ButtonRendererWithoutDisable(props: ReButtonRendererProps) {
    // Render
    return (
        <button
            onSubmit={e => e.preventDefault()}
            style={{
                cursor: 'pointer',
                padding: '5px',
                color: props.isFormValid ? 'white' : 'black'
            }}
            data-testid='submit-button'>
            Save
        </button>
    );
}
