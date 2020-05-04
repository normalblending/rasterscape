import * as React from "react";
import {ButtonNumberCF} from "../../_shared/buttons/ButtonNumberCF";
import "../../../styles/sis2ChangeFunction.scss";
import {ValueD} from "../../_shared/buttons/ButtonNumber";
import {HelpTooltip} from "../../tutorial/HelpTooltip";
import {FxyType} from "../../../store/changeFunctions/functions/fxy";
import {Sis2} from "../../_shared/canvases/WebWorkerCanvas";
import {xySis2} from "../../../store/changeFunctions/functions/_helpers";

export interface Sis2CFProps {
    tutorial: boolean
    params: any

    name: string

    onChange(value?: any, name?: string)

}

export interface Sis2CFState {

}

const range = {
    end: [0, 1] as [number, number],
    XA: [-10, 10] as [number, number],
    h: [-600, 600] as [number, number],
    cosA: [0, 200] as [number, number],
    xN: [0, 600] as [number, number],
    xD: [1, 600] as [number, number],
    yN: [0, 600] as [number, number],
    yD: [1, 600] as [number, number],
    xdd: [-600, 600] as [number, number],
    ydd: [-600, 600] as [number, number],
};
const pres = {
    end: 2,
    XA: 2,
    h: 0,
    cosA: 0,
    xN: 0,
    xD: 0,
    yN: 0,
    yD: 0,
    xdd: 0,
    ydd: 0,
};
const valueD = {
    end: 50,
    XA: 20,
    h: 0.5,
    cosA: 0.5,
    xN: 0.5,
    xD: 0.5,
    yN: 0.5,
    yD: 0.5,
    xdd: 0.5,
    ydd: 0.5,
};

export class Sis2CF extends React.PureComponent<Sis2CFProps, Sis2CFState> {

    handleParamChange = ({value, name}) => {

        const params = {
            ...this.props.params,
            [name]: value,
        };
        let map = [];

        const f = xySis2(params);
        for (let y = 0; y < 300; y++) {
            map[y] = [];
            for (let x = 0; x < 300; x ++) {
                map[y][x] = f(x, y)/300;
            }
        }

        params.map = map;

        this.props.onChange(params, this.props.name)
    };


    buttonWrapper = (message) => {
        const {tutorial} = this.props;
        return tutorial ? button => (
            <HelpTooltip
                secondaryMessage={message !== 'kz' && <span>z = kx⋅x² + ky⋅y² + dz</span>}
                message={message}>{button}</HelpTooltip>) : null
    };

    leftCol = ['xN', 'yN', 'xdd'];
    rightCol = ['XA', 'h', 'cosA', 'xD', 'yD', 'ydd'];

    render() {
        const {params, name} = this.props;


        return (
            <div className={"sis2-change-function"}>

                <div className={'sis2-controls'}>
                    <div className={'canvas-container'}>
                        <Sis2
                            params={params}
                            width={68}
                            height={58}/>
                    </div>
                    {this.leftCol.map(key => {
                        return (
                            <ButtonNumberCF
                                buttonWrapper={this.buttonWrapper(key)}
                                value={params[key]}
                                name={key}
                                range={range[key]}
                                pres={pres[key]}
                                valueD={valueD[key]}
                                path={`changeFunctions.functions.${name}.params.typeParams.${FxyType.Sis2}.${key}`}
                                onChange={this.handleParamChange}
                            />
                        );
                    })}
                </div>
                <div className={'sis2-controls'}>
                    {this.rightCol.map(key => {
                        return (
                            <ButtonNumberCF
                                buttonWrapper={this.buttonWrapper(key)}
                                value={params[key]}
                                name={key}
                                range={range[key]}
                                pres={pres[key]}
                                valueD={valueD[key]}
                                path={`changeFunctions.functions.${name}.params.typeParams.${FxyType.Sis2}.${key}`}
                                onChange={this.handleParamChange}
                            />
                        );
                    })}

                    <ButtonNumberCF
                        buttonWrapper={this.buttonWrapper('kz')}
                        value={params.end}
                        name={'end'}
                        range={range.end}
                        pres={pres.end}
                        valueD={valueD.end}
                        path={`changeFunctions.functions.${name}.params.typeParams.${FxyType.Sis2}.end`}
                        onChange={this.handleParamChange}
                    />
                </div>
            </div>
        );
    }
}