import {CommonModule} from '@angular/common';
import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Router} from "@angular/router";

@Component({
    selector: 'app-button',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './button.component.html',
    styleUrl: './button.component.css'
})
export class ButtonComponent {
    @Input() routerLink?: string;
    @Input() scrollTarget?: HTMLElement;
    @Output() buttonClick = new EventEmitter<void>();

    isButtonClicked = false;

    // this can be removed or modified

    constructor(private router: Router) {
    }

    handleClick(): void {
        // If there's a scrollTarget defined, scroll to it
        if (this.scrollTarget) {
            this.scrollTarget.scrollIntoView({behavior: 'smooth'});
        } else if (this.routerLink) {
            // Navigate and then handle the promise
            this.router.navigate([this.routerLink]).then(() => {
            }).catch((error) => {
                console.error('Navigation error:', error);
            });
        } else {
            // Emit an event if no specific action is provided
            this.buttonClick.emit();
        }
    }

    // this can be removed or modified 
    toggleButtonState() {
        this.isButtonClicked = !this.isButtonClicked;
    }

}