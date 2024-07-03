import { z } from 'zod';
import { ReFormEffect, ReFormTransformValueResult, useForm } from '../../lib';
import { ButtonRenderer } from '../common/ButtonRenderer';
import { TextInputRenderer } from '../common/TextInputRenderers';
import { CheckboxRenderer } from '../common/CheckboxInputRenderer';

const EthernetFormSchema = z.object({
    ip: z.string().ip({ message: 'Invalid ip' }),
    subnet: z.string().ip({ message: 'Invalid subnet mask' }),
    gateway: z.string().ip({ message: 'Invalid gateway' }),
    dhcp: z.boolean()
});

type NetworkFormRequest = z.infer<typeof EthernetFormSchema>;

export const defaultValue = {
    ip: '192.168.100.10',
    subnet: '255.255.255.0',
    gateway: '192.168.100.1',
    dhcp: false
};

class NetworkFormEffect extends ReFormEffect<NetworkFormRequest> {
    shouldActivate(
        updatedKey: string,
        _: any,
        previousValue: NetworkFormRequest,
        nextValue: NetworkFormRequest
    ): boolean {
        return updatedKey === 'dhcp' && previousValue.dhcp !== nextValue.dhcp;
    }

    transformValue(_?: NetworkFormRequest, nextValue?: NetworkFormRequest) {
        const transformedValue = {
            ip: defaultValue.ip,
            subnet: defaultValue.subnet,
            gateway: defaultValue.gateway,
            dhcp: !!nextValue?.dhcp
        } as NetworkFormRequest;

        return {
            value: transformedValue,
            effectedKeys: ['ip', 'subnet', 'gateway']
        };
    }
}

export const networkFormEffect = new NetworkFormEffect();

const effects = [networkFormEffect];

export function NetworkForm(props: {
    effects?: ReFormEffect<NetworkFormRequest>[];
    onSubmit?: (value: NetworkFormRequest) => void;
}) {
    // Hooks
    const form = useForm(EthernetFormSchema, defaultValue);

    // Render
    return (
        <form.context onSubmit={props.onSubmit} effects={props.effects ?? effects}>
            <form.subscribe selector={state => state?.dhcp}>
                {dhcpEnabled => (
                    <>
                        <form.field
                            property='ip'
                            renderer={props => (
                                <TextInputRenderer {...props} disabled={dhcpEnabled} />
                            )}
                        />
                        <form.field
                            property='subnet'
                            renderer={props => (
                                <TextInputRenderer {...props} disabled={dhcpEnabled} />
                            )}
                        />
                        <form.field
                            property='gateway'
                            renderer={props => (
                                <TextInputRenderer {...props} disabled={dhcpEnabled} />
                            )}
                        />
                    </>
                )}
            </form.subscribe>
            <form.field property='dhcp' renderer={CheckboxRenderer} />
            <form.button renderer={ButtonRenderer} />
        </form.context>
    );
}
