import express, { Express, Request, Response } from 'express';
import bodyParser from 'body-parser';
import fs from 'fs';
import dotenv from 'dotenv';
import https from 'https';
import { IDish, IFood, IIngredient, TDishType } from './types';

dotenv.config();
const dishesUrl = './data/dishes.json';
const ingredientsUrl = './data/ingredients.json';
const possibleFilters: TDishType[] = ["primary", "vegeterian", "soup", "dessert", "fish", "salad", "drinks", "snacks", "holiday", "cheap"];
const app: Express = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())
const port = process.env.PORT;
const portHttps = process.env.HTTPS;
const options = {
  cert: fs.readFileSync('/etc/letsencrypt/live/elegant-solutions.ru/fullchain.pem', 'utf-8'),
  key: fs.readFileSync('/etc/letsencrypt/live/elegant-solutions.ru/privkey.pem', 'utf-8')
};
app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});
app.post('/food', (req: Request<{}, {}, IFood>, res: Response<IDish>) => {
  const filters: TDishType[] = Array.from(new Set(req.body.filters ? req.body.filters : [])).filter((fil) => possibleFilters.includes(fil))
  const previousId: string | undefined = req.body.previous;
  console.log('previousId',previousId)
  const dishes: IDish[] = JSON.parse(fs.readFileSync(dishesUrl, 'utf8'));
  const ingredients: IIngredient[] = JSON.parse(fs.readFileSync(ingredientsUrl, 'utf8'));
  const items = dishes.filter(dish => filters.every(fil => dish.types.includes(fil) && dish.id !== previousId))
  if (items.length) { 
    const item = items[Math.floor(Math.random() * items.length)];
    res.send(item);
  }
  res.send(undefined);
})
app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});
https.createServer(options, app).listen(portHttps)