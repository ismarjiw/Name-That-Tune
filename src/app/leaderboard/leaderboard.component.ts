import { Component, OnInit } from '@angular/core';

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

    // Sort leaderboardData by difficulty (descending), score (descending), then time (ascending)
    this.leaderboardData.sort((a, b) => {
      // Compare difficulties 
      const difficulties = ['hard', 'medium', 'easy'];
      const aIndex = difficulties.indexOf(a.difficulty);
      const bIndex = difficulties.indexOf(b.difficulty);
      if (aIndex !== bIndex) {
        return aIndex - bIndex; // Lower index (higher difficulty) comes first
      }
      // If difficulties are the same, compare scores (descending)
      if (a.score !== b.score) {
        return b.score - a.score;
      }
      // If difficulties and scores are the same, compare times (ascending)
      return a.time - b.time; // Ascending order for faster time
    });
  }

}
