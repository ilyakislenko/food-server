export interface IFood {
    filters?: TDishType[];
    last:string | null;
}
export interface IIngredient {
    id: string,
    title: string,
    cost: string
}
interface IDishIngredient {
    title: string,
    amount: string
}
export type TDishType = "primary" | "vegeterian" | "soup" | "dessert" | "fish" | "salad" | "drinks" | "snacks" | "holiday" | "cheap"
export interface IDish {
    id: string,
    title: string,
    description: string,
    types: TDishType[],
    ingredients: IDishIngredient[]
}
