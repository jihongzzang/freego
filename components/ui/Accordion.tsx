import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { ChevronDown } from 'lucide-react-native';
import Collapsible from 'react-native-collapsible';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useTheme } from '@/lib/theme';

interface AccordionProps {
  title: string;
  children: React.ReactNode;
  leftIcon?: React.ReactNode;
  badge?: React.ReactNode;
  defaultExpanded?: boolean;
  onToggle?: (expanded: boolean) => void;
  style?: ViewStyle;
}

export default function Accordion({
  title,
  children,
  leftIcon,
  badge,
  defaultExpanded = false,
  onToggle,
  style,
}: AccordionProps) {
  const { colors, typography, isDark } = useTheme();
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const rotation = useSharedValue(defaultExpanded ? 180 : 0);

  const handleToggle = () => {
    rotation.value = withTiming(!isExpanded ? 180 : 0, { duration: 250 });
    setIsExpanded(!isExpanded);
    onToggle?.(!isExpanded);
  };

  const animatedRotationStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <View style={style}>
      <TouchableOpacity style={styles.header} onPress={handleToggle} activeOpacity={0.7}>
        <View style={styles.headerLeft}>
          {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
          <Text style={[typography.styles.t5Semibold, { color: colors.textSecondary }]}>{title}</Text>
        </View>

        <View style={styles.headerRight}>
          {badge && <View style={styles.badge}>{badge}</View>}
          <Animated.View style={animatedRotationStyle}>
            <ChevronDown size={20} color={colors.textSecondary} />
          </Animated.View>
        </View>
      </TouchableOpacity>

      <Collapsible collapsed={!isExpanded} duration={250}>
        <View style={styles.content}>{children}</View>
      </Collapsible>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  leftIcon: {
    marginRight: 8,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  badge: {},
  content: {
    marginTop: 12,
  },
});

// import React, { useState, useEffect, useRef } from 'react';
// import { View, Text, TouchableOpacity, StyleSheet, ViewStyle, Animated, LayoutAnimation, Platform, UIManager } from 'react-native';
// import { ChevronDown } from 'lucide-react-native';
// import { useTheme } from '@/lib/theme';

// if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
//   UIManager.setLayoutAnimationEnabledExperimental(true);
// }

// interface AccordionProps {
//   title: string;
//   children: React.ReactNode;
//   leftIcon?: React.ReactNode;
//   badge?: React.ReactNode;
//   defaultExpanded?: boolean;
//   onToggle?: (expanded: boolean) => void;
//   style?: ViewStyle;
// }

// export default function Accordion({
//   title,
//   children,
//   leftIcon,
//   badge,
//   defaultExpanded = false,
//   onToggle,
//   style,
// }: AccordionProps) {
//   const { colors, typography } = useTheme();
//   const [isExpanded, setIsExpanded] = useState(defaultExpanded);
//   const animatedRotation = useRef(new Animated.Value(defaultExpanded ? 1 : 0)).current;

//   useEffect(() => {
//     Animated.timing(animatedRotation, {
//       toValue: isExpanded ? 1 : 0,
//       duration: 250,
//       useNativeDriver: true,
//     }).start();
//   }, [isExpanded, animatedRotation]);

//   const handleToggle = () => {
//     LayoutAnimation.configureNext({
//       duration: 250,
//       update: {
//         type: LayoutAnimation.Types.easeInEaseOut,
//       },
//     });
//     setIsExpanded(!isExpanded);
//     onToggle?.(!isExpanded);
//   };

//   const rotateInterpolate = animatedRotation.interpolate({
//     inputRange: [0, 1],
//     outputRange: ['0deg', '180deg'],
//   });

//   return (
//     <View style={style}>
//       <TouchableOpacity style={styles.header} onPress={handleToggle} activeOpacity={0.7}>
//         <View style={styles.headerLeft}>
//           {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
//           <Text style={[typography.styles.t5Semibold, { color: colors.text }]}>{title}</Text>
//         </View>

//         <View style={styles.headerRight}>
//           {badge && <View style={styles.badge}>{badge}</View>}
//           <Animated.View style={{ transform: [{ rotate: rotateInterpolate }] }}>
//             <ChevronDown size={20} color={colors.textTertiary} />
//           </Animated.View>
//         </View>
//       </TouchableOpacity>

//       {isExpanded && <View style={styles.content}>{children}</View>}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingVertical: 12,
//   },
//   headerLeft: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     flex: 1,
//   },
//   leftIcon: {
//     marginRight: 8,
//   },
//   headerRight: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//   },
//   badge: {},
//   content: {
//     marginTop: 12,
//   },
// });
