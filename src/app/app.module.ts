import {NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

import {AppComponent} from "./app.component";
import {HomeComponent} from "./home/home.component";
import {ConfigurationComponent} from './configuration/configuration.component';
import {GameComponent} from './game/game.component';
import {FAQComponent} from "./faq/faq.component";
import {LeaderboardComponent} from './leaderboard/leaderboard.component';
import {NavbarComponent} from "./components/navbar/navbar.component";
import {AppRoutingModule} from './app-routing.module';
import {ButtonComponent} from "./components/button/button.component";
import { NgxWebstorageModule } from "ngx-webstorage";

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        ConfigurationComponent,
        GameComponent,
        LeaderboardComponent,
        NavbarComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        AppRoutingModule,
        FAQComponent,
        ButtonComponent,
        NgxWebstorageModule.forRoot(),
        ReactiveFormsModule
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {
}
