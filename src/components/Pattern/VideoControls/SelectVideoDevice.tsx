import * as React from "react";
import {useCallback, useEffect, useState} from "react";
import {SelectDrop} from "bbuutoonnss";

export interface SelectVideoDeviceProps {
    value?: string;
    onSelect?: (value: MediaDeviceInfo) => void
}

const getVideoDevices = (): Promise<MediaDeviceInfo[]> => {
    return new Promise<MediaDeviceInfo[]>((resolve, reject) => {
        navigator.mediaDevices
            .enumerateDevices()
            .then((deviceInfos: MediaDeviceInfo[]) => {

                resolve(deviceInfos.filter((device) => device.kind === "videoinput"))
            })
            .catch((error) => {
                reject(error);
            })
    });
};

export const SelectVideoDevice: React.FC<SelectVideoDeviceProps> = (props) => {

    const {onSelect, value} = props;

    const [devices, setDevices] = useState<MediaDeviceInfo[]>();

    const getDevices = useCallback(async () => {
        const devices = await getVideoDevices();
        setDevices(devices);
        onSelect(devices[0]);
    }, [onSelect]);

    useEffect(() => {
        getDevices();
    }, []);

    const handleSelectDevice = useCallback((data) => {
        onSelect?.(data.value ? data.item : null);
    }, [onSelect]);

    return (
        <>
            <SelectDrop
                value={value}
                nullAble
                nullText={'-'}
                items={devices || []}
                getValue={(device: MediaDeviceInfo) => device.deviceId}
                getText={(device: MediaDeviceInfo) => device.label}
                onChange={handleSelectDevice}
            />
        </>
    );
};
