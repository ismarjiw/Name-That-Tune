import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {TOKEN_KEY} from '../home/home.component';
import {of} from 'rxjs';
import {catchError, mergeMap, tap} from 'rxjs/operators';

import {SpotifyService} from '../../services/spotify.service';
import {LocalStorageService} from 'ngx-webstorage';

import {FormBuilder, FormGroup, Validators} from '@angular/forms';

// import { GameComponent } from '../game/game.component';

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
    firstPlaylist: any;
    firstPlaylistId: String = '';

    gameForm: FormGroup;
    @Output() formSubmitted = new EventEmitter<any>();

    constructor(
        private spotifyService: SpotifyService,
        private fb: FormBuilder,
        private localSt: LocalStorageService
    ) {
        this.gameForm = this.fb.group({});
    }

    ngOnInit(): void {
        this.authLoading = true;
        const storedTokenString = this.localSt.retrieve('TOKEN_KEY');
        // const storedTokenString = localStorage.getItem(TOKEN_KEY);

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
                                this.localSt.store('TOKEN_KEY', TOKEN_KEY);
                                // localStorage.setItem(TOKEN_KEY, JSON.stringify(newToken));
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

        this.gameForm = this.fb.group({
            playerName: ['', Validators.required],
            difficulty: ['', Validators.required],
            rounds: ['', [Validators.required, Validators.min(5)]],
            genre: ['', Validators.required]
        });
    }

    setDifficulty(difficulty: string) {
        this.gameForm.patchValue({difficulty});
    }

    setRounds(rounds: number) {
        this.gameForm.patchValue({rounds});
    }

    setGenre(selectedGenre: string) {
        this.selectedGenre = selectedGenre;

        if (selectedGenre) {
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
    }

    onSubmit() {
        if (this.gameForm.valid && this.selectedGenre) {
            // Create a game configuration object
            const gameConfig = {
                playerName: this.gameForm.value.playerName,
                difficulty: this.gameForm.value.difficulty,
                rounds: this.gameForm.value.rounds,
                genre: this.selectedGenre,
            };

            // Save the game configuration to local storage
            this.localSt.store('gameConfig', gameConfig);

            // Emit an event to notify the parent component that the game should start
            this.formSubmitted.emit();

        } else {
            console.error('Form is not valid or genre not selected:', this.gameForm.value);
        }
        // const formData = this.gameForm.value;
        // this.formSubmitted.emit(formData);
        //
        // if (this.selectedGenre) {
        //   this.gameComponent.startGame(this.selectedGenre); // Pass genre for track fetching
        // } else {
        //   console.error('Cannot start game without genre!');
        // }
        // need to figure out a way to prevent early submit events with reactive forms after a user selects difficulty or number of rounds
    }
}