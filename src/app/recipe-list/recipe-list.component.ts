import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { RecipeService } from '../services/recipe.service';
import { Meta, Title } from '@angular/platform-browser';
import {Recipe} from '../models/recipe/recipe.models';

@Component({
  selector: 'app-recipe-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.scss']
})
export class RecipeListComponent implements OnInit {
  recipes: Recipe[] = [];
  error: string | null = null;

  constructor(
    private recipeService: RecipeService,
    private titleService: Title,
    private meta: Meta
  ) {}

  ngOnInit(): void {
    this.titleService.setTitle('NoJokeRecipe: All Recipes');
    this.meta.updateTag({ name: 'description', content: 'Browse all recipes on NoJokeRecipe, your go-to source for serious recipes.' });
    this.meta.updateTag({ name: 'keywords', content: 'recipes, NoJokeRecipe, cooking' });
    this.meta.updateTag({ property: 'og:title', content: 'NoJokeRecipe: All Recipes' });
    this.meta.updateTag({ property: 'og:description', content: 'Browse all recipes on NoJokeRecipe, your go-to source for serious recipes.' });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:url', content: 'http://localhost:4000/recipes' });
    this.meta.updateTag({ property: 'og:site_name', content: 'NoJokeRecipe' });
    this.meta.updateTag({ property: 'og:image', content: 'https://placehold.co/600x400?text=Recipes' });

    this.recipeService.getAllRecipes().subscribe({
      next: (data) => {
        this.recipes = data;
      },
      error: (err) => {
        this.error = err.status === 404 ? 'Recipes not found' : 'An error occurred';
        console.error('Error fetching recipes:', err);
      }
    });
  }
}
