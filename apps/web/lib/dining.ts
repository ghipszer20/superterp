// What the dining page sends for one hall: every meal's name (for the meal
// tabs) but only the viewed meal's stations. Shared by the page's first
// render and /api/dining, so taps render exactly like the first view.

import type { DiningMenu, Station } from "@superterp/campus-data";

export type DiningSlice = {
  /** Meal names the hall serves today; null when its menu couldn't be loaded. */
  meals: string[] | null;
  /** The meal whose stations are included (null when the hall posted no menu). */
  meal: string | null;
  stations: Station[];
};

/** The preferred meal if the hall serves it, else the hall's first meal. */
export function resolveMeal(meals: string[] | null, preferred: string): string | null {
  if (!meals || meals.length === 0) return null;
  return meals.includes(preferred) ? preferred : meals[0]!;
}

export function diningSlice(menu: DiningMenu | null, preferredMeal: string): DiningSlice {
  if (!menu) return { meals: null, meal: null, stations: [] };
  const meals = menu.meals.map((m) => m.name);
  const meal = resolveMeal(meals, preferredMeal);
  return { meals, meal, stations: menu.meals.find((m) => m.name === meal)?.stations ?? [] };
}
