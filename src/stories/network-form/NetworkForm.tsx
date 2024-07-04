import { z } from 'zod';
import { ReFormEffect, useForm } from '../../lib';
import { ButtonRenderer } from '../common/ButtonRenderer';
import { TextInputRenderer } from '../common/TextInputRenderers';
import { CheckboxRenderer } from '../common/CheckboxInputRenderer';

const zEmptyIpToUndefined = (mesage: string) =>
    z.preprocess(arg => {
        if (typeof arg === 'string' && arg === '') {
            return undefined;
        } else {
            return arg;
        }
    }, z.string().ip(mesage).optional());

const EthernetFormSchema = z
    .object({
        ip: zEmptyIpToUndefined('Invalid ip'),
        subnet: zEmptyIpToUndefined('Invalid subnet'),
        gateway: zEmptyIpToUndefined('Invalid gateway'),
        dhcp: z.boolean()
    })
    .superRefine((data, ctx) => {
        if (!data.dhcp) {
            if (!data.ip) {
                ctx.addIssue({
                    code: 'custom',
                    path: ['ip'],
                    message: 'Field required when DHCP is false'
                });
            }
            if (!data.subnet) {
                ctx.addIssue({
                    code: 'custom',
                    path: ['subnet'],
                    message: 'Field required when DHCP is false'
                });
            }
            if (!data.gateway) {
                ctx.addIssue({
                    code: 'custom',
                    path: ['gateway'],
                    message: 'Field required when DHCP is false'
                });
            }
        }
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

    // Methods
    const setFormValue = () =>
        form.setFormValue({
            ...defaultValue,
            ip: '192.168.1.1.1'
        });

    // Render
    return (
        <>
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
            <button data-testid='set-form-button' onClick={setFormValue}>
                Set form value
            </button>
        </>
    );
}
