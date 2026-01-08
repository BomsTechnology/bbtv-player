import { Colors, Fonts } from '@/constants/theme';
import Constants from "expo-constants";
import * as Linking from 'expo-linking';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

interface SettingItemProps {
  icon: string;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  rightComponent?: React.ReactNode;
}

interface SectionHeaderProps {
  title: string;
}

export default function SettingsScreen() {

  const SettingItem: React.FC<SettingItemProps> = ({ 
    icon, 
    title, 
    subtitle, 
    onPress, 
    rightComponent 
  }) => (
    <Pressable 
      onPress={onPress}
      style={styles.settingItem}
    >
      <View style={styles.settingContent}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>{icon}</Text>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{title}</Text>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
      </View>
      {rightComponent}
    </Pressable>
  );

  const SectionHeader: React.FC<SectionHeaderProps> = ({ title }) => (
    <Text style={styles.sectionHeader}>{title}</Text>
  );

  return (
    <View style={styles.container}>

      <ScrollView style={styles.scrollView}>
       

        {/* Other Section */}
        <SectionHeader title="Other" />
        <SettingItem 
          icon="🔗"
          title="Policies"
          subtitle="Privacy & Security"
          onPress={() => { Linking.openURL("https://www.freeprivacypolicy.com/live/c3775beb-1036-4f0f-af3a-22c9b77ae196"); }}
          rightComponent={<Text style={styles.arrow}>›</Text>}
        />
        <SettingItem 
          icon="❓"
          title="Help & Support"
          subtitle="Contact us"
          onPress={() => { Linking.openURL("https://marcelin-sigha.vercel.app/about"); }}
          rightComponent={<Text style={styles.arrow}>›</Text>}
        />
        <SettingItem 
          icon="📄"
          title="About"
          subtitle={`Version ${Constants.manifest2?.runtimeVersion}`}
          onPress={() => {  }}
          rightComponent={<Text style={styles.arrow}>›</Text>}
        />

        <View style={styles.bottomPadding} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 48,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: Colors.background,
  },
  headerTitle: {
    color: Colors.text,
    fontSize: 28,
    fontWeight: 'bold',
    fontFamily: Fonts.brandBlack,
  },
  scrollView: {
    flex: 1,
  },
  sectionHeader: {
    color: Colors.text,
    fontSize: 12,
    fontWeight: '600',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.gray,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderColor: Colors.gray,
    fontFamily: Fonts.brandBlack,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.background,
  },
  settingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.light,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  icon: {
    fontSize: 20,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: '500',
    fontFamily: Fonts.brandBlack,
  },
  subtitle: {
    color: '#9ca3af',
    fontSize: 14,
    marginTop: 4,
    fontFamily: Fonts.brand,
  },
  arrow: {
    color: '#9ca3af',
    fontSize: 20,
  },
  bottomPadding: {
    height: 32,
  },
});