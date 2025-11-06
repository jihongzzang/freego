import { Carrot, Apple, Beef, Milk, Package, Fish, Cookie, Soup } from 'lucide-react-native';
import { CategoryType } from '@/constants/categories';
import { getCategoryColor } from './getCategoryColors';

export function getCategoryIcon(category: CategoryType, size: number = 16, customColor?: string) {
  const color = customColor || getCategoryColor(category);

  switch (category) {
    case 'vegetables':
      return <Carrot size={size} color={color} />;
    case 'fruits':
      return <Apple size={size} color={color} />;
    case 'meat':
      return <Beef size={size} color={color} />;
    case 'seafood':
      return <Fish size={size} color={color} />;
    case 'dairy':
      return <Milk size={size} color={color} />;
    case 'processed':
      return <Cookie size={size} color={color} />;
    case 'seasoning':
      return <Soup size={size} color={color} />;
    case 'etc':
      return <Package size={size} color={color} />;
    default:
      return <Package size={size} color={color} />;
  }
}
