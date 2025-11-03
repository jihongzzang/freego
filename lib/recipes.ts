export interface Recipe {
  id: string;
  name: string;
  category: string;
  difficulty: string;
  cookingTime: number;
  ingredients: {
    name: string;
    quantity: number;
    unit: string;
  }[];
  image?: string;
}

export const recipes: Recipe[] = [
  {
    id: '1',
    name: '김치찌개',
    category: '한식',
    difficulty: '쉬움',
    cookingTime: 30,
    ingredients: [
      { name: '김치', quantity: 200, unit: 'g' },
      { name: '돼지고기', quantity: 150, unit: 'g' },
      { name: '두부', quantity: 1, unit: '모' },
      { name: '양파', quantity: 1, unit: '개' },
    ],
  },
  {
    id: '2',
    name: '된장찌개',
    category: '한식',
    difficulty: '쉬움',
    cookingTime: 25,
    ingredients: [
      { name: '된장', quantity: 2, unit: '큰술' },
      { name: '두부', quantity: 1, unit: '모' },
      { name: '감자', quantity: 1, unit: '개' },
      { name: '호박', quantity: 1, unit: '개' },
    ],
  },
  {
    id: '3',
    name: '계란말이',
    category: '한식',
    difficulty: '쉬움',
    cookingTime: 15,
    ingredients: [
      { name: '계란', quantity: 4, unit: '개' },
      { name: '당근', quantity: 1, unit: '개' },
      { name: '대파', quantity: 1, unit: '개' },
    ],
  },
  {
    id: '4',
    name: '토마토 스파게티',
    category: '양식',
    difficulty: '보통',
    cookingTime: 35,
    ingredients: [
      { name: '스파게티면', quantity: 200, unit: 'g' },
      { name: '토마토', quantity: 3, unit: '개' },
      { name: '양파', quantity: 1, unit: '개' },
      { name: '마늘', quantity: 3, unit: '쪽' },
    ],
  },
  {
    id: '5',
    name: '볶음밥',
    category: '한식',
    difficulty: '쉬움',
    cookingTime: 20,
    ingredients: [
      { name: '밥', quantity: 2, unit: '공기' },
      { name: '계란', quantity: 2, unit: '개' },
      { name: '당근', quantity: 1, unit: '개' },
      { name: '양파', quantity: 1, unit: '개' },
    ],
  },
  {
    id: '6',
    name: '샐러드',
    category: '샐러드',
    difficulty: '쉬움',
    cookingTime: 10,
    ingredients: [
      { name: '양상추', quantity: 100, unit: 'g' },
      { name: '토마토', quantity: 2, unit: '개' },
      { name: '오이', quantity: 1, unit: '개' },
      { name: '양파', quantity: 1, unit: '개' },
    ],
  },
];
