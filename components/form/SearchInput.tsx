import { Colors, Fonts } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, TextInput, TextInputProps, View } from 'react-native';

interface SearchInputProps extends TextInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onClear?: () => void;
  placeholder?: string;
  showClearButton?: boolean;
}

const SearchInput = ({
  value,
  onChangeText,
  onClear,
  placeholder = "Search...",
  showClearButton = true,
  ...textInputProps
}: SearchInputProps) => {
  const { isDark } = useTheme();

  const handleClear = () => {
    onChangeText("");
    onClear?.();
  };

  return (
    <View 
      style={[
        styles.searchContainer,
        {
          backgroundColor: isDark ? Colors.darkDark : '#fff',
          borderColor: isDark ? Colors.lightDark : Colors.light,
        }
      ]}
    >
      <Ionicons 
        name="search" 
        size={20} 
        color={isDark ? Colors.mutedDark : "#999"} 
        style={styles.searchIcon} 
      />
      <TextInput
        placeholder={placeholder}
        style={[
          styles.input,
          { color: isDark ? Colors.textDark : Colors.text }
        ]}
        placeholderTextColor={isDark ? Colors.mutedDark : "#999"}
        value={value}
        onChangeText={onChangeText}
        {...textInputProps}
      />
      {showClearButton && value.length > 0 && (
        <Pressable onPress={handleClear} style={styles.clearButton}>
          <Ionicons 
            name="close-circle" 
            size={20} 
            color={isDark ? Colors.mutedDark : "#999"} 
          />
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
  },
  searchIcon: {
  },
  input: {
    flex: 1,
    padding: 12,
    fontSize: 16,
    fontFamily: Fonts.brand,
  },
  clearButton: {
    padding: 4,
  },
});

export default SearchInput;