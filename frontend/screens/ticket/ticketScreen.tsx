import api from '@/lib/api';
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  Image,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function MyTicketsScreen() {
  const [tickets, setTickets] = useState<any[]>([]);

  async function fetchTicket() {
    try {
      const res = await api.get('/ticket/getMyTickets');

      if (res.data?.success) {
        setTickets(res.data.tickets);
      }
    } catch (err) {
      console.log('Failed to fetch tickets', err);
    }
  }

  useEffect(() => {
    fetchTicket();
  }, []);
  const [selectedTicket, setSelectedTicket] = useState<any | null>(null);

  const renderTicket = ({ item }: { item: any }) => {
    return (
      <Pressable style={styles.card} onPress={() => setSelectedTicket(item)}>
        <View style={styles.row}>
          <View style={styles.infoSection}>
            <Text style={styles.eventTitle}>{item.event.title}</Text>
            <Text style={styles.subText}>{item.event.location}</Text>
            <Text style={styles.subText}>
              {new Date(item.event.startDate).toLocaleString()}
            </Text>

            <Text
              style={[
                styles.status,
                item.status === 'active'
                  ? styles.activeStatus
                  : styles.usedStatus,
              ]}
            >
              {item.status.toUpperCase()}
            </Text>
          </View>
        </View>
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>My Tickets</Text>

      <FlatList
        data={tickets}
        keyExtractor={(item) => item.id}
        renderItem={renderTicket}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      {/* ------------------------------ */}
      {/* Ticket Detail Modal */}
      {/* ------------------------------ */}

      <Modal visible={!!selectedTicket} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            {selectedTicket && (
              <>
                <Text style={styles.modalTitle}>
                  {selectedTicket.event.title}
                </Text>
                <Text style={styles.modalSubText}>
                  {selectedTicket.event.location}
                </Text>
                <Text style={styles.modalSubText}>
                  {new Date(selectedTicket.event.startDate).toLocaleString()}
                </Text>

                <Image
                  source={{ uri: selectedTicket.qrImage }}
                  style={styles.qrLarge}
                />

                <Text
                  style={[
                    styles.status,
                    selectedTicket.status === 'active'
                      ? styles.activeStatus
                      : styles.usedStatus,
                  ]}
                >
                  {selectedTicket.status.toUpperCase()}
                </Text>

                <Pressable
                  style={styles.closeBtn}
                  onPress={() => setSelectedTicket(null)}
                >
                  <Text style={styles.closeText}>Close</Text>
                </Pressable>
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// ------------------------------
// Styles
// ------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
  },

  title: {
    fontSize: 24,
    fontWeight: '700',
    marginVertical: 16,
  },

  listContent: {
    paddingBottom: 40,
  },

  card: {
    backgroundColor: '#f9fafb',
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    elevation: 2,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  infoSection: {
    flex: 1,
  },

  eventTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
  },

  subText: {
    fontSize: 13,
    color: '#6b7280',
    marginBottom: 2,
  },

  status: {
    marginTop: 10,
    fontSize: 12,
    fontWeight: '700',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },

  activeStatus: {
    backgroundColor: '#dcfce7',
    color: '#166534',
  },

  usedStatus: {
    backgroundColor: '#e5e7eb',
    color: '#374151',
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalCard: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },

  modalSubText: {
    fontSize: 13,
    color: '#6b7280',
    marginBottom: 4,
  },

  qrLarge: {
    width: 220,
    height: 220,
    marginVertical: 20,
  },

  closeBtn: {
    marginTop: 20,
    backgroundColor: '#111827',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },

  closeText: {
    color: '#fff',
    fontWeight: '600',
  },
});
