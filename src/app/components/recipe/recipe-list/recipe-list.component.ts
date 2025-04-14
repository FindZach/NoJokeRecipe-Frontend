import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RecipeService, PaginatedResponse } from '../../../services/recipe.service';
import { Meta, Title } from '@angular/platform-browser';
import { Recipe } from '../../../models/recipe/recipe.models';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

@Component({
  selector: 'app-recipe-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.scss']
})
export class RecipeListComponent implements OnInit {
  recipes: Recipe[] = [];
  loading = true;
  error: string | null = null;

  // Pagination
  currentPage = 1;
  itemsPerPage = 12;
  totalItems = 0;
  totalPages = 0;

  // Search
  searchQuery = '';
  private searchTerms = new Subject<string>();
  sortOption = 'newest';

  constructor(
    private recipeService: RecipeService,
    private titleService: Title,
    private meta: Meta,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.setupMetaTags();

    // Setup search debounce
    this.searchTerms.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(() => {
      this.currentPage = 1;
      this.loadRecipes();
    });

    // Get query params
    this.route.queryParams.subscribe(params => {
      this.currentPage = params['page'] ? parseInt(params['page'], 10) : 1;
      this.searchQuery = params['q'] || '';
      this.sortOption = params['sort'] || 'newest';

      this.loadRecipes();
    });
  }

  private setupMetaTags(): void {
    this.titleService.setTitle('NoJokeRecipes: All Recipes');
    this.meta.updateTag({ name: 'description', content: 'Browse all recipes on NoJokeRecipes, your go-to source for serious recipes.' });
    this.meta.updateTag({ name: 'keywords', content: 'recipes, NoJokeRecipes, cooking' });
    this.meta.updateTag({ property: 'og:title', content: 'NoJokeRecipes: All Recipes' });
    this.meta.updateTag({ property: 'og:description', content: 'Browse all recipes on NoJokeRecipes, your go-to source for serious recipes.' });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:url', content: 'http://localhost:4000/recipes' });
    this.meta.updateTag({ property: 'og:site_name', content: 'NoJokeRecipes' });
    this.meta.updateTag({ property: 'og:image', content: 'https://placehold.co/600x400?text=Recipes' });
  }

  onSearch(): void {
    this.searchTerms.next(this.searchQuery);
  }

  onSortChange(): void {
    this.currentPage = 1;
    this.loadRecipes();
  }

  loadRecipes(): void {
    this.loading = true;

    // Update URL with query params
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        page: this.currentPage,
        q: this.searchQuery || null,
        sort: this.sortOption
      },
      queryParamsHandling: 'merge'
    });

    this.recipeService.searchRecipes(
      this.searchQuery,
      this.currentPage,
      this.itemsPerPage,
      this.sortOption
    ).subscribe({
      next: (response: PaginatedResponse<Recipe>) => {
        this.recipes = response.items;
        this.totalItems = response.totalItems;
        this.totalPages = response.totalPages;
        this.loading = false;
      },
      error: (err) => {
        this.error = err.status === 404 ? 'No recipes found' : 'An error occurred';
        this.loading = false;
        console.error('Error fetching recipes:', err);
      }
    });
  }

  gotoPage(page: number): void {
    if (page < 1 || page > this.totalPages) {
      return;
    }

    this.currentPage = page;
    this.loadRecipes();

    // Scroll to top
    window.scrollTo(0, 0);
  }

  get pages(): number[] {
    const pageArray = [];
    const maxVisiblePages = 5;

    if (this.totalPages <= maxVisiblePages) {
      // Show all pages when there are few
      for (let i = 1; i <= this.totalPages; i++) {
        pageArray.push(i);
      }
    } else {
      // Calculate visible page range
      let startPage = Math.max(1, this.currentPage - 2);
      let endPage = startPage + maxVisiblePages - 1;

      if (endPage > this.totalPages) {
        endPage = this.totalPages;
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }

      for (let i = startPage; i <= endPage; i++) {
        pageArray.push(i);
      }
    }

    return pageArray;
  }
}
