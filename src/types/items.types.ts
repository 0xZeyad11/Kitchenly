interface itemtype {
  name: string;
  description: string;
  type: string;
  subtype: string;
  price: number;
  image?: string;
}

//TODO remove this shit
type test = {
  name: string;
  id: number;
};
/**
 * type of food should be:
 *  Oriental
 *  Chinese
 *  Korean
 *  American
 *  Japanese
 *
 *
 * *****
 * Sub types:
 *  Dish
 *  Beverage
 *  Drinks
 *  Dessert
 */

export default itemtype;
