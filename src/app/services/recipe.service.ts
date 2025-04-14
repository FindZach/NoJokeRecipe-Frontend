import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Recipe } from '../models/recipe/recipe.models';

export interface PaginatedResponse<T> {
  items: T[];
  totalItems: number;
  page: number;
  totalPages: number;
  itemsPerPage: number;
}

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  private apiUrl = typeof process !== 'undefined' && process.env['API_URL']
    ? `${process.env['API_URL']}/recipes`
    : 'https://backend.nojokerecipes.com/recipes';

  constructor(private http: HttpClient) {}

  getRecipe(slug: string): Observable<Recipe> {
    const url = `${this.apiUrl}/${slug}`;
    return this.http.get<Recipe>(url);
  }

  getAllRecipes(): Observable<Recipe[]> {
    return this.http.get<Recipe[]>(this.apiUrl);
  }

  searchRecipes(
    query: string = '',
    page: number = 1,
    limit: number = 12,
    sortBy: string = 'newest'
  ): Observable<PaginatedResponse<Recipe>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString())
      .set('sort', sortBy);

    if (query && query.trim()) {
      params = params.set('q', query.trim());
    }

    return this.http.get<PaginatedResponse<Recipe>>(`${this.apiUrl}/search`, { params });
  }

  getFavoriteRecipes(): Observable<Recipe[]> {
    return this.http.get<Recipe[]>(`${this.apiUrl}/favorites`);
  }

  toggleFavorite(recipeId: string): Observable<{ isFavorite: boolean }> {
    return this.http.post<{ isFavorite: boolean }>(`${this.apiUrl}/${recipeId}/favorite`, {});
  }
}
