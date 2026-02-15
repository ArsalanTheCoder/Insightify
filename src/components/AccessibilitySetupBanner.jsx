// src/components/AccessibilitySetupBanner.jsx
// Shows ONCE on DetectScreen when accessibility service is not enabled.
// Re-checks status on screen focus. Dismisses permanently after user enables or clicks "Later".

import React, { useEffect, useState, useCallback } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    Platform,
    Animated,
    PixelRatio,
    AppState,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
    isAccessibilityEnabled,
    openAccessibilitySettings,
} from '../services/accessibilityService';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const fontScale = PixelRatio.getFontScale();
const scale = (size) => {
    const ratio = SCREEN_WIDTH / 375;
    return Math.round(PixelRatio.roundToNearestPixel(size * Math.min(ratio, 1.3) / fontScale));
};

const AccessibilitySetupBanner = () => {
    const [enabled, setEnabled] = useState(null);
    const [dismissed, setDismissed] = useState(false);
    const fadeAnim = React.useRef(new Animated.Value(0)).current;

    const checkStatus = useCallback(async () => {
        if (Platform.OS !== 'android') {
            setEnabled(true);
            return;
        }
        const status = await isAccessibilityEnabled();
        setEnabled(status);
        if (status) setDismissed(true); // Auto-dismiss if enabled
    }, []);

    // Check on mount
    useEffect(() => {
        checkStatus();
    }, [checkStatus]);

    // Re-check when app comes back to foreground (user might have just enabled it)
    useEffect(() => {
        const sub = AppState.addEventListener('change', (nextState) => {
            if (nextState === 'active') {
                checkStatus();
            }
        });
        return () => sub.remove();
    }, [checkStatus]);

    // Animate in when not enabled
    useEffect(() => {
        if (enabled === false && !dismissed) {
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 400,
                useNativeDriver: true,
            }).start();
        }
    }, [enabled, dismissed, fadeAnim]);

    const handleEnable = () => {
        openAccessibilitySettings();
    };

    const handleDismiss = () => {
        Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
        }).start(() => setDismissed(true));
    };

    if (enabled === null || enabled === true || dismissed) return null;

    return (
        <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
            <View style={styles.row}>
                <View style={styles.iconWrap}>
                    <Ionicons name="shield-half-outline" size={scale(22)} color="#F59E0B" />
                </View>
                <View style={styles.textWrap}>
                    <Text style={styles.title}>Enable Real-Time Protection</Text>
                    <Text style={styles.subtitle}>
                        Auto-scan messages from WhatsApp, Telegram, Instagram & SMS for scams.
                    </Text>
                </View>
            </View>

            <View style={styles.actionRow}>
                <TouchableOpacity style={styles.enableBtn} onPress={handleEnable} activeOpacity={0.7}>
                    <Ionicons name="settings-outline" size={scale(13)} color="#fff" />
                    <Text style={styles.enableText}>Enable</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleDismiss} style={styles.laterBtn} activeOpacity={0.7}>
                    <Text style={styles.laterText}>Later</Text>
                </TouchableOpacity>
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFBEB',
        borderWidth: 1,
        borderColor: '#FDE68A',
        borderRadius: 14,
        padding: 14,
        marginBottom: 14,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    iconWrap: {
        width: 38,
        height: 38,
        borderRadius: 19,
        backgroundColor: '#FEF3C7',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
    },
    textWrap: {
        flex: 1,
    },
    title: {
        fontSize: scale(14),
        fontWeight: '700',
        color: '#92400E',
        marginBottom: 3,
    },
    subtitle: {
        fontSize: scale(11),
        color: '#B45309',
        lineHeight: scale(16),
    },
    actionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    enableBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F59E0B',
        paddingHorizontal: 14,
        paddingVertical: 9,
        borderRadius: 10,
        gap: 5,
    },
    enableText: {
        color: '#fff',
        fontSize: scale(12),
        fontWeight: '700',
    },
    laterBtn: {
        paddingHorizontal: 10,
        paddingVertical: 9,
    },
    laterText: {
        color: '#B45309',
        fontSize: scale(12),
        fontWeight: '600',
    },
});

export default AccessibilitySetupBanner;
