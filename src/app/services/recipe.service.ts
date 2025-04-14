import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {Recipe} from '../models/recipe/recipe.models';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  private apiUrl = typeof process !== 'undefined' && process.env['API_URL']
    ? `${process.env['API_URL']}/recipes`
    : 'http://localhost:8080/recipes';

  constructor(private http: HttpClient) {}

  getRecipe(slug: string): Observable<Recipe> {
    const url = `${this.apiUrl}/${slug}`;
    return this.http.get<Recipe>(url);
  }

  getAllRecipes(): Observable<Recipe[]> {
    return this.http.get<Recipe[]>(this.apiUrl);
  }
}
