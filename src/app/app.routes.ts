import { Routes } from '@angular/router';
import { RecipeDetailComponent } from './recipe-detail/recipe-detail.component';
import { RecipeListComponent } from './recipe-list/recipe-list.component';

export const routes: Routes = [
  {
    path: 'recipes',
    component: RecipeListComponent
  },
  {
    path: 'recipes/:slug',
    component: RecipeDetailComponent
  },
  { path: '', redirectTo: '/recipes', pathMatch: 'full' },
  { path: '**', redirectTo: '/recipes' }
];
