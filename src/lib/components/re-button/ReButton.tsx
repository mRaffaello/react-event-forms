import { useFormIsValid } from '../../hooks';

export type ReButtonRendererProps = {
    formId: string;
    isFormValid: boolean;
};

export type ReButtonProps = {
    formId: string;
    renderer: (props: ReButtonRendererProps) => JSX.Element;
};

export function ReButton(props: ReButtonProps) {
    // Hooks
    const isFormValid = useFormIsValid();

    // Render
    return <props.renderer formId={props.formId} isFormValid={isFormValid} />;
}
