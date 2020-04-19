import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { PostListComponent } from "./posts/post-list/post-list.component";
import { PostCreateComponent } from "./posts/post-create/post-create.component";
import { AuthGuard } from "./auth/auth.guard";
import { ProfileComponent } from './posts/profile/profile.component';

const routes: Routes = [
  { path: "", component: PostListComponent },
  { path: "home", component: PostListComponent },
  { path: "create", component: PostCreateComponent, canActivate: [AuthGuard] },
  { path: "edit/:postId", component: PostCreateComponent, canActivate: [AuthGuard] },
  { path: "profile", component: ProfileComponent, canActivate: [AuthGuard] },
  { path: "auth", loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule {}
