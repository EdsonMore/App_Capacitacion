import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Radius, Spacing, Shadows } from '@/constants/theme';
import { dataService } from '@/services/dataService';
import { UserStats } from '@/types';

interface WorkerDniModalProps {
  visible: boolean;
  currentDni?: string;
  currentWorkerName?: string;
  onClose: () => void;
  onSuccess: (stats: UserStats) => void;
}

export default function WorkerDniModal({
  visible,
  currentDni,
  onClose,
  onSuccess,
}: WorkerDniModalProps) {
  const [dni, setDni] = useState(currentDni || '');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSave = async () => {
    const cleanDni = dni.trim().replace(/\D/g, '');
    if (cleanDni.length !== 8) {
      setErrorMessage('El DNI debe tener exactamente 8 dígitos.');
      return;
    }

    setErrorMessage('');
    setLoading(true);

    try {
      const result = await dataService.syncWithSupabaseByDni(cleanDni);
      onSuccess(result.stats);
      onClose();
    } catch (e: any) {
      setErrorMessage(e?.message || 'Error al validar el DNI con el sistema.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.modalOverlay}
      >
        <View style={[styles.modalCard, Shadows.lg]}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <View style={styles.iconCircle}>
              <MaterialCommunityIcons name="badge-account-outline" size={26} color={Colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.modalTitle}>Identificación del Trabajador</Text>
              <Text style={styles.modalSubtitle}>Consulta en el padrón oficial de Pura Fruit</Text>
            </View>
            <Pressable onPress={onClose} style={styles.closeBtn} accessibilityLabel="Cerrar">
              <Ionicons name="close" size={20} color={Colors.textSecondary} />
            </Pressable>
          </View>

          {/* Info pill */}
          <View style={styles.infoBanner}>
            <Ionicons name="shield-checkmark-outline" size={16} color="#065F46" />
            <Text style={styles.infoBannerText}>
              Ingresa tu DNI para verificar tu registro en campo y sincronizar tus capacitaciones con la base de datos de Pura Fruit.
            </Text>
          </View>

          {/* Form */}
          <View style={styles.formGroup}>
            <Text style={styles.inputLabel}>DNI del Trabajador (8 dígitos) *</Text>
            <View style={[styles.inputBox, errorMessage ? styles.inputBoxError : null]}>
              <Ionicons name="id-card-outline" size={18} color={Colors.textMuted} />
              <TextInput
                style={styles.textInput}
                placeholder="Ej. 72458912"
                placeholderTextColor="#94A3B8"
                keyboardType="numeric"
                maxLength={8}
                value={dni}
                onChangeText={(val) => {
                  setDni(val);
                  if (errorMessage) setErrorMessage('');
                }}
              />
            </View>
            {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
          </View>

          {/* Buttons */}
          <View style={styles.actionRow}>
            <Pressable style={styles.cancelBtn} onPress={onClose} disabled={loading}>
              <Text style={styles.cancelBtnText}>Cancelar</Text>
            </Pressable>

            <Pressable
              style={[styles.submitBtn, loading && { opacity: 0.7 }]}
              onPress={handleSave}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <>
                  <Text style={styles.submitBtnText}>Verificar y Cargar</Text>
                  <Ionicons name="checkmark-circle" size={18} color="#FFFFFF" />
                </>
              )}
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(5, 23, 16, 0.72)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.xl,
    padding: Spacing.xl,
    width: '100%',
    maxWidth: 480,
    gap: Spacing.md,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  modalSubtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  closeBtn: {
    padding: 6,
  },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: '#ECFDF5',
    padding: 12,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  infoBannerText: {
    fontSize: 12,
    color: '#065F46',
    flex: 1,
    lineHeight: 16,
    fontWeight: '500',
  },
  formGroup: {
    gap: 6,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: Radius.md,
    paddingHorizontal: 12,
    height: 46,
  },
  inputBoxError: {
    borderColor: '#EF4444',
    backgroundColor: '#FEF2F2',
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    color: Colors.textPrimary,
  },
  errorText: {
    fontSize: 11,
    color: '#EF4444',
    fontWeight: '600',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: Spacing.md,
    marginTop: Spacing.sm,
  },
  cancelBtn: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 12,
    borderRadius: Radius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  submitBtn: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: Spacing.xl,
    paddingVertical: 12,
    borderRadius: Radius.md,
    justifyContent: 'center',
  },
  submitBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
