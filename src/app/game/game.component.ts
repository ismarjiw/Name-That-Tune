import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {SpotifyService} from 'src/services/spotify.service';
import {Router} from '@angular/router';
import {EMPTY, Subscription, switchMap} from "rxjs";
import {tap} from "rxjs/operators";

import {LocalStorageService} from 'ngx-webstorage';
import { v4 as uuidv4 } from 'uuid';
import { Howl } from 'howler'; 


@Component({
    selector: 'app-game',
    templateUrl: './game.component.html',
    styleUrls: ['./game.component.css'],
})
export class GameComponent implements OnInit {
    gameConfig: any;
    gameStarted: boolean = false;
    tracks: any[] = [];
    currentRound: number = 0;
    rounds: any[] = [];
    roundStarted: boolean = false;
    gameTime: number = 0;
    gameTimer: any;
    currentTrack: any = null; // Will hold the current track object
    currentChoices: string[] = []; // Will hold the choices for the current track
    finalScore: number = 0; // Will hold the final score after the game ends
    gameOver: boolean = false; // Will be set to true when the game ends
    loading: boolean = false; // Will be set to true when the game starts
    showBars: boolean = false;
    isLoadingTracks: boolean = true;

    playDuration: number = 30;
    currentTrackHowl: Howl | null = null; // Store the Howl instance for the current track
    trackTimer: any;

    constructor(
        private spotifyService: SpotifyService,
        private localSt: LocalStorageService,
        private router: Router
    ) {
    }

    ngOnInit(): void {
        this.gameTime = 0;
    }

    initializeGame(gameId: string): void {
        const gameConfigKey = `gameConfig-${gameId}`;
        const configString = this.localSt.retrieve(gameConfigKey);

        if (configString) {
            this.gameConfig = configString;
            this.fetchFirstPlaylist(this.gameConfig.genre);
            this.loading = false;
        } else {
            console.error('Game configuration not found in local storage.');
        }
    }

    fetchFirstPlaylist(genre: string): Subscription {
        return this.spotifyService.fetchPlaylistByGenre(genre)
            .pipe(
                switchMap((firstPlaylist) => {
                    if (!firstPlaylist) {
                        // Handle the case where there is no playlist, e.g., throw an error or return EMPTY
                        console.error('error fetching playlist or playlist is empty');
                        return EMPTY; // EMPTY is an observable that completes immediately
                    }
                    // If we have a playlist, fetch its tracks
                    return this.spotifyService.fetchTracksByPlaylistId(firstPlaylist.id);
                }),
                tap((tracks) => {
                    if (tracks) {
                        // If we have tracks, assign them and prepare for the game
                        this.tracks = tracks;
                        this.prepareRounds();
                        this.loadQuestion();
                        this.isLoadingTracks = false;
                    } else {
                        // Handle the case where no tracks are found
                        console.error('No tracks found for playlist.');
                    }
                })
            )
            .subscribe({
                error: (err) => console.error('An error occurred while fetching playlist:', err)
            });
    }

    prepareRounds(): void {
        const tracksPerRound = Math.ceil(this.tracks.length / this.gameConfig.rounds);
        for (let i = 0; i < this.gameConfig.rounds; i++) {
            this.rounds.push(this.tracks.slice(i * tracksPerRound, (i + 1) * tracksPerRound));
            console.log('Round:', i, this.rounds[i]);
        }
    }

    loadQuestion(): void {
        if (this.currentRound >= this.rounds.length) {
            console.error(`No more rounds available.`);
            return;
        }
        if (this.currentRound < 0 || this.currentRound >= this.rounds.length) {
            console.error(`Invalid round index: ${this.currentRound}`);
            return;
        }
        this.currentTrack = this.rounds[this.currentRound][0].track;
        if (!this.currentTrack) {
            console.error(`No track found for round: ${this.currentRound}`);
            return;
        }
        this.currentChoices = this.generateChoices();
        console.log('Current track:', this.currentTrack);
        console.log('Choices:', this.currentChoices);

        if (this.gameConfig.difficulty === 'Medium') {
            this.playDuration = 15; 
        } else if (this.gameConfig.difficulty === 'Hard') {
            this.playDuration = 5;
        } else { 
            this.playDuration = this.playDuration; 
        }
    }

    generateChoices(): string[] {
        // Get a list of all track names
        const allTrackNames = this.tracks.map(track => track.name);

        // Shuffle the array and pick 3 random choices
        let choices = this.shuffleArray(allTrackNames).slice(0, 3);

        // Add the correct answer to the choices
        choices.push(this.currentTrack.name);

        // Shuffle again to mix the correct answer with the incorrect ones
        choices = this.shuffleArray(choices);
        console.log('Generated choices:', choices);

        return choices;
    }

    playCurrentTrack(): void {
        if (!this.currentTrackHowl) {
            // Create a new Howl instance if it doesn't exist
        this.currentTrackHowl = new Howl({
            src: [this.currentTrack.preview_url],
            format: ['webm', 'mp3'] 
        });
        this.currentTrackHowl.play();
        this.showBars = true;
        }
      }

      pauseCurrentTrack(): void {
            this.currentTrackHowl?.stop();
            this.showBars = false;
      }

    shuffleArray(array: any[]): any[] {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]]; // Swap elements
        }
        return array;
    }

    beginRound(): void {
        if (!this.currentTrack) {
            console.error('No current track set. Cannot begin round.');
            return;
        }
        console.log('Begin round with track:', this.currentTrack.name);
        this.roundStarted = true;
        this.startGameTimer();
        this.loadQuestion();
        setTimeout(() => {
            this.playCurrentTrack();
            setTimeout(() => {
                this.pauseCurrentTrack();
            }, this.playDuration * 1000);
        });
    }

    selectAnswer(trackName: string): void {
        this.pauseCurrentTrack();
        console.log('Selected Answer: ', trackName);
        this.stopGameTimer();
        this.roundStarted = false;
        if (this.isAnswerCorrect(trackName)) {
            this.finalScore += 250; // Increase score for correct answer
        }
        // Move to the next round after a slight delay
        setTimeout(() => {
            this.nextRound();
        }, 1000);
    }

    isAnswerCorrect(answer: string): boolean {
        console.log('isAnswerCorrect:', answer);
        return answer === this.currentTrack.name;
    }

    nextRound(): void {
        console.log('Next Round');
        // Destroy existing howl
  if (this.currentTrackHowl) {
    this.currentTrackHowl.unload();
    this.currentTrackHowl = null; 
  }
        if (this.currentRound < this.gameConfig.rounds - 1) {
            this.currentRound++;
            this.loadQuestion();
        } else {
            this.endGame();
        }
    }

    startGameTimer(): void {
        this.gameTimer = setInterval(() => {
            this.gameTime++;
        }, 1000);
    }

    stopGameTimer(): void {
        clearInterval(this.gameTimer);
        this.gameTimer = null; // Clear the interval ID
    }

    endGame(): void {
        this.stopGameTimer();
        this.pauseCurrentTrack();
        this.gameOver = true;
        const gameData = {
            playerName: this.gameConfig.playerName,
            difficulty: this.gameConfig.difficulty,
            rounds: this.gameConfig.rounds,
            genre: this.gameConfig.genre,
            score: this.finalScore,
            time: this.gameTime
        };
        const gameDataId = uuidv4();
        const gameDataKey = `gameData-${gameDataId}`;
        this.localSt.store(gameDataKey, gameData);
    }

    handleFormSubmitted(event: { gameId: string; config: any }) {
        const { gameId, config } = event;
        this.gameConfig = config;
        this.loading = true;
        this.gameStarted = true;
        this.initializeGame(gameId);
    }
}

