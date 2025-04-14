import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RecipeService } from '../services/recipe.service';
import { Meta, Title } from '@angular/platform-browser';
import { isPlatformServer } from '@angular/common';
import { CommonModule } from '@angular/common';
import {Recipe} from '../models/recipe/recipe.models';

@Component({
  selector: 'app-recipe-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.scss']
})
export class RecipeDetailComponent implements OnInit {
  recipe: Recipe | null = null;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private recipeService: RecipeService,
    private meta: Meta,
    private titleService: Title,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug');
    if (slug) {
      console.log('Fetching recipe for slug:', slug);
      this.recipeService.getRecipe(slug).subscribe({
        next: (data) => {
          console.log('Recipe fetched successfully:', data);
          this.recipe = data;
          this.updateMetaTags();
        },
        error: (err) => {
          console.error('Error fetching recipe:', err);
          this.error = err.status === 404 ? 'Recipe not found' : 'An error occurred';
        }
      });
    } else {
      console.warn('No slug provided');
      this.error = 'No recipe slug provided';
    }
  }

  private updateMetaTags(): void {
    if (this.recipe) {
      // Update the <title> tag
      this.titleService.setTitle(`${this.recipe.title} | NoJokeRecipe`);

      // Update meta tags (both server and client side)
      this.meta.updateTag({ name: 'description', content: this.recipe.description });
      this.meta.updateTag({ name: 'keywords', content: `${this.recipe.title}, NoJokeRecipe, recipe, cooking` });
      this.meta.updateTag({ property: 'og:title', content: `NoJokeRecipe: ${this.recipe.title}` });
      this.meta.updateTag({ property: 'og:description', content: this.recipe.description });
      this.meta.updateTag({ property: 'og:type', content: 'recipe' });
      this.meta.updateTag({ property: 'og:url', content: `http://localhost:4000${this.router.url}` }); // Dynamic URL
      this.meta.updateTag({ property: 'og:site_name', content: 'NoJokeRecipe' });

      // Add og:image (use a default image or a recipe-specific image)
      const imageUrl = this.recipe.steps?.find(step => step.imageUrl)?.imageUrl || 'https://placehold.co/600x400?text=Recipe+Image';
      this.meta.updateTag({ property: 'og:image', content: imageUrl });

      // Add Recipe schema markup
      const schema = {
        '@context': 'https://schema.org',
        '@type': 'Recipe',
        'name': this.recipe.title,
        'description': this.recipe.description,
        'recipeIngredient': this.recipe.ingredients.map(ing => `${ing.quantity} ${ing.name}`),
        'recipeInstructions': this.recipe.steps.map(step => ({
          '@type': 'HowToStep',
          'text': step.instruction,
          'image': step.imageUrl || undefined
        })),
        'image': imageUrl
      };

      // Add schema as a script tag
      this.meta.addTag({ name: 'schema', content: JSON.stringify(schema) });

      // Ensure schema is added server-side as a script tag
      if (isPlatformServer(this.platformId)) {
        const script = { name: 'schema-script', type: 'application/ld+json', content: JSON.stringify(schema) };
        this.meta.addTag(script);
      } else {
        // Client-side: Add schema as a script tag
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.text = JSON.stringify(schema);
        document.head.appendChild(script);
      }
    }
  }
}
