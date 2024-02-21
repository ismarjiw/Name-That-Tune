import {Component, OnInit} from '@angular/core';
import { LocalStorageService } from 'ngx-webstorage';

@Component({
    selector: 'app-game',
    templateUrl: './game.component.html',
    styleUrls: ['./game.component.css'],
})
export class GameComponent implements OnInit {

    attribute = FormData;
    gameStarted = false;

    constructor(private localSt: LocalStorageService) {
    }

    ngOnInit(): void {
        this.localSt.observe('key').subscribe((value) => console.log('new value', value))
    }

    saveValue() {
        this.localSt.store('gameConfig', this.attribute)
        console.log('Saved form data to local storage');
    }

    clearValue() {
        this.localSt.clear('gameConfig')
    }

    handleFormData(formData: any) {
        this.attribute = formData; 
        this.saveValue();
        console.log('Received form data:', this.attribute);
    }

    startGame() {
        this.gameStarted = true;
        console.log('Game started!')
    }

}
