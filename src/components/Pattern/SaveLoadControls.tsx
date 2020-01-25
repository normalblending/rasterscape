import * as React from "react";
import {File} from "../_shared/File";
import {Button} from "../_shared/Button";
import {ButtonSelect} from "../_shared/ButtonSelect";
import {ImportParams} from "../../store/patterns/import/types";

export interface SaveLoadControlsProps {
    patternId: string
    loading: ImportParams

    onLoad(image)

    onSave()
    onParamsChange(params: ImportParams)
}

export interface SaveLoadControlsState {

}

export class SaveLoadControls extends React.PureComponent<SaveLoadControlsProps, SaveLoadControlsState> {

    handleLoad = (image) => {
        this.props.onLoad(image);
    };

    handleSave = () => {
        this.props.onSave();
    };

    handleFitChange = (data) => {
        const {selected, loading} = data;
        this.props.onParamsChange({
            ...loading,
            fit: !selected
        });
    };


    render() {
        const { patternId } = this.props;
        return (
            <div>
                <File
                    name={patternId + '-fileInput'}
                    onChange={this.handleLoad}>load</File>
                <Button onClick={this.handleSave}>save</Button>
                <ButtonSelect
                    selected={this.props.loading.fit}
                    onClick={this.handleFitChange}>fit</ButtonSelect>
            </div>
        );
    }
}