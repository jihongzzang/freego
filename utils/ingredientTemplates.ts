export interface IngredientTemplate {
  name: string;
  emoji: string;
  category: string;
  defaultUnit?: string;
}

export const ingredientTemplates: IngredientTemplate[] = [
  // 채소
  { name: '당근', emoji: '🥕', category: '채소', defaultUnit: '개' },
  { name: '양파', emoji: '🧅', category: '채소', defaultUnit: '개' },
  { name: '감자', emoji: '🥔', category: '채소', defaultUnit: '개' },
  { name: '토마토', emoji: '🍅', category: '채소', defaultUnit: '개' },
  { name: '상추', emoji: '🥬', category: '채소', defaultUnit: 'g' },
  { name: '배추', emoji: '🥬', category: '채소', defaultUnit: '포기' },
  { name: '브로콜리', emoji: '🥦', category: '채소', defaultUnit: '개' },
  { name: '오이', emoji: '🥒', category: '채소', defaultUnit: '개' },
  { name: '가지', emoji: '🍆', category: '채소', defaultUnit: '개' },
  { name: '피망', emoji: '🫑', category: '채소', defaultUnit: '개' },
  { name: '옥수수', emoji: '🌽', category: '채소', defaultUnit: '개' },
  { name: '버섯', emoji: '🍄', category: '채소', defaultUnit: 'g' },
  { name: '대파', emoji: '🌿', category: '채소', defaultUnit: '개' },
  { name: '마늘', emoji: '🧄', category: '채소', defaultUnit: '개' },
  { name: '생강', emoji: '🫚', category: '채소', defaultUnit: 'g' },
  { name: '고추', emoji: '🌶️', category: '채소', defaultUnit: '개' },
  { name: '깻잎', emoji: '🥬', category: '채소', defaultUnit: '장' },
  { name: '시금치', emoji: '🥬', category: '채소', defaultUnit: 'g' },
  { name: '무', emoji: '🥕', category: '채소', defaultUnit: '개' },
  { name: '애호박', emoji: '🥒', category: '채소', defaultUnit: '개' },
  { name: '청양고추', emoji: '🌶️', category: '채소', defaultUnit: '개' },
  { name: '파프리카', emoji: '🫑', category: '채소', defaultUnit: '개' },

  // 과일
  { name: '사과', emoji: '🍎', category: '과일', defaultUnit: '개' },
  { name: '바나나', emoji: '🍌', category: '과일', defaultUnit: '개' },
  { name: '오렌지', emoji: '🍊', category: '과일', defaultUnit: '개' },
  { name: '딸기', emoji: '🍓', category: '과일', defaultUnit: 'g' },
  { name: '포도', emoji: '🍇', category: '과일', defaultUnit: '송이' },
  { name: '수박', emoji: '🍉', category: '과일', defaultUnit: '개' },
  { name: '복숭아', emoji: '🍑', category: '과일', defaultUnit: '개' },
  { name: '키위', emoji: '🥝', category: '과일', defaultUnit: '개' },
  { name: '망고', emoji: '🥭', category: '과일', defaultUnit: '개' },
  { name: '파인애플', emoji: '🍍', category: '과일', defaultUnit: '개' },
  { name: '레몬', emoji: '🍋', category: '과일', defaultUnit: '개' },
  { name: '체리', emoji: '🍒', category: '과일', defaultUnit: 'g' },
  { name: '배', emoji: '🍐', category: '과일', defaultUnit: '개' },
  { name: '귤', emoji: '🍊', category: '과일', defaultUnit: '개' },
  { name: '자두', emoji: '🍑', category: '과일', defaultUnit: '개' },
  { name: '참외', emoji: '🍈', category: '과일', defaultUnit: '개' },
  { name: '메론', emoji: '🍈', category: '과일', defaultUnit: '개' },
  { name: '블루베리', emoji: '🫐', category: '과일', defaultUnit: 'g' },

  // 육류
  { name: '소고기', emoji: '🥩', category: '육류', defaultUnit: 'g' },
  { name: '돼지고기', emoji: '🥓', category: '육류', defaultUnit: 'g' },
  { name: '닭고기', emoji: '🍗', category: '육류', defaultUnit: 'g' },
  { name: '삼겹살', emoji: '🥓', category: '육류', defaultUnit: 'g' },
  { name: '베이컨', emoji: '🥓', category: '육류', defaultUnit: 'g' },
  { name: '소시지', emoji: '🌭', category: '육류', defaultUnit: '개' },
  { name: '닭가슴살', emoji: '🍗', category: '육류', defaultUnit: 'g' },
  { name: '목살', emoji: '🥩', category: '육류', defaultUnit: 'g' },
  { name: '안심', emoji: '🥩', category: '육류', defaultUnit: 'g' },
  { name: '등심', emoji: '🥩', category: '육류', defaultUnit: 'g' },
  { name: '햄', emoji: '🥩', category: '육류', defaultUnit: 'g' },
  { name: '스팸', emoji: '🥫', category: '육류', defaultUnit: '개' },

  // 생선류
  { name: '고등어', emoji: '🐟', category: '생선류', defaultUnit: '마리' },
  { name: '연어', emoji: '🐟', category: '생선류', defaultUnit: 'g' },
  { name: '참치', emoji: '🐟', category: '생선류', defaultUnit: '캔' },
  { name: '오징어', emoji: '🦑', category: '생선류', defaultUnit: '마리' },
  { name: '새우', emoji: '🦐', category: '생선류', defaultUnit: 'g' },
  { name: '조기', emoji: '🐟', category: '생선류', defaultUnit: '마리' },
  { name: '갈치', emoji: '🐟', category: '생선류', defaultUnit: '마리' },
  { name: '꽁치', emoji: '🐟', category: '생선류', defaultUnit: '마리' },
  { name: '멸치', emoji: '🐟', category: '생선류', defaultUnit: 'g' },
  { name: '조개', emoji: '🦪', category: '생선류', defaultUnit: 'g' },
  { name: '전복', emoji: '🦪', category: '생선류', defaultUnit: '개' },
  { name: '게', emoji: '🦀', category: '생선류', defaultUnit: '마리' },

  // 유제품
  { name: '우유', emoji: '🥛', category: '유제품', defaultUnit: 'ml' },
  { name: '치즈', emoji: '🧀', category: '유제품', defaultUnit: 'g' },
  { name: '요거트', emoji: '🥛', category: '유제품', defaultUnit: '개' },
  { name: '버터', emoji: '🧈', category: '유제품', defaultUnit: 'g' },
  { name: '계란', emoji: '🥚', category: '유제품', defaultUnit: '개' },
  { name: '생크림', emoji: '🥛', category: '유제품', defaultUnit: 'ml' },
  { name: '모짜렐라', emoji: '🧀', category: '유제품', defaultUnit: 'g' },
  { name: '체다치즈', emoji: '🧀', category: '유제품', defaultUnit: 'g' },
  { name: '휘핑크림', emoji: '🥛', category: '유제품', defaultUnit: 'ml' },

  // 가공식품
  { name: '빵', emoji: '🍞', category: '가공식품', defaultUnit: '개' },
  { name: '쌀', emoji: '🍚', category: '가공식품', defaultUnit: 'kg' },
  { name: '두부', emoji: '🍥', category: '가공식품', defaultUnit: '모' },
  { name: '김', emoji: '🍥', category: '가공식품', defaultUnit: '장' },
  { name: '라면', emoji: '🍜', category: '가공식품', defaultUnit: '개' },
  { name: '김치', emoji: '🥬', category: '가공식품', defaultUnit: 'g' },
  { name: '된장', emoji: '🥫', category: '가공식품', defaultUnit: 'g' },
  { name: '고추장', emoji: '🥫', category: '가공식품', defaultUnit: 'g' },
  { name: '쌈장', emoji: '🥫', category: '가공식품', defaultUnit: 'g' },
  { name: '참기름', emoji: '🧴', category: '가공식품', defaultUnit: 'ml' },
  { name: '식용유', emoji: '🧴', category: '가공식품', defaultUnit: 'ml' },
  { name: '올리브유', emoji: '🧴', category: '가공식품', defaultUnit: 'ml' },
  { name: '파스타', emoji: '🍝', category: '가공식품', defaultUnit: 'g' },
  { name: '국수', emoji: '🍜', category: '가공식품', defaultUnit: 'g' },
  { name: '통조림', emoji: '🥫', category: '가공식품', defaultUnit: '개' },

  // 조미료
  { name: '소금', emoji: '🧂', category: '조미료', defaultUnit: 'g' },
  { name: '설탕', emoji: '🧂', category: '조미료', defaultUnit: 'g' },
  { name: '간장', emoji: '🥫', category: '조미료', defaultUnit: 'ml' },
  { name: '식초', emoji: '🧴', category: '조미료', defaultUnit: 'ml' },
  { name: '고춧가루', emoji: '🌶️', category: '조미료', defaultUnit: 'g' },
  { name: '후추', emoji: '🧂', category: '조미료', defaultUnit: 'g' },
  { name: '다진마늘', emoji: '🧄', category: '조미료', defaultUnit: 'g' },
  { name: '맛술', emoji: '🧴', category: '조미료', defaultUnit: 'ml' },
  { name: '미림', emoji: '🧴', category: '조미료', defaultUnit: 'ml' },
  { name: '굴소스', emoji: '🥫', category: '조미료', defaultUnit: 'ml' },
  { name: '케첩', emoji: '🥫', category: '조미료', defaultUnit: 'ml' },
  { name: '마요네즈', emoji: '🥫', category: '조미료', defaultUnit: 'ml' },
  { name: '겨자', emoji: '🥫', category: '조미료', defaultUnit: 'g' },
  { name: '와사비', emoji: '🥫', category: '조미료', defaultUnit: 'g' },
];

export function getTemplatesByCategory(category: string): IngredientTemplate[] {
  if (category === '전체') {
    return ingredientTemplates;
  }
  return ingredientTemplates.filter((item) => item.category === category);
}
