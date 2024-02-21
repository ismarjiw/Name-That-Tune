import { Component, OnInit } from '@angular/core';
import { TOKEN_KEY } from '../home/home.component';
import { of } from 'rxjs';
import { catchError, mergeMap, tap } from 'rxjs/operators';

import { SpotifyService } from '../../services/spotify.service';

@Component({
    selector: 'app-configuration',
    templateUrl: './configuration.component.html',
    styleUrls: ['./configuration.component.css'],
})
export class ConfigurationComponent implements OnInit {

    genres: String[] = ["House", "Alternative", "J-Rock", "R&B"];
    selectedGenre: String = "";
    authLoading: boolean = false;
    configLoading: boolean = false;
    // token: String = "";
    // categoryId: String = '';
    // genreCategoryMapping: { [genre: string]: string } = {};
    firstPlaylist: any;
    firstPlaylistId: String = '';
    // tracks: any[] = [];

    constructor(private spotifyService: SpotifyService) {}

    ngOnInit(): void {
      this.authLoading = true;
      const storedTokenString = localStorage.getItem(TOKEN_KEY);
  
      const tokenObservable = storedTokenString
          ? of(JSON.parse(storedTokenString))
          : this.spotifyService.fetchTokenFromAWS();
  
      tokenObservable
          .pipe(
              mergeMap((token) => {
                  if (token.expiration > Date.now()) {
                      this.spotifyService.setToken(token.value);
                      return this.spotifyService.loadGenres();
                  } else {
                      return this.spotifyService.fetchTokenFromAWS().pipe(
                          mergeMap((newToken) => {
                              localStorage.setItem(TOKEN_KEY, JSON.stringify(newToken));
                              this.spotifyService.setToken(newToken.value);
                              return this.spotifyService.loadGenres();
                          })
                      );
                  }
              }),
              tap(() => (this.authLoading = false)),
              catchError((error) => {
                  console.error('Error fetching token:', error);
                  this.authLoading = false;
                  return of(null);
              })
          )
          .subscribe((genres) => {
            this.genres = genres || [];
          });
  }

  setGenre(selectedGenre: string) {
    this.selectedGenre = selectedGenre;
    console.log('Selected genre:', this.selectedGenre);

    this.spotifyService
        .fetchPlaylistByGenre(selectedGenre)
        .subscribe((firstPlaylist) => {
            if (firstPlaylist) {
                this.firstPlaylist = firstPlaylist;
                this.firstPlaylistId = firstPlaylist.id;
                console.log('First playlist name:', this.firstPlaylist.name);
                console.log('Playlist Id:', this.firstPlaylistId);
            } else {
                console.error('Failed to fetch playlist for genre:', selectedGenre);
            }
        });
}

    saveGameConfigOnGameStart() {
      console.log("Save config options to local storage and start game with those preset configurations")
    }
}
