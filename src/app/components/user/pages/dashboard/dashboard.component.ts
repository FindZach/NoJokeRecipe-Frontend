import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import {User} from '../../../../models/user/user-data.model';
import {Recipe} from '../../../../models/recipe/recipe.models';
import {AuthService} from '../../../../services/auth/auth.service';
import {RecipeService} from '../../../../services/recipe.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  user: User | null = null;
  recentRecipes: Recipe[] = [];
  favoriteRecipes: Recipe[] = [];
  loading = true;
  error: string | null = null;

  constructor(
    private authService: AuthService,
    private recipeService: RecipeService
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getCurrentUser();

    // For now, just load all recipes - in a real app, you'd fetch user-specific data
    this.recipeService.getAllRecipes().subscribe({
      next: (recipes) => {
        this.recentRecipes = recipes.slice(0, 3);
        this.favoriteRecipes = recipes.slice(0, 2);
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load recipes';
        this.loading = false;
        console.error('Error loading dashboard data:', err);
      }
    });
  }
}
