import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useStore } from '../store';

interface State { hasError: boolean; error?: Error; }
interface Props { children: React.ReactNode; }

export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };
  static getDerivedStateFromError(error: Error) { return { hasError: true, error }; }
  componentDidCatch(error: Error, info: any) {
    console.warn('ErrorBoundary caught:', error, info);
  }
  render() {
    if (this.state.hasError) {
      return <ErrorScreen error={this.state.error} reset={() => this.setState({ hasError: false })} />;
    }
    return this.props.children;
  }
}

const ErrorScreen: React.FC<{ error?: Error; reset: () => void }> = ({ error, reset }) => {
  const { theme } = useStore();
  return (
    <View style={[styles.wrap, { backgroundColor: theme.bg }]}>
      <Text style={[styles.title, { color: theme.text }]}>Something went wrong</Text>
      <Text style={[styles.body, { color: theme.textSecondary }]}>
        {error?.message || 'An unexpected error occurred.'}
      </Text>
      <Pressable
        onPress={reset}
        style={[styles.btn, { backgroundColor: theme.primary }]}
      >
        <Text style={{ color: '#fff', fontWeight: '800' }}>Try again</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  title: { fontSize: 22, fontWeight: '800', marginBottom: 8 },
  body: { fontSize: 14, fontWeight: '500', textAlign: 'center', marginBottom: 24 },
  btn: { paddingHorizontal: 24, paddingVertical: 12, borderRadius: 24 },
});
