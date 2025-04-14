import { RenderMode, ServerRoute } from '@angular/ssr';
import {inject} from '@angular/core';
import {RecipeService} from './services/recipe.service';
import {firstValueFrom} from 'rxjs';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'recipes',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'recipes/:slug',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => {
      const recipeService = inject(RecipeService);
      const recipes = await firstValueFrom(recipeService.getAllRecipes());
      return recipes.map(recipe => ({ slug: recipe.slug }));
    }
  },
  {
    path: '**',
    renderMode: RenderMode.Server
  }
];
