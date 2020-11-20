import {ChangeFunction} from "../changeFunctions/types";

export const Translations = {
    cf: t => (cf: ChangeFunction) => {
        return t('cf.hotkeysDescription.type.' + cf?.type) + cf?.number + t(`cf.types.${cf?.type}${cf?.params?.type ? ('.' + cf?.params?.type) : ''}`)
    },
    cfName: t => (cf: ChangeFunction) => {
        return t('cf.hotkeysDescription.type.' + cf?.type) + cf?.number;
    }
};