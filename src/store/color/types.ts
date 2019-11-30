import {Action} from "redux";
import {ParamConfig} from "../../components/_shared/Params";

export interface ChangeColorAction extends Action {
    color: string
}
