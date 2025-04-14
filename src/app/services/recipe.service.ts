import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {Recipe} from '../models/recipe/recipe.models';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  private apiUrl = environment.apiUrl + '/recipes';
  constructor(private http: HttpClient) {}

  getRecipe(slug: string): Observable<Recipe> {
    const url = `${this.apiUrl}/${slug}`;
    return this.http.get<Recipe>(url);
  }

  getAllRecipes(): Observable<Recipe[]> {
    return this.http.get<Recipe[]>(this.apiUrl);
  }
}
