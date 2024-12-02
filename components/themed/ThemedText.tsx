import { Text, type TextProps, StyleSheet } from 'react-native';

import { useAppTheme } from '@/hooks/useAppTheme';

export type ThemedTextProps = TextProps & {
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link' | 'largeSemiBold' | 'midtitle';
};

export function ThemedText({
  style,
  type = 'default',
  ...rest
}: ThemedTextProps) {
  const color = useAppTheme().text;

  return (
    <Text
      style={[
        { color },
        type === 'default' ? styles.default : undefined,
        type === 'title' ? styles.title : undefined,
        type === 'defaultSemiBold' ? styles.semiBold : undefined,
        type === 'subtitle' ? styles.subtitle : undefined,
        type === 'link' ? styles.link : undefined,
        type === 'largeSemiBold' ? styles.largeSemiBold : undefined,
        type === 'midtitle' ? styles.midtitle : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  midtitle: {
    fontSize: 24,
    fontWeight: 'bold',
    lineHeight: 24,
  },
  default: {
    fontSize: 16,
    lineHeight: 24,
  },
  semiBold: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
  },
  largeSemiBold: {
    fontSize: 20,
    lineHeight: 24,
    fontWeight: '600',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    lineHeight: 32,
  },
  subtitle: {
    fontSize: 19,
    fontWeight: '500'
  },
  link: {
    lineHeight: 30,
    fontSize: 16,
    color: '#0a7ea4',
  },
});
