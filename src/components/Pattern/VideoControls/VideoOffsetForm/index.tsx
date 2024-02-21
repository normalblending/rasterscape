import React, {useCallback, useMemo, useState} from 'react'
import {useDrag} from 'bbuutoonnss'
import {createVector, Vector, vectorMul, vectorsAdd} from '../../../../utils/vector'
import {createVector3D, Vector3D, vector3DMul, vectors3DAdd} from '../../../../utils/vector3d'
import {
    CameraAxis,
    VideoOffset,
} from '../../../../store/patterns/_service/patternServices/PatternVideoService/ShaderVideoModule/types'
import {SelectDrop} from "../../../_shared/buttons/complex/SelectDrop";
import {HoverHideable} from "../../../_shared/HoverHideable/HoverHideable";
import './styles.scss';
import {ButtonNumberCF} from "../../../_shared/buttons/hotkeyed/ButtonNumberCF";
import {VideoParams} from "../../../../store/patterns/video/types";
import cn from 'classnames'

export interface VideoOffsetFormProps {
    patternId: string
    value: VideoOffset
    params: VideoParams
    cameraAxis: CameraAxis
    onChange: (name: string, value: number) => void
    onCameraAxisChange: (value: CameraAxis) => void
}

const width = 210
const height = width + 4

const o: Vector = {x: width / 2, y: height - 2}

const i: Vector = {x: 1, y: -0.5}
const j: Vector = {x: 0, y: -1}
const k: Vector = {x: -1, y: -0.5}

const scale = (width - 4) / 2


const toSvgCoord = (v: Vector3D): Vector => {
    return vectorsAdd(o,
        vectorMul(i, scale * v.x),
        vectorMul(j, scale * v.y),
        vectorMul(k, scale * v.z))
}

const Line = (props: { v1, v2 } & React.SVGProps<SVGLineElement>) => {
    const {v1, v2, ...rest} = props
    const V1: Vector = toSvgCoord(v1)
    const V2: Vector = toSvgCoord(v2)
    return (
        <line
            x1={V1.x}
            y1={V1.y}
            x2={V2.x}
            y2={V2.y}
            strokeWidth={1}
            stroke={'black'}
            pointerEvents={'none'}
            {...rest}
        />
    )
}

const Shape = (props: { vs } & React.SVGProps<SVGPathElement>) => {
    const {vs, ...rest} = props
    const d = useMemo(() => {
        return vs.reduce((res, v, index) => {
            const V: Vector = toSvgCoord(v)
            if (!index) {
                return res + `M ${V.x}, ${V.y} `
            } else {
                return res + `L ${V.x}, ${V.y} `
            }
        }, '') + 'Z'
    }, [vs])
    return (
        <path
            d={d}
            strokeWidth={1}
            stroke={'black'}
            pointerEvents={'none'}
            {...rest}
        />
    )
}

const g0 = {x: 0, y: 0, z: 0}
const g1 = {x: 0, y: 0, z: 1}
const g2 = {x: 0, y: 1, z: 0}
const g3 = {x: 0, y: 1, z: 1}
const g4 = {x: 1, y: 0, z: 0}
const g5 = {x: 1, y: 0, z: 1}
const g6 = {x: 1, y: 1, z: 0}
const g7 = {x: 1, y: 1, z: 1}
//
const cameraAxisGetValue = id => id

const percentRange = [0, 1] as [number, number]

export const VideoOffsetForm = (props: VideoOffsetFormProps) => {

    const {value, onChange, cameraAxis, onCameraAxisChange, patternId} = props
    const {x0, x1, y0, y1, z0, z1} = value
    const x0m = Math.min(value.x0, value.x1)
    const x1m = Math.max(value.x0, value.x1)

    const y0m = Math.min(value.y0, value.y1)
    const y1m = Math.max(value.y0, value.y1)

    const z0m = Math.min(value.z0, value.z1)
    const z1m = Math.max(value.z0, value.z1)


    // const x0m = value.x0
    // const x1m = value.x1
    //
    // const y0m = value.y0
    // const y1m = value.y1
    //
    // const z0m = value.z0
    // const z1m = value.z1

    const c0m = useMemo(() => createVector3D(x0m, y0m, z0m), [value])
    const c1m = useMemo(() => createVector3D(x0m, y0m, z1m), [value])
    const c2m = useMemo(() => createVector3D(x0m, y1m, z0m), [value])
    const c3m = useMemo(() => createVector3D(x0m, y1m, z1m), [value])
    const c4m = useMemo(() => createVector3D(x1m, y0m, z0m), [value])
    const c5m = useMemo(() => createVector3D(x1m, y0m, z1m), [value])
    const c6m = useMemo(() => createVector3D(x1m, y1m, z0m), [value])
    const c7m = useMemo(() => createVector3D(x1m, y1m, z1m), [value])

    const c0 = useMemo(() => createVector3D(x0, y0, z0), [value])
    const c1 = useMemo(() => createVector3D(x0, y0, z1), [value])
    const c2 = useMemo(() => createVector3D(x0, y1, z0), [value])
    const c3 = useMemo(() => createVector3D(x0, y1, z1), [value])
    const c4 = useMemo(() => createVector3D(x1, y0, z0), [value])
    const c5 = useMemo(() => createVector3D(x1, y0, z1), [value])
    const c6 = useMemo(() => createVector3D(x1, y1, z0), [value])
    const c7 = useMemo(() => createVector3D(x1, y1, z1), [value])

    const x0Y0Z0 = useMemo(() => createVector3D(x0, 0, 0), [value])
    const x0mY0Z0 = useMemo(() => createVector3D(x0m, 0, 0), [value])
    const x0Y0Z1 = useMemo(() => createVector3D(x0, 0, 1), [value])
    const x0Y1Z0 = useMemo(() => createVector3D(x0, 1, 0), [value])
    const x0Y1Z1 = useMemo(() => createVector3D(x0, 1, 1), [value])
    const x0mY1Z1 = useMemo(() => createVector3D(x0m, 1, 1), [value])
    const x1Y0Z0 = useMemo(() => createVector3D(x1, 0, 0), [value])
    const x1mY0Z0 = useMemo(() => createVector3D(x1m, 0, 0), [value])
    const x1Y0Z1 = useMemo(() => createVector3D(x1, 0, 1), [value])
    const x1Y1Z0 = useMemo(() => createVector3D(x1, 1, 0), [value])
    const x1Y1Z1 = useMemo(() => createVector3D(x1, 1, 1), [value])
    const x1mY1Z1 = useMemo(() => createVector3D(x1m, 1, 1), [value])

    const y0X0Z0 = useMemo(() => createVector3D(0, y0, 0), [value])
    const y0mX0Z0 = useMemo(() => createVector3D(0, y0m, 0), [value])
    const y0X0Z1 = useMemo(() => createVector3D(0, y0, 1), [value])
    const y0mX0Z1 = useMemo(() => createVector3D(0, y0m, 1), [value])
    const y0X1Z0 = useMemo(() => createVector3D(1, y0, 0), [value])
    const y0mX1Z0 = useMemo(() => createVector3D(1, y0m, 0), [value])
    const y0X1Z1 = useMemo(() => createVector3D(1, y0, 1), [value])
    const y0mX1Z1 = useMemo(() => createVector3D(1, y0m, 1), [value])
    const y1X0Z0 = useMemo(() => createVector3D(0, y1, 0), [value])
    const y1mX0Z0 = useMemo(() => createVector3D(0, y1m, 0), [value])
    const y1X0Z1 = useMemo(() => createVector3D(0, y1, 1), [value])
    const y1mX0Z1 = useMemo(() => createVector3D(0, y1m, 1), [value])
    const y1X1Z0 = useMemo(() => createVector3D(1, y1, 0), [value])
    const y1X1Z1 = useMemo(() => createVector3D(1, y1, 1), [value])

    const z0X0Y0 = useMemo(() => createVector3D(0, 0, z0), [value])
    const z0mX0Y0 = useMemo(() => createVector3D(0, 0, z0m), [value])
    const z0X0Y1 = useMemo(() => createVector3D(0, 1, z0), [value])
    const z0X1Y0 = useMemo(() => createVector3D(1, 0, z0), [value])
    const z0X1Y1 = useMemo(() => createVector3D(1, 1, z0), [value])
    const z0mX1Y1 = useMemo(() => createVector3D(1, 1, z0m), [value])
    const z1X0Y0 = useMemo(() => createVector3D(0, 0, z1), [value])
    const z1mX0Y0 = useMemo(() => createVector3D(0, 0, z1m), [value])
    const z1X0Y1 = useMemo(() => createVector3D(0, 1, z1), [value])
    const z1X1Y0 = useMemo(() => createVector3D(1, 0, z1), [value])
    const z1X1Y1 = useMemo(() => createVector3D(1, 1, z1), [value])
    const z1mX1Y1 = useMemo(() => createVector3D(1, 1, z1m), [value])


    const x0y0Z0 = useMemo(() => createVector3D(x0, y0, 0), [value])
    const x0y1Z0 = useMemo(() => createVector3D(x0, y1, 0), [value])
    const x0my1mz0m = useMemo(() => createVector3D(x0m, y1m, z0m), [value])
    const x1y0Z0 = useMemo(() => createVector3D(x1, y0, 0), [value])
    const x1y1Z0 = useMemo(() => createVector3D(x1, y1, 0), [value])
    const x1my1mz0m = useMemo(() => createVector3D(x1m, y1m, z0m), [value])

    const x0my0mZ0 = useMemo(() => createVector3D(x0m, y0m, 0), [value])
    const x0my1mZ0 = useMemo(() => createVector3D(x0m, y1m, 0), [value])
    const x1my0mZ0 = useMemo(() => createVector3D(x1m, y0m, 0), [value])
    const x1my1mZ0 = useMemo(() => createVector3D(x1m, y1m, 0), [value])

    const x0my0mZ1 = useMemo(() => createVector3D(x0m, y0m, 1), [value])
    const x1my0mZ1 = useMemo(() => createVector3D(x1m, y0m, 1), [value])
    const y0mz0mX1 = useMemo(() => createVector3D(1, y0m, z0m), [value])
    const y0mz1mX1 = useMemo(() => createVector3D(1, y0m, z1m), [value])

    const z0y0X0 = useMemo(() => createVector3D(0, y0, z0), [value])
    const z0y1X0 = useMemo(() => createVector3D(0, y1, z0), [value])
    const z0my1mx0m = useMemo(() => createVector3D(x0m, y1m, z0m), [value])
    const z1y0X0 = useMemo(() => createVector3D(0, y0, z1), [value])
    const z1y1X0 = useMemo(() => createVector3D(0, y1, z1), [value])
    const z1my1mx0m = useMemo(() => createVector3D(x0m, y1m, z1m), [value])

    const z0my0mX0 = useMemo(() => createVector3D(0, y0m, z0m), [value])
    const z0my1mX0 = useMemo(() => createVector3D(0, y1m, z0m), [value])
    const z1my0mX0 = useMemo(() => createVector3D(0, y0m, z1m), [value])
    const z1my1mX0 = useMemo(() => createVector3D(0, y1m, z1m), [value])

    const z0my0mX1 = useMemo(() => createVector3D(1, y0m, z0m), [value])
    const z1my0mX1 = useMemo(() => createVector3D(1, y0m, z1m), [value])


    const x0y0Z1 = useMemo(() => createVector3D(x0, y0, 1), [value])
    const x0y1Z1 = useMemo(() => createVector3D(x0, y1, 1), [value])
    const x0my1mZ1 = useMemo(() => createVector3D(x0m, y1m, 1), [value])
    const x1y0Z1 = useMemo(() => createVector3D(x1, y0, 1), [value])
    const x1y1Z1 = useMemo(() => createVector3D(x1, y1, 1), [value])
    const x1my1mZ1 = useMemo(() => createVector3D(x1m, y1m, 1), [value])

    const z0y0X1 = useMemo(() => createVector3D(1, y0, z0), [value])
    const z0y1X1 = useMemo(() => createVector3D(1, y1, z0), [value])
    const z0my1mX1 = useMemo(() => createVector3D(1, y1m, z0m), [value])
    const z1y0X1 = useMemo(() => createVector3D(1, y0, z1), [value])
    const z1y1X1 = useMemo(() => createVector3D(1, y1, z1), [value])
    const z1my1mX1 = useMemo(() => createVector3D(1, y1m, z1m), [value])

    const x0z0Y0 = useMemo(() => createVector3D(x0, 0, z0), [value])
    const x0z1Y0 = useMemo(() => createVector3D(x0, 0, z1), [value])
    const x1z0Y0 = useMemo(() => createVector3D(x1, 0, z0), [value])
    const x1z1Y0 = useMemo(() => createVector3D(x1, 0, z1), [value])

    const x0z0Y1 = useMemo(() => createVector3D(x0, 1, z0), [value])
    const x0z1Y1 = useMemo(() => createVector3D(x0, 1, z1), [value])
    const x1z0Y1 = useMemo(() => createVector3D(x1, 1, z0), [value])
    const x1z1Y1 = useMemo(() => createVector3D(x1, 1, z1), [value])


    const [current, setCurrent] = useState(null)

    const handlerChangeYR = useCallback((vec: Vector) => {
        const val = vectorsAdd(createVector(0, 0), vectorMul(j, -1 * vec.y), vectorMul(i, -1 * vec.x))
        onChange(current, Math.max(0, Math.min(1, val.y)))
    }, [current, onChange])


    const handlerChangeYL = useCallback((vec: Vector) => {
        const val = vectorsAdd(createVector(0, 0), vectorMul(j, -1 * vec.y), vectorMul(k, vec.x))
        onChange(current, Math.max(0, Math.min(1, val.y)))
    }, [current, onChange])


    const handlerChangeX = useCallback((vec: Vector) => {
        const val = vectorsAdd(createVector(0, 0), vectorMul(i, vec.x))
        onChange(current, Math.max(0, Math.min(1, val.x)))
    }, [current, onChange])

    const handlerChangeZ = useCallback((vec: Vector) => {
        const val = vectorsAdd(createVector(0, 0), vectorMul(k, -vec.x))
        onChange(current, Math.max(0, Math.min(1, val.x)))
    }, [current, onChange])

    const [yrChanging, startChangeYR] = useDrag(handlerChangeYR, -scale)
    const [ylChanging, startChangeYL] = useDrag(handlerChangeYL, -scale)
    const [xChanging, startChangeX] = useDrag(handlerChangeX, scale)
    const [zChanging, startChangeZ] = useDrag(handlerChangeZ, -scale)

    const handlerDownYR = useCallback((name) => (e) => {
        setCurrent(name)
        startChangeYR(e, createVector(0, value[name]))
    }, [value, startChangeYR])

    const handlerDownYL = useCallback((name) => (e) => {
        setCurrent(name)
        startChangeYL(e, createVector(0, value[name]))
    }, [value, startChangeYL])

    const handlerDownX = useCallback((name) => (e) => {
        setCurrent(name)
        startChangeX(e, createVector(value[name], 0))
    }, [value, startChangeX])

    const handlerDownZ = useCallback((name) => (e) => {
        setCurrent(name)
        startChangeZ(e, createVector(value[name], 0))
    }, [value, startChangeZ])

    const handlerDownX0 = useMemo(() => handlerDownX('x0'), [handlerDownX])
    const handlerDownX1 = useMemo(() => handlerDownX('x1'), [handlerDownX])
    const handlerDownY0R = useMemo(() => handlerDownYR('y0'), [handlerDownYR])
    const handlerDownY1R = useMemo(() => handlerDownYR('y1'), [handlerDownYR])
    const handlerDownY0L = useMemo(() => handlerDownYL('y0'), [handlerDownYL])
    const handlerDownY1L = useMemo(() => handlerDownYL('y1'), [handlerDownYL])
    const handlerDownZ0 = useMemo(() => handlerDownZ('z0'), [handlerDownZ])
    const handlerDownZ1 = useMemo(() => handlerDownZ('z1'), [handlerDownZ])

    const handleChangeCameraAxis = useCallback(({value}) => {
        onCameraAxisChange(value)
    }, [onCameraAxisChange])

    const handleChangeOffset = useCallback((data) => {
        const {value, name} = data
        onChange(name, value)
    }, [onChange])

    const ZERO = 0
    const THIN = 0.1
    const THINER = 0.2
    const HANDLER = 0.4
    const ONE = 1
    const TRANSP_GREY = 'rgba(0,0,0,0.07)'
    const SLIT_MODE = 'rgba(0,0,0,0)'
    const SLIT_MODE_STROKE = 0.8
    const GREEN = 'green'//'rgb(256,255,0)'//'rgb(0,255, 0)'

    const HANDLR_OFFSET = 0.02
    const TEXT_SIZE = width / 10
    const xColorByCamAxis = {
        [CameraAxis.T]: 'red',
        [CameraAxis.X]: 'blue',
        [CameraAxis.Y]: 'red',
    }
    const yColorByCamAxis = {
        [CameraAxis.T]: GREEN,
        [CameraAxis.X]: GREEN,
        [CameraAxis.Y]: 'blue',
    }
    const tColorByCamAxis = {
        [CameraAxis.T]: 'blue',
        [CameraAxis.X]: 'red',
        [CameraAxis.Y]: GREEN,
    }
    return (
        <div className={'video-offset'}>
            <svg width={width} height={height} style={{
                background: 'radial-gradient(#f6f6f6, transparent)'
            }}>

                <text x={4} y={height - 6}
                      fontSize={TEXT_SIZE}
                      fill={tColorByCamAxis[cameraAxis]}
                      fontFamily={'Times new roman'} fontStyle={'italic'}
                >
                    t
                </text>
                <text x={width - 4} y={height - 6}
                      textAnchor="end"
                      fontSize={TEXT_SIZE}
                      fill={xColorByCamAxis[cameraAxis]}
                      fontFamily={'Times new roman'} fontStyle={'italic'}
                >
                    x
                </text>
                <text x={width - 4} y={4}
                      fill={yColorByCamAxis[cameraAxis]}
                      textAnchor="end"
                      alignmentBaseline={'hanging'}
                      fontSize={TEXT_SIZE} fontFamily={'Times new roman'} fontStyle={'italic'}
                >
                    y
                </text>
                <text x={4} y={4}
                      alignmentBaseline={'hanging'}
                      fill={'blue'}
                      fontSize={TEXT_SIZE} fontFamily={'Times new roman'} fontStyle={'italic'}>
                    {cameraAxis}
                </text>

                {/* GGGGGG */}
                {/*<Line v1={g5} v2={g1} strokeWidth={0.1}/>*/}
                {/*<Line v1={g5} v2={g4} strokeWidth={0.1}/>*/}
                <Line v1={y0mX1Z1} v2={g7} strokeWidth={0.1}/>

                {/*<Line v1={g2} v2={g3} strokeWidth={0.1}/>*/}
                {/*<Line v1={g2} v2={g6} strokeWidth={0.1}/>*/}

                <Line v1={g1} v2={g3} strokeWidth={0.1}/>

                <Line v1={g4} v2={g6} strokeWidth={0.1}/>

                <Line v1={g7} v2={g3} strokeWidth={0.1}/>
                <Line v1={g7} v2={g6} strokeWidth={0.1}/>

                {/*box*/}

                <Shape vs={[c1, c3, c7, c5]}
                       fill={TRANSP_GREY}//fill={cameraAxis === SlitMode.BACK ? SLIT_MODE : TRANSP_GREY}
                       strokeWidth={THIN}
                    //back
                />

                <Shape vs={[c4, c5, c7, c6]}
                       fill={TRANSP_GREY}//fill={cameraAxis === SlitMode.RIGHT ? SLIT_MODE : TRANSP_GREY}
                       strokeWidth={THIN}
                    //left
                />
                <Shape vs={[c0, c1, c5, c4]}
                       fill={TRANSP_GREY}//fill={cameraAxis === SlitMode.BOTTOM ? SLIT_MODE : TRANSP_GREY}
                       strokeWidth={THIN} //bottoom
                />

                <Shape vs={[c0, c1, c3, c2]}
                       fill={TRANSP_GREY}//fill={cameraAxis === SlitMode.LEFT ? SLIT_MODE : TRANSP_GREY}
                       strokeWidth={THIN} //right
                />
                <Shape vs={[c0, c4, c6, c2]}
                       fill={TRANSP_GREY}//fill={cameraAxis === SlitMode.FRONT ? SLIT_MODE : TRANSP_GREY}
                       strokeWidth={THIN} //front
                />
                <Shape vs={[c2, c3, c7, c6]}
                       fill={TRANSP_GREY}//fill={cameraAxis === SlitMode.TOP ? SLIT_MODE : TRANSP_GREY}
                       strokeWidth={THIN} //top
                />

                {/*front grid*/}
                <Line v1={x0mY0Z0} v2={x0my0mZ0} stroke={'black'} strokeWidth={THIN}/>
                <Line v1={x1mY0Z0} v2={x1my0mZ0} stroke={'black'} strokeWidth={THIN}/>
                <Line v1={y0mX0Z0} v2={y0mX1Z0} stroke={'black'} strokeWidth={THIN}/>
                {/*<Line v1={y1X0Z0} v2={y1X1Z0} stroke={'black'} strokeWidth={THIN}/>*/}
                {/*left grid*/}
                <Line v1={z0mX0Y0} v2={z0my0mX0} stroke={'black'} strokeWidth={THIN}/>
                <Line v1={z1mX0Y0} v2={z1my0mX0} stroke={'black'} strokeWidth={THIN}/>
                {/*<Line v1={y1mX0Z1} v2={y1mX0Z0} stroke={'black'} strokeWidth={THIN}/>*/}
                <Line v1={y0mX0Z1} v2={y0mX0Z0} stroke={'black'} strokeWidth={THIN}/>
                {/*/!*back square*!/*/}
                {/*<Line v1={x0y0Z1} v2={x0y1Z1}  stroke={'black'} strokeWidth={THIN}/>*/}
                {/*<Line v1={x1y0Z1} v2={x1y1Z1}  stroke={'black'} strokeWidth={THIN}/>*/}
                {/*<Line v1={x0y0Z1} v2={x1y0Z1} stroke={'black'} strokeWidth={THIN}/>*/}
                {/*<Line v1={x0y1Z1} v2={x1y1Z1} stroke={'black'} strokeWidth={THIN}/>*/}
                {/*back grid*/}
                <Line v1={x0my0mZ1} v2={x0mY1Z1} stroke={'black'} strokeWidth={THIN}/>
                <Line v1={x1my0mZ1} v2={x1mY1Z1} stroke={'black'} strokeWidth={THIN}/>
                <Line v1={y0X0Z1} v2={y0X1Z1} stroke={'black'} strokeWidth={THIN}/>
                <Line v1={y1X0Z1} v2={y1X1Z1} stroke={'black'} strokeWidth={THIN}/>
                {/*right square*/}
                {/*<Line v1={z0y0X1} v2={z0y1X1} stroke={'black'} strokeWidth={THIN}/>*/}
                {/*<Line v1={z1y0X1} v2={z1y1X1} stroke={'black'} strokeWidth={THIN}/>*/}
                {/*<Line v1={z1y1X1} v2={z0y1X1} stroke={'black'} strokeWidth={THIN}/>*/}
                {/*<Line v1={z1y0X1} v2={z0y0X1} stroke={'black'} strokeWidth={THIN}/>*/}
                {/*right grid*/}
                <Line v1={y0mz0mX1} v2={z0mX1Y1} stroke={'black'} strokeWidth={THIN}/>
                <Line v1={y0mz1mX1} v2={z1mX1Y1} stroke={'black'} strokeWidth={THIN}/>
                <Line v1={y0X1Z0} v2={y0X1Z1} stroke={'black'} strokeWidth={THIN}/>
                <Line v1={y1X1Z0} v2={y1X1Z1} stroke={'black'} strokeWidth={THIN}/>
                {/*bottom grid*/}
                {/*<Line v1={z0X0Y0} v2={z0X1Y0} stroke={'black'} strokeWidth={THIN}/>*/}
                {/*<Line v1={z1X0Y0} v2={z1X1Y0} stroke={'black'} strokeWidth={THIN}/>*/}
                {/*<Line v1={x0Y0Z0} v2={x0Y0Z1} stroke={'black'} strokeWidth={THIN}/>*/}
                {/*<Line v1={x1Y0Z0} v2={x1Y0Z1} stroke={'black'} strokeWidth={THIN}/>*/}
                {/*top squarre*/}
                {/*<Line v1={x0z0Y1} v2={x1z0Y1} stroke={'black'} strokeWidth={THIN}/>*/}
                {/*<Line v1={x0z1Y1} v2={x1z1Y1} stroke={'black'} strokeWidth={THIN}/>*/}
                {/*<Line v1={x0z0Y1} v2={x0z1Y1} stroke={'black'} strokeWidth={THIN}/>*/}
                {/*<Line v1={x1z0Y1} v2={x1z1Y1} stroke={'black'} strokeWidth={THIN}/>*/}


                {/*bottom grid*/}
                <Line v1={x0my0mZ0} v2={x0my0mZ1} stroke={'black'} strokeWidth={0.1}/>
                <Line v1={x1my0mZ0} v2={x1my0mZ1} stroke={'black'} strokeWidth={0.1}/>
                <Line v1={z0my0mX0} v2={z0my0mX1} stroke={'black'} strokeWidth={0.1}/>
                <Line v1={z1my0mX0} v2={z1my0mX1} stroke={'black'} strokeWidth={0.1}/>

                {/*top grid*/}
                <Line v1={x0my1mz0m} v2={x0my1mZ1} stroke={'black'} strokeWidth={0.1}/>
                <Line v1={x1my1mz0m} v2={x1my1mZ1} stroke={'black'} strokeWidth={0.1}/>
                <Line v1={z0my1mx0m} v2={z0my1mX1} stroke={'black'} strokeWidth={0.1}/>
                <Line v1={z1my1mx0m} v2={z1my1mX1} stroke={'black'} strokeWidth={0.1}/>


                {/*/!* frront dashes*!/*/}
                {/*<Line v1={x0y0Z0} v2={c0m} stroke={'black'} strokeWidth={0.6} strokeDasharray={'2 2'}/>*/}
                {/*<Line v1={x0y1Z0} v2={c2m} stroke={'black'} strokeWidth={0.6} strokeDasharray={'2 2'}/>*/}
                {/*<Line v1={x1y0Z0} v2={c4m} stroke={'black'} strokeWidth={0.6} strokeDasharray={'2 2'}/>*/}
                {/*<Line v1={x1y1Z0} v2={c6m} stroke={'black'} strokeWidth={0.6} strokeDasharray={'2 2'}/>*/}
                {/*/!* back dashes*!/*/}
                {/*<Line v1={x0y0Z1} v2={c1m} stroke={'black'} strokeWidth={0.6} strokeDasharray={'2 2'}/>*/}
                {/*<Line v1={x0y1Z1} v2={c3m} stroke={'black'} strokeWidth={0.6} strokeDasharray={'2 2'}/>*/}
                {/*<Line v1={x1y0Z1} v2={c5m} stroke={'black'} strokeWidth={0.6} strokeDasharray={'2 2'}/>*/}
                {/*<Line v1={x1y1Z1} v2={c7m} stroke={'black'} strokeWidth={0.6} strokeDasharray={'2 2'}/>*/}


                {/*<Line v1={x0z0Y0} v2={x0z0Y1} stroke={'black'} strokeWidth={0.1}/>*/}
                {/*<Line v1={x0z1Y0} v2={x0z1Y1} stroke={'black'} strokeWidth={0.1}/>*/}
                {/*<Line v1={x1z0Y0} v2={x1z0Y1} stroke={'black'} strokeWidth={0.1}/>*/}
                {/*<Line v1={x1z1Y0} v2={x1z1Y1} stroke={'black'} strokeWidth={0.1}/>*/}


                {cameraAxis === CameraAxis.T && (<>
                    {/* x,y, z */}
                    <Line v1={c0} v2={c4} stroke={'red'} strokeWidth={ONE} pointerEvents={'none'} stroke-linecap="round"/>
                    <Line v1={c0} v2={c2} stroke={GREEN} strokeWidth={ONE} pointerEvents={'none'} stroke-linecap="round"/>
                    <Line v1={c0} v2={c1} stroke={'blue'} strokeWidth={ONE} pointerEvents={'none'} stroke-linecap="round"/>
                </>)}
                {cameraAxis === CameraAxis.X && (<>
                    {/* x,y, z */}
                    <Line v1={c0} v2={c1} stroke={'red'} strokeWidth={ONE} pointerEvents={'none'} stroke-linecap="round"/>
                    <Line v1={c0} v2={c2} stroke={GREEN} strokeWidth={ONE} pointerEvents={'none'} stroke-linecap="round"/>
                    <Line v1={c0} v2={c4} stroke={'blue'} strokeWidth={ONE} pointerEvents={'none'} stroke-linecap="round"/>
                </>)}
                {cameraAxis === CameraAxis.Y && (<>
                    {/* x,y, z */}
                    <Line v1={c0} v2={c4} stroke={'red'} strokeWidth={ONE} pointerEvents={'none'} stroke-linecap="round"/>
                    <Line v1={c0} v2={c1} stroke={GREEN} strokeWidth={ONE} pointerEvents={'none'} stroke-linecap="round"/>
                    <Line v1={c0} v2={c2} stroke={'blue'} strokeWidth={ONE} pointerEvents={'none'} stroke-linecap="round"/>
                </>)}


                {/* x,y, z */}
                <Line v1={g0} v2={vector3DMul(g4, 0.5)} stroke={'red'} strokeWidth={ONE} pointerEvents={'none'} stroke-linecap="round"/>
                <Line v1={g0} v2={vector3DMul(g2, 0.5)} stroke={GREEN} strokeWidth={ONE} pointerEvents={'none'} stroke-linecap="round"/>
                <Line v1={g0} v2={vector3DMul(g1, 0.5)} stroke={'blue'} strokeWidth={ONE} pointerEvents={'none'} stroke-linecap="round"/>


                <Line v1={g0} v2={g4} stroke={'black'} strokeWidth={THIN} pointerEvents={'none'}/>
                {/*<Line v1={g0} v2={g2} stroke={'black'} strokeWidth={THIN} pointerEvents={'none'}/>*/}
                <Line v1={g0} v2={g1} stroke={'black'} strokeWidth={THIN} pointerEvents={'none'}/>
                {/* handlers */}


                <Shape vs={[c0m, c1m, c3m, c2m]}
                       fill={'transparent'}
                       cursor={xChanging ? 'grabbing' : 'grab'}
                       pointerEvents={'all'}
                       strokeWidth={0}
                       onMouseDown={c0.x < c4.x ? handlerDownX0 : handlerDownX1}
                />
                <Shape vs={[c0m, c4m, c6m, c2m]}
                       fill={'transparent'}
                       cursor={zChanging ? 'grabbing' : 'grab'}
                       pointerEvents={'all'}
                       strokeWidth={0}
                       onMouseDown={c0.z < c1.z ? handlerDownZ0 : handlerDownZ1}
                />
                <Shape vs={[c2m, c3m, c7m, c6m]}
                       fill={'transparent'}
                       cursor={yrChanging ? 'grabbing' : 'grab'}
                       pointerEvents={'all'}
                       strokeWidth={0}
                       onMouseDown={c0.y > c2.y ? handlerDownY0R : handlerDownY1R}
                />


                <Line v1={{...c4m, x: c4m.x + HANDLR_OFFSET}} v2={{...c6m, x: c6m.x + HANDLR_OFFSET}}
                      strokeWidth={10}
                      stroke={'transparent'} pointerEvents={'all'}
                      cursor={'ew-resize'}
                      onMouseDown={c0.x < c4.x ? handlerDownX1 : handlerDownX0}/>
                <Line v1={{...c1m, z: c1m.z + HANDLR_OFFSET}} v2={{...c3m, z: c3m.z + HANDLR_OFFSET}}
                      strokeWidth={10} stroke={'transparent'} pointerEvents={'all'}
                      cursor={'ew-resize'}
                      onMouseDown={c0.z < c1.z ? handlerDownZ1 : handlerDownZ0}/>


                <Line v1={c0m} v2={c1m} strokeWidth={10} stroke={'transparent'} pointerEvents={'all'}
                      cursor={'ns-resize'}
                      onMouseDown={c0.y < c2.y ? handlerDownY0L : handlerDownY1L}
                />
                <Line v1={c0m} v2={c4m} strokeWidth={10} stroke={'transparent'} pointerEvents={'all'}
                      cursor={'ns-resize'}
                      onMouseDown={c0.y < c2.y ? handlerDownY0R : handlerDownY1R}
                />

                <Line v1={c2m} v2={c3m} strokeWidth={10} stroke={'transparent'} pointerEvents={'all'}
                      cursor={'ns-resize'}
                      onMouseDown={c0.y > c2.y ? handlerDownY0L : handlerDownY1L}/>
                <Line v1={c2m} v2={c6m} strokeWidth={10} stroke={'transparent'} pointerEvents={'all'}
                      cursor={'ns-resize'}
                      onMouseDown={c0.y > c2.y ? handlerDownY0R : handlerDownY1R}/>


                <Line v1={c7m} v2={c3m} strokeWidth={10} stroke={'transparent'} pointerEvents={'all'}
                      cursor={'ew-resize'}
                      onMouseDown={c0.z > c1.z ? handlerDownZ0 : handlerDownZ1}/>
                <Line v1={c7m} v2={c6m} strokeWidth={10} stroke={'transparent'} pointerEvents={'all'}
                      cursor={'ew-resize'}
                      onMouseDown={c0.x > c4.x ? handlerDownX0 : handlerDownX1}/>

                {/* handlers 2*/}
                {/*<Line v1={y0X0Z1} v2={y0X0Z0} strokeWidth={10} stroke={'transparent'} pointerEvents={'all'}*/}
                {/*      cursor={'ns-resize'}*/}
                {/*      onMouseDown={handlerDownY0L}*/}
                {/*/>*/}
                {/*<Line v1={y0X0Z0} v2={y0X1Z0} strokeWidth={10} stroke={'transparent'} pointerEvents={'all'}*/}
                {/*      cursor={'ns-resize'}*/}
                {/*      onMouseDown={handlerDownY0R}*/}
                {/*/>*/}

                {/*<Line v1={y1X0Z1} v2={y1X0Z0} strokeWidth={10} stroke={'transparent'} pointerEvents={'all'}*/}
                {/*      cursor={'ns-resize'}*/}
                {/*      onMouseDown={handlerDownY1L}/>*/}
                {/*<Line v1={y1X0Z0} v2={y1X1Z0} strokeWidth={10} stroke={'transparent'} pointerEvents={'all'}*/}
                {/*      cursor={'ns-resize'}*/}
                {/*      onMouseDown={handlerDownY1R}/>*/}


                {/*<Line v1={{ ...x0Y0Z0, x: Math.max(x0Y0Z0.x, 0.1) }} v2={{ ...x0Y1Z0, x: Math.max(x0Y1Z0.x, 0.1) }}*/}
                {/*      strokeWidth={10}*/}
                {/*      stroke={'transparent'}*/}
                {/*      pointerEvents={'all'}*/}
                {/*      cursor={'ew-resize'} onMouseDown={handlerDownX0}/>*/}
                {/*<Line v1={x1Y0Z0} v2={x1Y1Z0} strokeWidth={10} stroke={'transparent'} pointerEvents={'all'}*/}
                {/*      cursor={'ew-resize'}*/}
                {/*      onMouseDown={handlerDownX1}/>*/}

                {/*<Line v1={{ ...z0X0Y0, z: Math.max(z0X0Y0.z, 0.1) }} v2={{ ...z0X0Y1, z: Math.max(z0X0Y1.z, 0.1) }}*/}
                {/*      strokeWidth={10}*/}
                {/*      stroke={'transparent'}*/}
                {/*      pointerEvents={'all'}*/}
                {/*      cursor={'ew-resize'} onMouseDown={handlerDownZ0}/>*/}
                {/*<Line v1={z1X0Y0} v2={z1X0Y1} strokeWidth={10} stroke={'transparent'} pointerEvents={'all'}*/}
                {/*      cursor={'ew-resize'} onMouseDown={handlerDownZ1}/>*/}
            </svg>

            <HoverHideable
                className={'video-offset_axis-handler'}
                button={''}>
                <SelectDrop
                    path={`pattern.${patternId}.video.cameraAxis`}
                    className={'camera-axis'}
                    hkLabel={'pattern.hotkeysDescription.video.cameraAxis'}
                    hkData1={patternId}
                    getValue={cameraAxisGetValue}
                    getText={cameraAxisGetValue}
                    items={Object.values(CameraAxis)}
                    value={cameraAxis}
                    name={'cameraAxis'}
                    onChange={handleChangeCameraAxis}
                />
            </HoverHideable>
            <HoverHideable
                className={cn('video-offset_x-handler', 'video-offset-' + xColorByCamAxis[cameraAxis])}
                button={''}>
                <ButtonNumberCF
                    hkLabel={'pattern.hotkeysDescription.video.offset.x0'} // !!
                    hkData1={patternId}
                    // withoutCF
                    pres={2}
                    // className={cn('x0', {
                    //     [params.edgeMode]: true,
                    //     [stackTypeClassNames[params.stackType]]: true,
                    // })}
                    path={`patterns.${patternId}.video.params.offset.x0`}
                    name={'x0'}
                    // getText={this.stackSizeText}
                    value={value.x0}
                    range={percentRange}
                    onChange={handleChangeOffset}
                />
                <ButtonNumberCF
                    hkLabel={'pattern.hotkeysDescription.video.offset.x1'} // !!
                    hkData1={patternId}
                    // withoutCF
                    pres={2}
                    // className={cn('x1', {
                    //     [params.edgeMode]: true,
                    //     [stackTypeClassNames[params.stackType]]: true,
                    // })}
                    path={`patterns.${patternId}.video.params.offset.x1`}
                    name={'x1'}
                    // getText={this.stackSizeText}
                    value={value.x1}
                    range={percentRange}
                    onChange={handleChangeOffset}
                />
            </HoverHideable>
            <HoverHideable
                className={cn('video-offset_y-handler', 'video-offset-' + yColorByCamAxis[cameraAxis])}
                button={''}>
                <ButtonNumberCF
                    hkLabel={'pattern.hotkeysDescription.video.offset.y0'} // !!
                    hkData1={patternId}
                    // withoutCF
                    pres={2}
                    // className={cn('y0', {
                    //     [params.edgeMode]: true,
                    //     [stackTypeClassNames[params.stackType]]: true,
                    // })}
                    path={`patterns.${patternId}.video.params.offset.y0`}
                    name={'y0'}
                    // getText={this.stackSizeText}
                    value={value.y0}
                    range={percentRange}
                    onChange={handleChangeOffset}
                />
                <ButtonNumberCF
                    hkLabel={'pattern.hotkeysDescription.video.offset.y1'} // !!
                    hkData1={patternId}
                    // withoutCF
                    pres={2}
                    // className={cn('y1', {
                    //     [params.edgeMode]: true,
                    //     [stackTypeClassNames[params.stackType]]: true,
                    // })}
                    path={`patterns.${patternId}.video.params.offset.y1`}
                    name={'y1'}
                    // getText={this.stackSizeText}
                    value={value.y1}
                    range={percentRange}
                    onChange={handleChangeOffset}
                />

            </HoverHideable>
            <HoverHideable
                className={cn('video-offset_z-handler', 'video-offset-' + tColorByCamAxis[cameraAxis])}
                button={''}>
                <ButtonNumberCF
                    hkLabel={'pattern.hotkeysDescription.video.offset.z0'} // !!
                    hkData1={patternId}
                    // withoutCF
                    pres={2}
                    // className={cn('z0', {
                    //     [params.edgeMode]: true,
                    //     [stackTypeClassNames[params.stackType]]: true,
                    // })}
                    path={`patterns.${patternId}.video.params.offset.z0`}
                    name={'z0'}
                    // getText={this.stackSizeText}
                    value={value.z0}
                    range={percentRange}
                    onChange={handleChangeOffset}
                />

                <ButtonNumberCF
                    hkLabel={'pattern.hotkeysDescription.video.offset.z1'} // !!
                    hkData1={patternId}
                    // withoutCF
                    pres={2}
                    // className={cn('z1', {
                    //     [params.edgeMode]: true,
                    //     [stackTypeClassNames[params.stackType]]: true,
                    // })}
                    path={`patterns.${patternId}.video.params.offset.z1`}
                    name={'z1'}
                    // getText={this.stackSizeText}
                    value={value.z1}
                    range={percentRange}
                    onChange={handleChangeOffset}
                />

            </HoverHideable>

        </div>
    )
}