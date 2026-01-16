import { Colors, Fonts } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

interface EmptyDataProps {
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  iconSize?: number;
  iconColor?: string;
}

const EmptyData = ({
  icon = 'folder-open-outline',
  title,
  description,
  actionLabel,
  onAction,
  iconSize = 64,
  iconColor,
}: EmptyDataProps) => {
  const { isDark } = useTheme();

  const resolvedIconColor = iconColor || (isDark ? '#555' : '#ccc');

  return (
    <View style={styles.container}>
      <Ionicons name={icon} size={iconSize} color={resolvedIconColor} />
      <Text 
        style={[
          styles.title,
          { color: isDark ? Colors.textDark : Colors.text }
        ]}
      >
        {title}
      </Text>
      {description && (
        <Text 
          style={[
            styles.description,
            { color: isDark ? Colors.mutedDark : Colors.muted }
          ]}
        >
          {description}
        </Text>
      )}
      {actionLabel && onAction && (
        <Pressable 
          style={[
            styles.button,
            { backgroundColor: isDark ? Colors.primaryDark : Colors.primary }
          ]} 
          onPress={onAction}
        >
          <Text style={styles.buttonText}>{actionLabel}</Text>
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 80,
    paddingHorizontal: 40,
  },
  title: {
    fontSize: 18,
    fontFamily: Fonts.brandBold,
    marginTop: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    fontFamily: Fonts.brand,
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 20,
  },
  button: {
    marginTop: 24,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: Fonts.brandBold,
  },
});

export default EmptyData;