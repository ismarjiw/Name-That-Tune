import {CommonModule} from '@angular/common';
import {Component} from '@angular/core';

interface FAQ {
    question: string;
    answer: string;
    showAnswer: boolean;
}

@Component({
    selector: 'app-faq',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './faq.component.html',
    styleUrl: './faq.component.css'
})
export class FAQComponent {
    questions: { question: string, answer: string, showAnswer: boolean }[] = [
        {
            question: "How do I play?",
            answer: "To play 'Name That Tune', from the configuration screen you'll type your name,  select your difficulty, choose how many rounds you want to play, and finally, what genre of music you would like to listen to.",
            showAnswer: false
        },
        {
            question: "Where does the music play from?",
            answer: "Spotify's API",
            showAnswer: false
        },
        {
            question: "What are the different game modes?",
            answer: "You can choose your difficulty from 'Easy', 'Medium', or 'Hard' depending on how many seconds you want to hear a track. For 'Easy', you can listen to the track for 30 seconds, 'Medium' for 15 seconds, or 'Hard' for 5 seconds. From there, you can choose how many rounds you want to play, and finally, you have the option to choose which genre of music you would like to listen to.",
            showAnswer: false
        },
        {
            question: "Can I skip a song?",
            answer: "No :)",
            showAnswer: false
        },
        {
            question: "What information does the game collect about me?",
            answer: "Your player name and score information, which is displayed on the leaderboard page, is saved locally on your computer and is not saved to any outside databases.",
            showAnswer: false
        },
    ];

    toggleAnswer(question: FAQ) {
        question.showAnswer = !question.showAnswer;
    }

}
