import { Carrot, Apple, Beef, Milk, Package, Fish, Cookie, FlaskConical, Sparkle } from 'lucide-react-native';
import { getCategoryColor } from './getCategoryColor';
import { Category } from '@/data/enums/category';

export function getCategoryIcon(category: Category, size: number = 16, customColor?: string) {
  const color = customColor || getCategoryColor(category);

  switch (category) {
    case Category.VEGETABLE:
      return <Carrot size={size} color={color} />;
    case Category.FRUIT:
      return <Apple size={size} color={color} />;
    case Category.MEAT:
      return <Beef size={size} color={color} />;
    case Category.SEAFOOD:
      return <Fish size={size} color={color} />;
    case Category.DAIRY:
      return <Milk size={size} color={color} />;
    case Category.PROCESSED:
      return <Cookie size={size} color={color} />;
    case Category.SEASONING:
      return <FlaskConical size={size} color={color} />;
    case Category.OTHER:
      return <Package size={size} color={color} />;
    default:
      return <Package size={size} color={color} />;
  }
}
