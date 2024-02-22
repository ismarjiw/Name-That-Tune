import {Component, OnInit} from '@angular/core';

@Component({
    selector: 'app-leaderboard',
    templateUrl: './leaderboard.component.html',
    styleUrls: ['./leaderboard.component.css']
})
export class LeaderboardComponent implements OnInit {

    leaderboardData: any[] = [];

    constructor() {
    }

    ngOnInit(): void {
        // Retrieve all keys from localStorage
        const keys = Object.keys(localStorage);
      
        // Filter keys that start with 'gameData-'
        const gameDataKeys = keys.filter(key => key.startsWith('ngx-webstorage|gamedata-'));
      
        // Retrieve gameData objects from localStorage and populate leaderboardData
        this.leaderboardData = gameDataKeys.map(key => {
          const gameData = JSON.parse(localStorage.getItem(key) || '{}');
          return gameData;
        });

        // Sort leaderboardData by score in descending order
        this.leaderboardData.sort((a, b) => b.score - a.score); 
      }

}
