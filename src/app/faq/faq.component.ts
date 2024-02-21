import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

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
    { question: "How do I play?", answer: "To play 'Name That Tune', from the configuration screen you'll type your name, select how many rounds you want to play, set your difficulty (easy, medium, or hard), and what genre of music you would like to listen to.", showAnswer: false },
    { question: "Where does the music play from?", answer: "From Spotify's API", showAnswer: false }
];

toggleAnswer(question: FAQ) {
  question.showAnswer = !question.showAnswer;
}

}
