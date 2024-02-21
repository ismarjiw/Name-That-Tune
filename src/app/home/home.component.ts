import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from "@angular/core";

export const AUTH_ENDPOINT =
    "https://nuod0t2zoe.execute-api.us-east-2.amazonaws.com/FT-Classroom/spotify-auth-token";
export const TOKEN_KEY = "whos-who-access-token";

@Component({
    selector: "app-home",
    templateUrl: "./home.component.html",
    styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit, AfterViewInit {
    @ViewChild('rulesText') rulesText!: ElementRef<HTMLParagraphElement>;
    observer!: IntersectionObserver;
    showGameButton: boolean = false;
    typingStarted: boolean = false;
    typingCompleted: boolean = false;

    rules: string[] = [
        'Rule 1: Listen to the snippet.',
        'Rule 2: Choose the correct answer from the multiple choices.',
        'Rule 3: No cheating by using external apps to recognize the song!',
    ];
    typedText: string = '';
    typingSpeed: number = 40;

    constructor() {
    }

    ngOnInit() {
    }

    ngAfterViewInit(): void {
        this.observer = new IntersectionObserver((entries) => {
            const entry = entries[0];
            if (entry.isIntersecting && !this.typingStarted) {
                this.typingStarted = true;
                this.typeOutRules(0);
            }
        }, {threshold: 0.1});

        this.observer.observe(this.rulesText.nativeElement);
    }

    private typeOutRules(ruleIndex: number): void {
        if (ruleIndex >= this.rules.length) {
            this.showGameButton = true;
            this.typingCompleted = true;
            this.observer.disconnect();
            return;
        }

        const rule = this.rules[ruleIndex];
        let charIndex = 0;

        const typeInterval = setInterval(() => {
            if (charIndex < rule.length) {
                this.typedText += rule[charIndex];
                this.rulesText.nativeElement.innerHTML = this.typedText;
                charIndex++;
            } else {
                clearInterval(typeInterval);
                this.typedText += '<br/><br/>';
                if (ruleIndex < this.rules.length - 1) {
                    setTimeout(() => this.typeOutRules(ruleIndex + 1), 200);
                } else {
                    this.showGameButton = true;
                    this.typingCompleted = true;
                }
            }
        }, this.typingSpeed);
    }
}
