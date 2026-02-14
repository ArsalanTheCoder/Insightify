// src/components/ScamAlertOverlay.jsx
// In-app overlay shown ONLY for DANGEROUS threats (score >= 4)
// Less intrusive: auto-dismisses in 8 seconds, compact design

import React, { useEffect, useRef, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Animated,
    Dimensions,
    Platform,
    PixelRatio,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Responsive helpers that adapt to ALL device sizes
const fontScale = PixelRatio.getFontScale();
const scale = (size) => {
    const baseWidth = 375;
    const ratio = SCREEN_WIDTH / baseWidth;
    const newSize = size * Math.min(ratio, 1.4);
    return Math.round(PixelRatio.roundToNearestPixel(newSize / fontScale));
};

const AUTO_DISMISS_MS = 8000;

const getAppName = (pkg) => {
    if (!pkg) return 'Unknown';
    if (pkg.includes('whatsapp')) return 'WhatsApp';
    if (pkg.includes('telegram')) return 'Telegram';
    if (pkg.includes('instagram')) return 'Instagram';
    if (pkg.includes('messaging') || pkg.includes('mms')) return 'SMS';
    return 'Message';
};

const getAppIcon = (name) => {
    switch (name) {
        case 'WhatsApp': return 'logo-whatsapp';
        case 'Telegram': return 'paper-plane';
        case 'Instagram': return 'logo-instagram';
        case 'SMS': return 'chatbubble-ellipses';
        default: return 'alert-circle';
    }
};

const ScamAlertOverlay = ({ threat, onViewDetails, onDismiss }) => {
    const slideAnim = useRef(new Animated.Value(-200)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;
    const [visible, setVisible] = useState(false);
    const timerRef = useRef(null);

    useEffect(() => {
        if (threat) {
            setVisible(true);

            // Slide in from top
            Animated.parallel([
                Animated.spring(slideAnim, {
                    toValue: 0,
                    friction: 9,
                    tension: 60,
                    useNativeDriver: true,
                }),
                Animated.timing(opacityAnim, {
                    toValue: 1,
                    duration: 250,
                    useNativeDriver: true,
                }),
            ]).start();

            // Auto dismiss after 8 seconds
            timerRef.current = setTimeout(handleDismiss, AUTO_DISMISS_MS);

            return () => {
                if (timerRef.current) clearTimeout(timerRef.current);
            };
        }
    }, [threat]);

    const handleDismiss = () => {
        if (timerRef.current) clearTimeout(timerRef.current);
        Animated.parallel([
            Animated.timing(slideAnim, {
                toValue: -200,
                duration: 200,
                useNativeDriver: true,
            }),
            Animated.timing(opacityAnim, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
            }),
        ]).start(() => {
            setVisible(false);
            if (onDismiss) onDismiss();
        });
    };

    const handleViewDetails = () => {
        if (timerRef.current) clearTimeout(timerRef.current);
        handleDismiss();
        setTimeout(() => {
            if (onViewDetails) onViewDetails(threat);
        }, 300);
    };

    if (!visible || !threat) return null;

    const appName = getAppName(threat.app);
    const messagePreview = threat.message
        ? threat.message.length > 100
            ? threat.message.substring(0, 100) + '…'
            : threat.message
        : '';

    return (
        <Animated.View
            style={[
                styles.overlay,
                {
                    transform: [{ translateY: slideAnim }],
                    opacity: opacityAnim,
                },
            ]}
        >
            <View style={styles.card}>
                {/* Red accent bar */}
                <View style={styles.accentBar} />

                {/* Content */}
                <View style={styles.content}>
                    {/* Header */}
                    <View style={styles.headerRow}>
                        <View style={styles.headerLeft}>
                            <Ionicons name="warning" size={scale(18)} color="#DC2626" />
                            <Text style={styles.title} numberOfLines={1}>Scam Alert</Text>
                            <View style={styles.appBadge}>
                                <Ionicons name={getAppIcon(appName)} size={scale(11)} color="#6B7280" />
                                <Text style={styles.appText}>{appName}</Text>
                            </View>
                        </View>
                        <TouchableOpacity onPress={handleDismiss} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
                            <Ionicons name="close" size={scale(18)} color="#9CA3AF" />
                        </TouchableOpacity>
                    </View>

                    {/* Message */}
                    {messagePreview ? (
                        <Text style={styles.message} numberOfLines={2}>{messagePreview}</Text>
                    ) : null}

                    {/* Actions */}
                    <View style={styles.actionRow}>
                        <TouchableOpacity style={styles.dismissBtn} onPress={handleDismiss} activeOpacity={0.7}>
                            <Text style={styles.dismissText}>Dismiss</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.analyzeBtn} onPress={handleViewDetails} activeOpacity={0.7}>
                            <Ionicons name="search" size={scale(13)} color="#fff" />
                            <Text style={styles.analyzeText}>Analyze</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    overlay: {
        position: 'absolute',
        top: Platform.OS === 'ios' ? 50 : 10,
        left: 12,
        right: 12,
        zIndex: 9999,
        elevation: 20,
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 14,
        overflow: 'hidden',
        ...Platform.select({
            android: { elevation: 12 },
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 6 },
                shadowOpacity: 0.12,
                shadowRadius: 16,
            },
        }),
    },
    accentBar: {
        height: 3,
        backgroundColor: '#DC2626',
    },
    content: {
        padding: 14,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        gap: 6,
    },
    title: {
        fontSize: scale(14),
        fontWeight: '700',
        color: '#DC2626',
    },
    appBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F3F4F6',
        borderRadius: 8,
        paddingHorizontal: 6,
        paddingVertical: 2,
        gap: 3,
    },
    appText: {
        fontSize: scale(10),
        color: '#6B7280',
        fontWeight: '500',
    },
    message: {
        fontSize: scale(12),
        color: '#374151',
        lineHeight: scale(17),
        marginTop: 8,
    },
    actionRow: {
        flexDirection: 'row',
        marginTop: 12,
        gap: 8,
    },
    dismissBtn: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 10,
        backgroundColor: '#F3F4F6',
        borderRadius: 10,
    },
    dismissText: {
        fontSize: scale(12),
        color: '#6B7280',
        fontWeight: '600',
    },
    analyzeBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        backgroundColor: '#DC2626',
        borderRadius: 10,
        gap: 5,
    },
    analyzeText: {
        fontSize: scale(12),
        color: '#FFFFFF',
        fontWeight: '700',
    },
});

export default ScamAlertOverlay;
