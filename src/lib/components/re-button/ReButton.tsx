import { useFormIsValid } from '../../hooks';

export type ReButtonRendererProps = {
    isFormValid: boolean;
};

type ReButtonProps = {
    renderer: (props: ReButtonRendererProps) => JSX.Element;
};

export function ReButton(props: ReButtonProps) {
    // Hooks
    const isFormValid = useFormIsValid();

    // Render
    return <props.renderer isFormValid={isFormValid} />;
}
