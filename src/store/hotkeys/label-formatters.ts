import {Translations} from "../language/helpers";

export enum LabelFormatter {
    ChangeFunction = 'ChangeFunction'
}

export const labelFormatters: {
    [formatter: string]: (t, label, data) => string
} = {
    [LabelFormatter.ChangeFunction]: (t, label, data): string => {
        return t(label, data) + ' | ' + Translations.cfName(t)(data.data0);
    }
};