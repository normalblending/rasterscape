import {enumToSelectItems} from "../../utils/utils";

export enum ECompositeOperation {
    SourceOver = "source-over",
    DestinationOut = "destination-out",
    SourceAtop = "source-atop",
    // SourceIn = "source-in",
    // SourceOut = "source-out",
    DestinationOver = "destination-over",
    // DestinationAtop = "destination-atop",
    // DestinationIn = "destination-in",
    Lighter = "lighter", // светлее
    // Copy = "copy",
    Xor = "xor",
    multiply = "multiply",
    screen = "screen",
    overlay = "overlay",
    darken = "darken",
    lighten = "lighten",
    colorDodge = "color-dodge", //
    colorBurn = "color-burn", //
    hardLight = "hard-light",// жесткий свет
    softLight = "soft-light", // мягкий свет
    difference = "difference", // разница
    exclusion = "exclusion", // вычитание
    hue = "hue", //
    saturation = "saturation", //насыщенность
    color = "color", // цвет
    luminosity = "luminosity", // свечение
}

export const CompositeOperationShortName = {
    [ECompositeOperation.SourceOver]: "normal",
    [ECompositeOperation.SourceAtop]: "src-atop",
    // SourceIn = "source-in",
    // SourceOut = "source-out",
    [ECompositeOperation.DestinationOver]: "dest-over",
    // DestinationAtop = "destination-atop",
    // DestinationIn = "destination-in",
    [ECompositeOperation.DestinationOut]: "eraser",
    [ECompositeOperation.Lighter]: "lighter",
    // Copy = "copy",
    [ECompositeOperation.Xor]: "xor",
    [ECompositeOperation.multiply]: "multiply",
    [ECompositeOperation.screen]: "screen",
    [ECompositeOperation.overlay]: "overlay",
    [ECompositeOperation.darken]: "darken",
    [ECompositeOperation.lighten]: "lighten",
    [ECompositeOperation.colorDodge]: "dodge",
    [ECompositeOperation.colorBurn]: "burn",
    [ECompositeOperation.hardLight]: "hard",
    [ECompositeOperation.softLight]: "soft",
    [ECompositeOperation.difference]: "difference",
    [ECompositeOperation.exclusion]: "exclusion",
    [ECompositeOperation.hue]: "hue",
    [ECompositeOperation.saturation]: "saturation",
    [ECompositeOperation.color]: "color",
    [ECompositeOperation.luminosity]: "luminosity",
};

export const compositeOperationSelectItems = enumToSelectItems(ECompositeOperation, v => v, v => CompositeOperationShortName[v]);
