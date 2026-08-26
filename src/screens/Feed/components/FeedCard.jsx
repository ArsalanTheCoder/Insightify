import React, { useState, useRef } from 'react';
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
  Pressable,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const screenWidth = Dimensions.get('window').width;
const APP_LOGO = require('../../../../assets/images/insightify.png');
const REACTIONS = ['👍', '❤️', '😮', '😢', '😡', '🎉'];

export default function FeedCard({ post }) {
  const [likesCount, setLikesCount] = useState(post?.likes || 0);
  const [userReaction, setUserReaction] = useState(null);
  const [showReactions, setShowReactions] = useState(false);

  const [commentsList, setCommentsList] = useState(post?.comments || []);
  const [commentsCount, setCommentsCount] = useState(post?.commentsCount || commentsList.length);
  const [showComments, setShowComments] = useState(false);
  const [newCommentText, setNewCommentText] = useState('');

  const [isSaved, setIsSaved] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [imageVisible, setImageVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [imagePressed, setImagePressed] = useState(false);

  const scaleAnim = useRef(new Animated.Value(0)).current;

  const toggleReactionPopover = () => {
    const nextState = !showReactions;
    setShowReactions(nextState);
    if (nextState) {
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }).start();
    }
  };

  const handleSelectReaction = (emoji) => {
    if (!userReaction) {
      setLikesCount((prev) => prev + 1);
    }
    setUserReaction(emoji);
    setShowReactions(false);
  };

  const handleToggleLike = () => {
    if (userReaction) {
      setUserReaction(null);
      setLikesCount((prev) => Math.max(0, prev - 1));
    } else {
      setUserReaction('👍');
      setLikesCount((prev) => prev + 1);
    }
  };

  const handleAddComment = () => {
    if (!newCommentText.trim()) {
      return;
    }
    const newC = {
      id: String(Date.now()),
      user: 'You',
      text: newCommentText.trim(),
      time: 'Just now',
    };
    setCommentsList((prev) => [newC, ...prev]);
    setCommentsCount((prev) => prev + 1);
    setNewCommentText('');
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `🛡️ Insightify Alert: ${post.title}\n\n${post.description}`,
      });
    } catch {}
  };

  const PREVIEW_LENGTH = 90;
  const description = post?.description || '';
  const shouldShowViewMore = description.length > PREVIEW_LENGTH;
  const previewText = shouldShowViewMore ? description.slice(0, PREVIEW_LENGTH).trim() : description;

  const getThreatBadge = (level) => {
    switch (level) {
      case 'CRITICAL':
        return { label: 'CRITICAL', color: '#DC2626', bg: '#FEF2F2', border: '#FECACA' };
      case 'WARNING':
        return { label: 'WARNING', color: '#D97706', bg: '#FEF3C7', border: '#FDE68A' };
      default:
        return { label: 'ADVISORY', color: '#0056D2', bg: '#EFF6FF', border: '#BFDBFE' };
    }
  };

  const threatBadge = getThreatBadge(post.threatLevel);

  return (
    <View style={styles.cardContainer}>
      {/* ── CARD HEADER ── */}
      <View style={styles.header}>
        <View style={styles.userRow}>
          <Image source={APP_LOGO} style={styles.avatar} />
          <View style={styles.userMeta}>
            <View style={styles.nameRow}>
              <Text style={styles.teamName}>Insightify Official</Text>
              <Ionicons name="checkmark-circle" size={14} color="#0056D2" style={styles.verifiedIcon} />
            </View>

            <View style={styles.subMetaRow}>
              <Text style={styles.timeText}>{post.time}</Text>
              <Text style={styles.dot}>•</Text>
              <View style={[styles.threatBadge, { backgroundColor: threatBadge.bg, borderColor: threatBadge.border }]}>
                <Text style={[styles.threatText, { color: threatBadge.color }]}>{threatBadge.label}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.headerRightActions}>
          <TouchableOpacity onPress={() => setIsSaved(!isSaved)} style={styles.actionIconBtn}>
            <Ionicons
              name={isSaved ? 'bookmark' : 'bookmark-outline'}
              size={18}
              color={isSaved ? '#0056D2' : '#64748B'}
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setShowMenu(!showMenu)} style={styles.actionIconBtn}>
            <Ionicons name="ellipsis-horizontal" size={18} color="#64748B" />
          </TouchableOpacity>
        </View>
      </View>

      {/* ── POPUP MENU ── */}
      {showMenu && (
        <View style={styles.dropdownMenu}>
          <TouchableOpacity style={styles.menuItem} onPress={() => { setIsSaved(!isSaved); setShowMenu(false); }}>
            <Ionicons name={isSaved ? 'bookmark' : 'bookmark-outline'} size={16} color="#475569" />
            <Text style={styles.menuText}>{isSaved ? 'Remove Bookmark' : 'Save Alert'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => setShowMenu(false)}>
            <Ionicons name="alert-circle-outline" size={16} color="#DC2626" />
            <Text style={[styles.menuText, styles.menuTextDanger]}>Report Concern</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* ── TITLE ── */}
      <Text style={styles.postTitle}>{post.title}</Text>

      {/* ── DESCRIPTION ── */}
      <View style={styles.descriptionWrapper}>
        <Text style={styles.descriptionText}>
          {!expanded ? previewText : description}
          {shouldShowViewMore && !expanded && <Text style={styles.ellipsis}>... </Text>}
        </Text>

        {shouldShowViewMore && (
          <TouchableOpacity onPress={() => setExpanded(!expanded)} style={styles.viewMoreBtn}>
            <Text style={styles.viewMoreText}>{expanded ? 'Show Less' : 'Read Full Alert'}</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* ── POST IMAGE ── */}
      {post.image && (
        <Pressable
          onPressIn={() => setImagePressed(true)}
          onPressOut={() => setImagePressed(false)}
          onPress={() => setImageVisible(true)}
          style={styles.imagePressable}
        >
          <Image
            source={post.image}
            style={[
              styles.postImage,
              { transform: [{ scale: imagePressed ? 0.985 : 1 }] },
            ]}
          />
          <View style={styles.expandHintBadge}>
            <Ionicons name="expand-outline" size={12} color="#FFF" />
            <Text style={styles.expandHintText}>Expand</Text>
          </View>
        </Pressable>
      )}

      {/* ── ENGAGEMENT METRICS ROW ── */}
      <View style={styles.metricsRow}>
        <View style={styles.metricsLeft}>
          <View style={styles.likeIconBubble}>
            <Ionicons name="thumbs-up" size={10} color="#FFF" />
          </View>
          <Text style={styles.metricsText}>{likesCount} Likes</Text>
        </View>

        <View style={styles.metricsRight}>
          <Text style={styles.metricsText}>{commentsCount} Comments</Text>
          <Text style={styles.dot}>•</Text>
          <Text style={styles.metricsText}>{post.sharesCount || 12} Shares</Text>
        </View>
      </View>

      {/* ── FLOATING REACTION BAR ── */}
      {showReactions && (
        <Animated.View style={[styles.reactionBar, { transform: [{ scale: scaleAnim }] }]}>
          {REACTIONS.map((emoji) => (
            <TouchableOpacity
              key={emoji}
              onPress={() => handleSelectReaction(emoji)}
              style={styles.emojiBtn}
            >
              <Text style={styles.reactionEmoji}>{emoji}</Text>
            </TouchableOpacity>
          ))}
        </Animated.View>
      )}

      {/* ── FOOTER ACTION BUTTONS ── */}
      <View style={styles.footerActions}>
        <TouchableOpacity
          style={styles.footerBtn}
          onPress={handleToggleLike}
          onLongPress={toggleReactionPopover}
        >
          {userReaction ? (
            <Text style={styles.activeEmojiText}>{userReaction}</Text>
          ) : (
            <Ionicons name="thumbs-up-outline" size={18} color="#64748B" />
          )}
          <Text style={[styles.footerBtnText, userReaction && styles.footerBtnTextActive]}>
            {userReaction ? 'Liked' : 'Like'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.footerBtn}
          onPress={() => setShowComments(!showComments)}
        >
          <Ionicons
            name="chatbubble-outline"
            size={18}
            color={showComments ? '#0056D2' : '#64748B'}
          />
          <Text style={[styles.footerBtnText, showComments && styles.footerBtnTextActive]}>
            Comment
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.footerBtn} onPress={handleShare}>
          <Ionicons name="share-social-outline" size={18} color="#64748B" />
          <Text style={styles.footerBtnText}>Share</Text>
        </TouchableOpacity>
      </View>

      {/* ── COMMENTS DRAWER ── */}
      {showComments && (
        <View style={styles.commentsContainer}>
          {/* Input Box */}
          <View style={styles.commentInputRow}>
            <TextInput
              style={styles.commentInput}
              placeholder="Write a community comment..."
              placeholderTextColor="#94A3B8"
              value={newCommentText}
              onChangeText={setNewCommentText}
            />
            <TouchableOpacity
              style={[styles.sendBtn, !newCommentText.trim() && styles.sendBtnDisabled]}
              onPress={handleAddComment}
              disabled={!newCommentText.trim()}
            >
              <Ionicons name="send" size={14} color="#FFF" />
            </TouchableOpacity>
          </View>

          {/* Comments List */}
          {commentsList.map((item) => (
            <View key={item.id} style={styles.commentItem}>
              <View style={styles.commentAvatar}>
                <Text style={styles.commentAvatarText}>{item.user.charAt(0)}</Text>
              </View>
              <View style={styles.commentBubble}>
                <View style={styles.commentHeader}>
                  <Text style={styles.commentUser}>{item.user}</Text>
                  <Text style={styles.commentTime}>{item.time}</Text>
                </View>
                <Text style={styles.commentBody}>{item.text}</Text>
              </View>
            </View>
          ))}
        </View>
      )}

      {/* ── FULLSCREEN IMAGE MODAL ── */}
      <Modal visible={imageVisible} transparent animationType="fade">
        <StatusBar barStyle="light-content" backgroundColor="#000000" />
        <View style={styles.modalOverlay}>
          <TouchableOpacity style={styles.modalCloseBtn} onPress={() => setImageVisible(false)}>
            <Ionicons name="close" size={24} color="#FFF" />
          </TouchableOpacity>
          <Image source={post.image} style={styles.fullImage} resizeMode="contain" />
        </View>
      </Modal>
    </View>
  );
}

/* ─────────────── STYLES ─────────────── */

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    marginHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
  },

  /* HEADER */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    paddingBottom: 12,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 12,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  userMeta: {
    justifyContent: 'center',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  teamName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  verifiedIcon: {
    marginLeft: 4,
  },
  subMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  timeText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
  },
  dot: {
    fontSize: 10,
    color: '#94A3B8',
    marginHorizontal: 6,
  },
  threatBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
  },
  threatText: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.4,
  },

  headerRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actionIconBtn: {
    padding: 6,
    borderRadius: 8,
  },

  /* MENU */
  dropdownMenu: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    elevation: 3,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 10,
  },
  menuText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
  },
  menuTextDanger: {
    color: '#DC2626',
  },

  /* TITLE */
  postTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    paddingHorizontal: 16,
    marginBottom: 6,
    lineHeight: 22,
  },

  /* DESCRIPTION */
  descriptionWrapper: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  descriptionText: {
    fontSize: 13.5,
    color: '#334155',
    lineHeight: 20,
    fontWeight: '500',
  },
  ellipsis: {
    color: '#64748B',
  },
  viewMoreBtn: {
    marginTop: 4,
  },
  viewMoreText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0056D2',
  },

  /* IMAGE */
  imagePressable: {
    position: 'relative',
  },
  postImage: {
    width: screenWidth - 34,
    height: 240,
    backgroundColor: '#F1F5F9',
  },
  expandHintBadge: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'rgba(15,23,42,0.7)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  expandHintText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  /* METRICS */
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  metricsLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  likeIconBubble: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#0056D2',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  metricsRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metricsText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },

  /* REACTION BAR */
  reactionBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 6,
    borderRadius: 24,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  emojiBtn: {
    paddingHorizontal: 6,
  },
  reactionEmoji: {
    fontSize: 22,
  },

  /* FOOTER */
  footerActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 8,
  },
  footerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 6,
  },
  activeEmojiText: {
    fontSize: 16,
  },
  footerBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
  },
  footerBtnTextActive: {
    color: '#0056D2',
  },

  /* COMMENTS */
  commentsContainer: {
    backgroundColor: '#F8FAFC',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    padding: 14,
  },
  commentInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  commentInput: {
    flex: 1,
    fontSize: 13,
    color: '#0F172A',
    height: 40,
  },
  sendBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#0056D2',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  sendBtnDisabled: {
    backgroundColor: '#CBD5E1',
  },
  commentItem: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  commentAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#0056D2',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  commentAvatarText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  commentBubble: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  commentUser: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F172A',
  },
  commentTime: {
    fontSize: 10,
    color: '#94A3B8',
  },
  commentBody: {
    fontSize: 12,
    color: '#334155',
    lineHeight: 17,
  },

  /* MODAL */
  modalOverlay: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCloseBtn: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullImage: {
    width: '100%',
    height: '80%',
  },
});
