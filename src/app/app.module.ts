import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";
import { RouterModule, Routes } from "@angular/router";

import { AppComponent } from "./app.component";
import { HomeComponent } from "./home/home.component";
import { ConfigurationComponent } from './configuration/configuration.component';
import { GameComponent } from './game/game.component';
import { FAQComponent } from "./faq/faq.component";
import { LeaderboardComponent } from './leaderboard/leaderboard.component';


const routes: Routes = [
  { path: "", component: HomeComponent },
  { path: "game", component: GameComponent },
  { path: "faq", component: FAQComponent }
];

@NgModule({
  declarations: [AppComponent, HomeComponent, ConfigurationComponent, GameComponent, LeaderboardComponent],
  imports: [BrowserModule, FormsModule, RouterModule.forRoot(routes)],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
