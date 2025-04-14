export interface Recipe {
  id: string;
  title: string;
  description: string;
  slug: string;
  steps: Step[];
  ingredients: Ingredient[];
  childRecipes: Recipe[] | null;
}

export interface Step {
  stepNumber: number;
  instruction: string;
  imageUrl?: string; // Optional since it can be null
}

export interface Ingredient {
  name: string;
  quantity: string;
}
