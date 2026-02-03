import { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useLocalSearchParams } from 'expo-router';
import api from '@/lib/api';

export default function ScanTicketsScreen() {
  const { id: eventId } = useLocalSearchParams();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    if (!permission) {
      requestPermission();
    }
  }, []);

  const handleScan = async ({ data }: { data: string }) => {
    if (scanned) return;

    setScanned(true);

    try {
      const res = await api.post('/event/attendance', {
        qrCode: data,
        eventId,
      });

      if (res.data.success) {
        alert('Entry allowed ');
      } else {
        alert(res.data.message);
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Scan failed');
    }

    setTimeout(() => setScanned(false), 2000);
  };

  if (!permission) {
    return <Text>Requesting camera permission...</Text>;
  }

  if (!permission.granted) {
    return <Text>No camera access</Text>;
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        barcodeScannerSettings={{
          barcodeTypes: ['qr'],
        }}
        onBarcodeScanned={handleScan}
      />

      <Text style={styles.overlayText}>Scan Ticket QR</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlayText: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
