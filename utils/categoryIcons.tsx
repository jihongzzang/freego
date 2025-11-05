import { Carrot, Apple, Beef, Milk, Package, Fish, Cookie, Soup } from 'lucide-react-native';
import { getCategoryColor } from '@/lib/theme';

export function getCategoryIcon(category: string, size: number = 16) {
  const color = getCategoryColor(category);

  switch (category) {
    case '채소':
      return <Carrot size={size} color={color} />;
    case '과일':
      return <Apple size={size} color={color} />;
    case '육류':
      return <Beef size={size} color={color} />;
    case '생선류':
      return <Fish size={size} color={color} />;
    case '유제품':
      return <Milk size={size} color={color} />;
    case '가공식품':
      return <Cookie size={size} color={color} />;
    case '조미료':
      return <Soup size={size} color={color} />;
    case '기타':
      return <Package size={size} color={color} />;
    default:
      return <Package size={size} color={color} />;
  }
}
