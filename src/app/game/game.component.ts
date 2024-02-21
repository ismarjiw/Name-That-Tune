import {Component, OnInit} from '@angular/core';
import { LocalStorageService } from 'ngx-webstorage';

@Component({
    selector: 'app-game',
    templateUrl: './game.component.html',
    styleUrls: ['./game.component.css'],
})
export class GameComponent implements OnInit {

    attribute = 'i love to code'

    constructor(private localSt: LocalStorageService) {
    }

    ngOnInit(): void {
        this.localSt.observe('key').subscribe((value) => console.log('new value', value))
    }

    saveValue() {
        this.localSt.store('randomMessage', this.attribute)
    }

    clearValue() {
        this.localSt.clear('randomMessage')
    }

}
