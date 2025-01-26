import { PanelModel } from '../models/PanelModel';
import { MainView } from '../views/MainView';
import { PanelView } from '../views/PanelView';

export class PanelController {
    private panelModel: PanelModel;
    private panelView: PanelView;

    constructor(panelModel: PanelModel, panelView: PanelView) {
        this.panelModel = panelModel;
        this.panelView = panelView;
    }

    // Keep original functionality
    public handleSpinButton(): void {
        if (!MainView.getInstance.isSpinning()) {
            this.panelView.emit('spinButtonClicked');
        }
    }

    public getModel(): PanelModel {
        return this.panelModel;
    }
}