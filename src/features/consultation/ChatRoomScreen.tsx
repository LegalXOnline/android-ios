import * as DocumentPicker from 'expo-document-picker';
import * as Linking from 'expo-linking';
import { SymbolView } from 'expo-symbols';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  attachmentUrl,
  endConsultation,
  getMessages,
  sendMessage,
  uploadChatAttachment,
  type ChatMessage,
} from '@services/consultations.service';
import { useGoBack } from '@shared/hooks/useGoBack';
import { useKeyboardHeight } from '@shared/hooks/useKeyboardHeight';
import { LX, LXShape, LXType } from '@theme';

/** How often the transcript is re-read. Matches the website's chat room. */
const POLL_MS = 4000;

function clockFrom(startedAt: string | null, endedAt: string | null, now: number): number {
  if (!startedAt) return 0;
  const end = endedAt ? new Date(endedAt).getTime() : now;
  return Math.max(0, Math.floor((end - new Date(startedAt).getTime()) / 1000));
}

function mmss(total: number): string {
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export function ChatRoomScreen({
  consultationId,
  counterpartName,
  feePerMinute,
}: {
  consultationId: string;
  counterpartName?: string;
  feePerMinute?: number | null;
}) {
  const insets = useSafeAreaInsets();
  const keyboard = useKeyboardHeight();
  const goBack = useGoBack('/(tabs)/talk-to-lawyer');
  const listRef = useRef<FlatList<ChatMessage>>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [selfId, setSelfId] = useState('');
  const [status, setStatus] = useState('');
  const [startedAt, setStartedAt] = useState<string | null>(null);
  const [endedAt, setEndedAt] = useState<string | null>(null);

  const [draft, setDraft] = useState('');
  const [sending, setSending] = useState(false);
  const [attaching, setAttaching] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [now, setNow] = useState(() => Date.now());

  const ended = Boolean(endedAt) || status === 'completed' || status === 'cancelled';

  // Polled rather than pushed: the transcript is the row, and a poll that
  // misses once recovers on the next tick. A dropped socket does not.
  useEffect(() => {
    let cancelled = false;

    const read = async () => {
      try {
        const state = await getMessages(consultationId);
        if (cancelled) return;
        setMessages(state.messages);
        setSelfId(state.selfId);
        setStatus(state.status);
        setStartedAt(state.startedAt);
        setEndedAt(state.endedAt);
        setError(null);
      } catch (err) {
        if (!cancelled) setError((err as Error).message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void read();
    const timer = setInterval(read, POLL_MS);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, [consultationId]);

  // The clock runs off the server's started_at, never a local start time, so
  // both sides of the call show the same number.
  useEffect(() => {
    if (!startedAt || ended) return;
    const tick = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(tick);
  }, [startedAt, ended]);

  const elapsed = clockFrom(startedAt, endedAt, now);
  const cost = startedAt && feePerMinute ? Math.max(1, Math.ceil(elapsed / 60)) * feePerMinute : null;

  const send = useCallback(async () => {
    const content = draft.trim();
    if (!content || sending || ended) return;

    setDraft('');
    setSending(true);
    try {
      const { message } = await sendMessage(consultationId, { content });
      setMessages((prev) => (prev.some((m) => m.id === message.id) ? prev : [...prev, message]));
    } catch (err) {
      setDraft(content);
      setError((err as Error).message);
    } finally {
      setSending(false);
    }
  }, [draft, sending, ended, consultationId]);

  /**
   * Sends a document into the conversation.
   *
   * Uploaded through the same endpoint the service checklist uses, so the file
   * lands in the private client-docs bucket and the message carries only its
   * path — the transcript never holds a URL that would outlive its signature.
   */
  const attach = useCallback(async () => {
    if (attaching || sending || ended) return;

    const res = await DocumentPicker.getDocumentAsync({
      type: ['image/jpeg', 'image/png', 'application/pdf'],
      copyToCacheDirectory: true,
    });
    if (res.canceled || !res.assets?.[0]) return;

    const asset = res.assets[0];
    setAttaching(true);
    setError(null);
    try {
      const up = await uploadChatAttachment(consultationId, {
        uri: asset.uri,
        name: asset.name || 'document',
        type: asset.mimeType || 'application/pdf',
      });

      const { message } = await sendMessage(consultationId, {
        attachmentUrl: up.path,
        attachmentName: up.name,
        attachmentSize: up.size,
      });
      setMessages((prev) => (prev.some((m) => m.id === message.id) ? prev : [...prev, message]));
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setAttaching(false);
    }
  }, [attaching, sending, ended, consultationId]);

  const openAttachment = useCallback(
    async (path: string) => {
      try {
        await Linking.openURL(await attachmentUrl(consultationId, path));
      } catch (err) {
        setError((err as Error).message);
      }
    },
    [consultationId],
  );

  const finish = async () => {
    try {
      await endConsultation(consultationId);
      setEndedAt(new Date().toISOString());
      setStatus('completed');
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <View style={styles.bar}>
        <Pressable onPress={goBack} hitSlop={12} accessibilityLabel="Back" style={styles.barBtn}>
          <SymbolView
            name={{ ios: 'chevron.left', android: 'arrow_back', web: 'arrow_back' }}
            size={20}
            tintColor={LX.ink}
          />
        </Pressable>

        <View style={styles.barText}>
          <Text style={styles.barTitle} numberOfLines={1}>
            {counterpartName || 'Consultation'}
          </Text>
          <Text style={styles.barMeta}>
            {ended
              ? `Ended · ${mmss(elapsed)}`
              : startedAt
                ? `${mmss(elapsed)}${cost !== null ? ` · ₹${cost}` : ''}`
                : 'Waiting for the advocate to join'}
          </Text>
        </View>

        {!ended && (
          <Pressable onPress={finish} accessibilityRole="button" style={styles.endBtn}>
            <Text style={styles.endLabel}>End</Text>
          </Pressable>
        )}
      </View>

      {loading ? (
        <View style={styles.centre}>
          <ActivityIndicator color={LX.gold} size="large" />
        </View>
      ) : (
        <View style={[styles.flex, { paddingBottom: keyboard }]}>
          <FlatList
            ref={listRef}
            data={messages}
            keyExtractor={(m) => m.id}
            contentContainerStyle={styles.list}
            onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
            ListEmptyComponent={
              <Text style={styles.empty}>
                No messages yet. Describe your situation and the advocate will reply here.
              </Text>
            }
            renderItem={({ item }) => {
              const mine = item.sender_id === selfId;
              return (
                <View style={[styles.row, mine ? styles.rowMine : styles.rowTheirs]}>
                  <View style={[styles.bubble, mine ? styles.bubbleMine : styles.bubbleTheirs]}>
                    {item.content && (
                      <Text style={[styles.msg, mine && styles.msgMine]}>{item.content}</Text>
                    )}
                    {item.attachment_name && (
                      <Pressable
                        onPress={() =>
                          item.attachment_url && void openAttachment(item.attachment_url)
                        }
                        accessibilityRole="button"
                        accessibilityLabel={`Open ${item.attachment_name}`}
                        style={styles.attachRow}
                      >
                        <SymbolView
                          name={{ ios: 'paperclip', android: 'attach_file', web: 'attach_file' }}
                          size={14}
                          tintColor={mine ? LX.onGold : LX.inkMuted}
                        />
                        <Text style={[styles.attachment, mine && styles.msgMine]}>
                          {item.attachment_name}
                        </Text>
                      </Pressable>
                    )}
                    <Text style={[styles.time, mine && styles.timeMine]}>
                      {new Date(item.created_at).toLocaleTimeString('en-IN', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </Text>
                  </View>
                </View>
              );
            }}
          />

          {error && (
            <Text style={styles.error} accessibilityRole="alert">
              {error}
            </Text>
          )}

          {ended ? (
            <View style={[styles.endedBar, { paddingBottom: (keyboard ? 0 : insets.bottom) + 12 }]}>
              <Text style={styles.endedText}>
                This consultation has ended{cost !== null ? ` · ₹${cost} charged` : ''}.
              </Text>
            </View>
          ) : (
            <View style={[styles.composer, { paddingBottom: (keyboard ? 0 : insets.bottom) + 10 }]}>
              <Pressable
                onPress={attach}
                disabled={attaching || sending}
                accessibilityRole="button"
                accessibilityLabel="Attach a document"
                style={[styles.attach, attaching && styles.sendOff]}
              >
                {attaching ? (
                  <ActivityIndicator color={LX.gold} size="small" />
                ) : (
                  <SymbolView
                    name={{ ios: 'paperclip', android: 'attach_file', web: 'attach_file' }}
                    size={20}
                    tintColor={LX.inkMuted}
                  />
                )}
              </Pressable>
              <TextInput
                value={draft}
                onChangeText={setDraft}
                placeholder="Write a message"
                placeholderTextColor={LX.inkFaint}
                style={styles.input}
                multiline
                maxLength={4000}
                onSubmitEditing={send}
              />
              <Pressable
                onPress={send}
                disabled={!draft.trim() || sending}
                accessibilityRole="button"
                accessibilityLabel="Send message"
                style={[styles.send, (!draft.trim() || sending) && styles.sendOff]}
              >
                <SymbolView
                  name={{ ios: 'arrow.up', android: 'arrow_upward', web: 'arrow_upward' }}
                  size={18}
                  tintColor={LX.onGold}
                />
              </Pressable>
            </View>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: LX.bg },
  flex: { flex: 1 },
  centre: { flex: 1, alignItems: 'center', justifyContent: 'center' },

  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    height: 56,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: LX.border,
    backgroundColor: LX.surface,
  },
  barBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  barText: { flex: 1 },
  barTitle: { ...LXType.titleSmall, color: LX.ink },
  barMeta: { ...LXType.bodySmall, fontSize: 12, color: LX.inkMuted },
  endBtn: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: LXShape.full,
    backgroundColor: LX.dangerSoft,
  },
  endLabel: { ...LXType.label, fontSize: 13, color: LX.danger },

  list: { padding: 14, gap: 8, flexGrow: 1 },
  empty: {
    ...LXType.bodySmall,
    color: LX.inkFaint,
    textAlign: 'center',
    marginTop: 40,
    paddingHorizontal: 30,
  },
  row: { flexDirection: 'row' },
  rowMine: { justifyContent: 'flex-end' },
  rowTheirs: { justifyContent: 'flex-start' },
  bubble: { maxWidth: '82%', borderRadius: LXShape.md, paddingHorizontal: 13, paddingVertical: 9, gap: 3 },
  bubbleMine: { backgroundColor: LX.gold, borderBottomRightRadius: 4 },
  bubbleTheirs: { backgroundColor: LX.surface, borderWidth: 1, borderColor: LX.border, borderBottomLeftRadius: 4 },
  msg: { ...LXType.body, color: LX.ink },
  msgMine: { color: LX.onGold },
  attachment: { ...LXType.bodySmall, color: LX.inkMuted, textDecorationLine: 'underline' },
  attachRow: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 2 },
  attach: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  time: { ...LXType.bodySmall, fontSize: 10.5, color: LX.inkFaint, alignSelf: 'flex-end' },
  timeMine: { color: LX.onGold, opacity: 0.7 },

  error: { ...LXType.bodySmall, color: LX.danger, paddingHorizontal: 16, paddingBottom: 6 },

  composer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 10,
    paddingHorizontal: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: LX.border,
    backgroundColor: LX.surface,
  },
  input: {
    flex: 1,
    maxHeight: 120,
    minHeight: 44,
    paddingHorizontal: 16,
    paddingVertical: 11,
    borderRadius: LXShape.xl,
    backgroundColor: LX.surfaceSunken,
    ...LXType.body,
    color: LX.ink,
  },
  send: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: LX.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendOff: { opacity: 0.4 },

  endedBar: {
    paddingHorizontal: 16,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: LX.border,
    backgroundColor: LX.surface,
  },
  endedText: { ...LXType.bodySmall, color: LX.inkMuted, textAlign: 'center' },
});
