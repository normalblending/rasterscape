import {ChangeFunctionState} from "../changeFunctions/types";

export const Translations = {
    cf: t => (cf: ChangeFunctionState) => {
        return t('cf.hotkeysDescription.type.' + cf?.type) + cf?.number + t(`cf.types.${cf?.type}${cf?.params?.['type'] ? ('.' + cf?.params?.['type']) : ''}`)
    },
    cfName: t => (cf: ChangeFunctionState) => {
        return t('cf.hotkeysDescription.type.' + cf?.type) + cf?.number;
    }
};