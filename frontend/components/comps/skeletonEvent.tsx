import { View, StyleSheet } from 'react-native';
import { Skeleton } from '@/components/ui/skeleton';
import { Spinner } from '../ui/spinner';

export default function EventDetailSkeleton() {
  return (
    <View style={styles.container}>
      <Skeleton width="70%" height={26} style={{ marginBottom: 10 }} />
      <Skeleton width="40%" height={16} style={{ marginBottom: 16 }} />

      <Skeleton width="100%" height={14} style={{ marginBottom: 8 }} />
      <Skeleton width="95%" height={14} style={{ marginBottom: 8 }} />
      <Skeleton width="90%" height={14} style={{ marginBottom: 16 }} />
        <Spinner variant='bars' color='red' size='lg'/>
      <View style={styles.infoRow}>
        <Skeleton width={100} height={14} />
        <Skeleton width={80} height={14} />
      </View>

      <Skeleton width="100%" height={44} style={{ borderRadius: 8 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    flex: 1,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
});
