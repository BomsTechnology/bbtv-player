import { Colors, Fonts } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, TextInput, TextInputProps, TouchableOpacity, View } from 'react-native';

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
  const handleClear = () => {
    onChangeText("");
    onClear?.();
  };

  return (
    <View style={styles.searchContainer}>
      <Ionicons 
        name="search" 
        size={20} 
        color="#999" 
        style={styles.searchIcon} 
      />
      
      <TextInput
        placeholder={placeholder}
        style={styles.input}
        placeholderTextColor="#999"
        value={value}
        onChangeText={onChangeText}
        {...textInputProps}
      />
      
      {showClearButton && value.length > 0 && (
        <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
          <Ionicons name="close-circle" size={20} color="#999" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: Colors.light,
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