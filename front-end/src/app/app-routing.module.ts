import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { RegComponent } from './reg/reg.component';
import { AuthComponent } from './auth/auth.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from './auth.guard'
import { PostComponent } from './post/post.component';
import { AdminGuard } from './admin.guard';
import { AdminComponent } from './admin/admin.component';
import { EditPostComponent } from './edit-post/edit-post.component';
import { ProfileComponent } from './profile/profile.component';
import { AboutComponent } from './about/about.component';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'reg', component: RegComponent},
  {path: 'auth', component: AuthComponent},
  {path: 'post/:id', component: PostComponent},
  {path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard]},
   { path: 'admin', component: AdminComponent, canActivate: [AdminGuard] },

   { path: 'edit-post/:id', component: EditPostComponent },
   { path: 'profile', component: ProfileComponent },
    { path: 'about', component: AboutComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }