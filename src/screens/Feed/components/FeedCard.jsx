import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Modal,
  StatusBar,
  Share,
  Animated,
  TextInput,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Pressable } from 'react-native';

const screenWidth = Dimensions.get('window').width;
const APP_LOGO = require('../../../../assets/images/insightify.png');

const REACTIONS = ['👍', '❤️', '😮', '😢', '😡', '🎉'];

export default function FeedCard({ post }) {
  const [reaction, setReaction] = useState(null);
  const [showReactions, setShowReactions] = useState(false);
  const [imageVisible, setImageVisible] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [comment, setComment] = useState('');
  const [pressed, setPressed] = useState(false);


  const [expanded, setExpanded] = useState(false);
  const [hasOverflow, setHasOverflow] = useState(false);

  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    setExpanded(false);
    setHasOverflow(false);
  }, [post?.description]);

  const onShare = async () => {
    try {
      await Share.share({
        message: post.description,
      });
    } catch {}
  };

  const PREVIEW_LENGTH = 70;

const description = post?.description || '';
const shouldShowViewMore = description.length > PREVIEW_LENGTH;

const previewText = shouldShowViewMore
  ? description.slice(0, PREVIEW_LENGTH).trim()
  : description;


  return (
    <>
      <View style={styles.card}>
        {/* HEADER */}
        <View style={styles.header}>
          <View style={styles.userRow}>
            <Image source={APP_LOGO} style={styles.avatar} />

            <View>
              <View style={styles.nameRow}>
                <Text style={styles.teamName}>Insightify</Text>
                {post.isVerified && (
                  <Ionicons
                    name="checkmark-circle"
                    size={14}
                    color="#2563EB"
                    style={{ marginLeft: 4 }}
                  />
                )}
              </View>

              <View style={styles.metaRow}>
                <Text style={styles.time}>{post.time}</Text>
                <Text style={styles.dot}>•</Text>
                <View
                  style={[
                    styles.tagBadge,
                    { backgroundColor: getTagColor(post.type) },
                  ]}
                >
                  <Text
                    style={[
                      styles.tagText,
                      { color: getTagTextColor(post.type) },
                    ]}
                  >
                    {post.type}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          <TouchableOpacity onPress={() => setShowMenu(!showMenu)}>
            <Ionicons name="ellipsis-horizontal" size={18} color="#6B7280" />
          </TouchableOpacity>
        </View>

        {/* MENU */}
        {showMenu && (
          <View style={styles.menu}>
            <MenuItem icon="bookmark-outline" label="Save post" />
            <MenuItem icon="alert-circle-outline" label="Report" />
            <MenuItem icon="eye-off-outline" label="Hide" />
          </View>
        )}

        {/* TITLE */}
        {post.title && <Text style={styles.title}>{post.title}</Text>}

      {/* DESCRIPTION */}
      <View style={styles.descriptionWrapper}>
        {!expanded ? (
          <Text style={styles.description}>
            {previewText}
            {shouldShowViewMore && (
              <>
                <Text>... </Text>
                <Text
                  style={styles.viewMoreText}
                  onPress={() => setExpanded(true)}
                >
                  View more
                </Text>
              </>
            )}
          </Text>
        ) : (
          <>
            <Text style={styles.description}>{description}</Text>
            {shouldShowViewMore && (
              <TouchableOpacity
                onPress={() => setExpanded(false)}
                style={styles.viewLessBtn}
              >
                <Text style={styles.viewMoreText}>View less</Text>
              </TouchableOpacity>
            )}
          </>
        )}
      </View>

      {/* IMAGE */}
      {post.image && (
        <Pressable
          onPressIn={() => setPressed(true)}
          onPressOut={() => setPressed(false)}
          onPress={() => setImageVisible(true)}
        >
          <Animated.Image
            source={post.image}
            style={[
              styles.postImage,
              {
                transform: [{ scale: pressed ? 0.985 : 1 }],
              },
            ]}
          />
        </Pressable>
      )}

        {/* REACTIONS */}
        {showReactions && (
          <Animated.View
            style={[
              styles.reactionBar,
              { transform: [{ scale: scaleAnim }] },
            ]}
          >
            {REACTIONS.map((emoji) => (
              <TouchableOpacity
                key={emoji}
                onPress={() => {
                  setReaction(emoji);
                  setShowReactions(false);
                }}
              >
                <Text style={styles.reactionEmoji}>{emoji}</Text>
              </TouchableOpacity>
            ))}
          </Animated.View>
        )}

        {/* COMMENT */}
        {showCommentBox && (
          <View style={styles.commentBox}>
            <TextInput
              placeholder="Write a comment..."
              value={comment}
              onChangeText={setComment}
              style={styles.commentInput}
            />
            <TouchableOpacity
              onPress={() => {
                setComment('');
                setShowCommentBox(false);
              }}
            >
              <Text style={styles.postBtn}>Post</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* FOOTER */}
        <View style={styles.footer}>
          <FooterBtn
            icon={reaction || 'thumbs-up-outline'}
            label={reaction ? 'Reacted' : 'Like'}
            emoji={reaction}
            onPress={() => {
              setShowReactions(!showReactions);
              Animated.spring(scaleAnim, {
                toValue: 1,
                useNativeDriver: true,
              }).start();
            }}
          />

          <FooterBtn
            icon="chatbubble-outline"
            label="Comment"
            onPress={() => setShowCommentBox(!showCommentBox)}
          />

          <FooterBtn
            icon="share-social-outline"
            label="Share"
            onPress={onShare}
          />
        </View>
      </View>

      {/* FULL IMAGE */}
      <Modal visible={imageVisible} transparent>
        <StatusBar barStyle="light-content" />
        <TouchableOpacity
          style={styles.modalContainer}
          onPress={() => setImageVisible(false)}
        >
          <Image source={post.image} style={styles.fullImage} resizeMode="contain" />
        </TouchableOpacity>
      </Modal>
    </>
  );
}

/* SUB COMPONENTS */

const FooterBtn = ({ icon, label, onPress, emoji }) => (
  <TouchableOpacity style={styles.actionBtn} onPress={onPress}>
    {emoji ? (
      <Text style={{ fontSize: 18 }}>{emoji}</Text>
    ) : (
      <Ionicons name={icon} size={18} color="#6B7280" />
    )}
    <Text style={styles.actionText}>{label}</Text>
  </TouchableOpacity>
);

const MenuItem = ({ icon, label }) => (
  <TouchableOpacity style={styles.menuItem}>
    <Ionicons name={icon} size={16} />
    <Text style={styles.menuText}>{label}</Text>
  </TouchableOpacity>
);

/* STYLES */

const styles = StyleSheet.create({
  /* CARD */
  card: {
    backgroundColor: '#FFFFFF',
    marginBottom: 8,
  },

  /* HEADER */
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },

  userRow: {
    flexDirection: 'row',
  },

  avatar: {
    width: 40,
    height: 40,
    borderRadius: 8,
    marginRight: 10,
  },

  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  teamName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0A66C2',
  },

  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },

  time: {
    fontSize: 12,
    color: '#6B7280',
  },

  dot: {
    marginHorizontal: 6,
    color: '#6B7280',
  },

  tagBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },

  tagText: {
    fontSize: 11,
    fontWeight: '700',
  },

  /* TITLE */
  title: {
    fontSize: 16,
    fontWeight: '900',
    color: '#111827',
    paddingHorizontal: 16,
    marginBottom: 4,
  },

  /* DESCRIPTION */
  descriptionWrapper: {
    paddingHorizontal: 16,
    marginVertical: 6,
  },

  description: {
    fontSize: 14,
    lineHeight: 20,
    color: '#111827',
  },

  viewMoreText: {
    color: '#2563EB',
    fontWeight: '700',
    fontSize: 13,
  },

  viewLessBtn: {
    marginTop: 4,
  },

  /* IMAGE */
  postImage: {
    width: screenWidth,
    height: 360,
    backgroundColor: '#000', // prevents white flash
  },

  /* REACTIONS */
  reactionBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: 16,
    marginTop: 6,
  },

  reactionEmoji: {
    fontSize: 26,
  },

  /* COMMENTS */
  commentBox: {
    flexDirection: 'row',
    padding: 12,
  },

  commentInput: {
    flex: 1,
    fontSize: 14,
    color: '#111827',
  },

  postBtn: {
    color: '#2563EB',
    fontWeight: '800',
    marginLeft: 12,
  },

  /* FOOTER */
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },

  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  actionText: {
    marginLeft: 6,
    fontSize: 13,
    fontWeight: '700',
    color: '#6B7280',
  },

  /* MENU */
  menu: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    borderRadius: 10,
    elevation: 4,
  },

  menuItem: {
    flexDirection: 'row',
    padding: 12,
    alignItems: 'center',
  },

  menuText: {
    marginLeft: 10,
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },

  /* MODAL IMAGE */
  modalContainer: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
  },

  fullImage: {
    width: '100%',
    height: '100%',
  },
});

/* TAG COLORS */

const getTagColor = (type) => {
  switch (type) {
    case 'JobScam': return '#FFF3E0';
    case 'Phishing': return '#FFEBEE';
    case 'Deepfake': return '#E3F2FD';
    case 'EmailScam': return '#F3E5F5';
    default: return '#F5F5F5';
  }
};

const getTagTextColor = (type) => {
  switch (type) {
    case 'JobScam': return '#E65100';
    case 'Phishing': return '#C62828';
    case 'Deepfake': return '#0056D2';
    case 'EmailScam': return '#6A1B9A';
    default: return '#666';
  }
};
