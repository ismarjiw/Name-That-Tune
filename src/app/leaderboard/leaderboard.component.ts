import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-leaderboard',
    templateUrl: './leaderboard.component.html',
    styleUrls: ['./leaderboard.component.css']
})
export class LeaderboardComponent implements OnInit {

    leaderboardData = [
        {
            playerName: "Top Player",
            score: 12345,
            difficulty: "Hard",
            rounds: 10,
            genre: "Rock",
        },
        {
            playerName: "Awesome Ace",
            score: 10000,
            difficulty: "Medium",
            rounds: 8,
            genre: "Pop",
        },
        {
            playerName: "Newbie Ninja",
            score: 8500,
            difficulty: "Easy",
            rounds: 5,
            genre: "Classical",
        },
        {
            playerName: "Quick Clicker",
            score: 9800,
            difficulty: "Medium",
            rounds: 7,
            genre: "Electronic",
        },
        {
            playerName: "Chill Gamer",
            score: 7200,
            difficulty: "Easy",
            rounds: 6,
            genre: "Jazz",
        },
    ];

    constructor() {
    }

    ngOnInit(): void {
    }

}
