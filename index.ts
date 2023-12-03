import express, { Express, Request, Response } from 'express';
import fs from 'fs';
import dotenv from 'dotenv';
import https from 'https';
import { IDish, IFood, IIngredient, TDishType } from './types';

dotenv.config();
const dishesUrl = './data/dishes.json';
const ingredientsUrl = './data/ingredients.json';
const possibleFilters: TDishType[] = ["primary", "vegeterian", "soup", "dessert", "fish", "salad", "drinks", "snacks", "holiday", "cheap"]
const app: Express = express();
const port = process.env.PORT;
const options = {
  cert: fs.readFileSync('./etc/letsencrypt/live/elegant-solutions.ru/fullchain.pem'),
  key: fs.readFileSync('./etc/letsencrypt/live/elegant-solutions.ru/privkey.pem')
};
app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});
app.post('/food', (req: Request<{}, {}, IFood>, res: Response<IDish[]>) => {
  const filters: TDishType[] = Array.from(new Set(req.body.filters ? req.body.filters : [])).filter((fil) => possibleFilters.includes(fil))
  const dishes: IDish[] = JSON.parse(fs.readFileSync(dishesUrl, 'utf8'));
  const ingredients: IIngredient[] = JSON.parse(fs.readFileSync(ingredientsUrl, 'utf8'));
  const answer = dishes.filter(dish => filters.every(fil => dish.types.includes(fil)))
  res.send(answer);
})
app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});
https.createServer(options, app)