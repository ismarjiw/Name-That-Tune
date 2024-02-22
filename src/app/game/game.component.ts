import {Component, OnInit} from '@angular/core';
import { LocalStorageService } from 'ngx-webstorage';
import { SpotifyService } from 'src/services/spotify.service';
import { ButtonComponent } from '../components/button/button.component';

@Component({
    selector: 'app-game',
    templateUrl: './game.component.html',
    styleUrls: ['./game.component.css'],
})
export class GameComponent implements OnInit {

    attribute = FormData;
    gameStarted = false;
    // gameStarted = true; // for working with the game content without tracks saved
    tracks: any[] = [];

    constructor(private localSt: LocalStorageService, private spotifyService: SpotifyService) {
        this.tracks = this.spotifyService.allTracks;
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

    startGame(selectedGenre: String) {
        this.gameStarted = true;
        this.spotifyService.fetchPlaylistByGenre(selectedGenre)
          .subscribe((firstPlaylist) => {
            if (firstPlaylist) {
              this.spotifyService.fetchTracksByPlaylistId(firstPlaylist.id)
                .subscribe((tracks) => {
                  this.tracks = tracks;
                });
            } else {
              console.log('error fetching tracks or empty playlist')
            }
          });
      }
}
