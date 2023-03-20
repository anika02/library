import {api, LightningElement} from 'lwc';
import lib from '@salesforce/resourceUrl/lib';

export default class UiSvg extends LightningElement {

    @api icon;
    @api className = 'h-4 w-4';
    @api stroke;
    @api fill;
    @api viewBox = "0 0 24 24";

    get iconPath() {
        return `${lib}/icons.svg#${this.icon}`;
    }
}