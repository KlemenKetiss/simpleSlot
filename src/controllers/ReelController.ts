import { ReelModel } from '../models/ReelModel';
import { ReelView } from '../views/ReelView';

export class ReelController {
    private reelModel: ReelModel;
    private reelView: ReelView;

    constructor(reelModel: ReelModel, reelView: ReelView) {
        this.reelModel = reelModel;
        this.reelView = reelView;
    }

    public spin(): void {
        this.reelView.spin();
    }

    public getReelModel(): ReelModel {
        return this.reelModel;
    }
}
