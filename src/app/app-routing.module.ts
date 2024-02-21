import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from './home/home.component';
import {GameComponent} from "./game/game.component";
import {FAQComponent} from "./faq/faq.component";
import {LeaderboardComponent} from "./leaderboard/leaderboard.component";

const routes: Routes = [
    {path: "", component: HomeComponent},
    {path: "game", component: GameComponent},
    {path: "faq", component: FAQComponent},
    {path: "leaderboard", component: LeaderboardComponent},
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
