import { Routes } from '@angular/router';
import { RecipeDetailComponent } from './components/recipe/recipe-detail/recipe-detail.component';
import { RecipeListComponent } from './components/recipe/recipe-list/recipe-list.component';
import {LoginComponent} from './components/user/pages/login/login.component';
import {authGuard, guestGuard} from './guards/auth/auth.guard';
import {SignupComponent} from './components/user/pages/signup/signup.component';
import {DashboardComponent} from './components/user/pages/dashboard/dashboard.component';


export const routes: Routes = [
  {
    path: 'recipes',
    component: RecipeListComponent
  },
  {
    path: 'recipes/:slug',
    component: RecipeDetailComponent
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [guestGuard]
  },
  {
    path: 'signup',
    component: SignupComponent,
    canActivate: [guestGuard]
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard]
  },
  {
    path: 'profile',
    loadComponent: () => import('./components/user/common/profile/profile.component').then(m => m.ProfileComponent),
    canActivate: [authGuard]
  },
  {
    path: 'favorites',
    loadComponent: () => import('./components/user/common/favorites-list/favorites-list.component').then(m => m.FavoritesListComponent),
    canActivate: [authGuard]
  },
  { path: '', redirectTo: '/recipes', pathMatch: 'full' },
  { path: '**', redirectTo: '/recipes' }
];
