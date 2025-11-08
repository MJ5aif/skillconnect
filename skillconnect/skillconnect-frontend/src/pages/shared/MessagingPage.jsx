import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { onAuthStateChanged } from 'firebase/auth';
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  where,
} from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { format, formatDistanceToNow } from 'date-fns';
import { FaCheck, FaCheckDouble, FaPaperPlane, FaPaperclip, FaFileAlt } from 'react-icons/fa';
import { HiOutlineSearch } from 'react-icons/hi';
import Navbar from '../../components/Navbar.jsx';
import Footer from '../../components/Footer.jsx';
import { auth, db, storage } from '../../firebase/config.js';

const socketUrl = import.meta.env.VITE_SOCKET_URL ?? 'http://localhost:4000';

const fallbackConversations = [
  {
    id: 'conv-ux-mentor',
    title: 'UX Mentor Lab Cohort',
    type: 'group',
    avatar: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=80&q=60',
    lastMessage: {
      preview: "Great! I'll upload the prototype walkthrough tonight.",
      createdAt: new Date().toISOString(),
    },
    unreadCount: 2,
    participants: ['demo-mentor', 'learner-01', 'learner-02'],
    status: 'online',
  },
  {
    id: 'conv-ayesha',
    title: 'Ayesha Rahman',
    type: 'direct',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=80&q=60',
    lastMessage: {
      preview: 'Thanks for the feedback! Updated slides attached.',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    },
    unreadCount: 0,
    participants: ['demo-mentor', 'learner-01'],
    status: 'offline',
    lastSeen: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
  },
];

const fallbackMessages = {
  'conv-ux-mentor': [
    {
      id: 'msg-1',
      senderId: 'learner-01',
      senderName: 'Ayesha Rahman',
      text: 'Can we review my redesign tomorrow?',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
      status: 'read',
      conversationId: 'conv-ux-mentor',
    },
    {
      id: 'msg-2',
      senderId: 'demo-mentor',
      senderName: 'You',
      text: 'Absolutely! I have a slot at 8 PM. Adding docs in a bit.',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5.5).toISOString(),
      status: 'read',
      conversationId: 'conv-ux-mentor',
    },
    {
      id: 'msg-3',
      senderId: 'demo-mentor',
      senderName: 'You',
      fileUrl: 'https://filesamples.com/samples/document/pdf/sample1.pdf',
      fileName: 'UX_critique.pdf',
      fileType: 'application/pdf',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
      status: 'read',
      conversationId: 'conv-ux-mentor',
    },
  ],
  'conv-ayesha': [
    {
      id: 'msg-4',
      senderId: 'demo-mentor',
      senderName: 'You',
      text: 'Loved your updated hero section. Great hierarchy!',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
      status: 'delivered',
      conversationId: 'conv-ayesha',
    },
    {
      id: 'msg-5',
      senderId: 'learner-01',
      senderName: 'Ayesha Rahman',
      text: 'Thanks! Do you think the CTA copy works?',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3.8).toISOString(),
      status: 'delivered',
      conversationId: 'conv-ayesha',
    },
  ],
};

function MessagingPage() {
  const [currentUser, setCurrentUser] = useState(() => auth.currentUser);
  const [conversations, setConversations] = useState(fallbackConversations);
  const [messageMap, setMessageMap] = useState(fallbackMessages);
  const [activeConversationId, setActiveConversationId] = useState(fallbackConversations[0]?.id ?? null);
  const [searchTerm, setSearchTerm] = useState('');
  const [messageDraft, setMessageDraft] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [typingStatus, setTypingStatus] = useState({});
  const [connectionReady, setConnectionReady] = useState(false);
  const socketRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const messageListRef = useRef(null);
  const activeConversationRef = useRef(activeConversationId);

  useEffect(() => {
    activeConversationRef.current = activeConversationId;
  }, [activeConversationId]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user ?? null);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const loadConversations = async () => {
      if (!currentUser) {
        setConversations(fallbackConversations);
        return;
      }

      try {
        const conversationsRef = collection(db, 'conversations');
        const conversationsQuery = query(conversationsRef, where('participantIds', 'array-contains', currentUser.uid));
        const snapshot = await getDocs(conversationsQuery);

        if (snapshot.empty) {
          setConversations(fallbackConversations);
          return;
        }

        const fetchedConversations = snapshot.docs.map((docSnapshot) => {
          const data = docSnapshot.data();
          return {
            id: docSnapshot.id,
            title: data.title ?? 'Conversation',
            type: data.type ?? 'direct',
            avatar: data.avatarUrl ?? null,
            lastMessage: data.lastMessage ?? null,
            unreadCount: data.unreadCounts?.[currentUser.uid] ?? 0,
            participants: data.participantIds ?? [],
            status: data.status ?? 'offline',
            lastSeen: data.lastSeen,
          };
        });

        setConversations(fetchedConversations);
        if (!activeConversationId && fetchedConversations.length > 0) {
          setActiveConversationId(fetchedConversations[0].id);
        }
      } catch (error) {
        console.error('Failed to load conversations:', error);
        setConversations(fallbackConversations);
      }
    };

    loadConversations();
  }, [activeConversationId, currentUser]);

  useEffect(() => {
    const loadMessages = async () => {
      if (!activeConversationId) {
        return;
      }

      try {
        const messagesRef = collection(db, 'conversations', activeConversationId, 'messages');
        const messagesQuery = query(messagesRef, orderBy('createdAt', 'asc'));
        const snapshot = await getDocs(messagesQuery);

        if (snapshot.empty) {
          setMessageMap((prev) => ({ ...prev, [activeConversationId]: fallbackMessages[activeConversationId] ?? [] }));
          return;
        }

        const fetchedMessages = snapshot.docs.map((docSnapshot) => {
          const data = docSnapshot.data();
          return {
            id: docSnapshot.id,
            senderId: data.senderId,
            senderName: data.senderName ?? 'Learner',
            text: data.text ?? null,
            fileUrl: data.fileUrl ?? null,
            fileName: data.fileName ?? null,
            fileType: data.fileType ?? null,
            createdAt: data.createdAt?.toDate?.().toISOString?.() ?? new Date().toISOString(),
            status: data.status ?? 'delivered',
            conversationId: activeConversationId,
          };
        });

        setMessageMap((prev) => ({ ...prev, [activeConversationId]: fetchedMessages }));
      } catch (error) {
        console.error('Failed to load messages:', error);
        setMessageMap((prev) => ({ ...prev, [activeConversationId]: fallbackMessages[activeConversationId] ?? [] }));
      }
    };

    loadMessages();
  }, [activeConversationId]);

  useEffect(() => {
    if (!currentUser) {
      return;
    }

    const socket = io(socketUrl, {
      autoConnect: true,
      auth: { token: currentUser.accessToken, userId: currentUser.uid },
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      setConnectionReady(true);
    });

    socket.on('disconnect', () => {
      setConnectionReady(false);
    });

    socket.on('receiveMessage', (payload) => {
      const conversationId = payload.conversationId;
      const incomingMessage = {
        id: payload.id ?? `${Date.now()}`,
        senderId: payload.senderId,
        senderName: payload.senderName ?? 'Learner',
        text: payload.text ?? null,
        fileUrl: payload.fileUrl ?? null,
        fileName: payload.fileName ?? null,
        fileType: payload.fileType ?? null,
        createdAt: payload.createdAt ?? new Date().toISOString(),
        status: payload.senderId === currentUser.uid ? 'delivered' : 'unread',
        conversationId,
      };

      appendMessage(conversationId, incomingMessage);

      if (activeConversationRef.current === conversationId) {
        socket.emit('markAsRead', {
          conversationId,
          userId: currentUser.uid,
        });
      }
    });

    socket.on('typing', ({ conversationId, senderId, senderName, isTyping }) => {
      if (senderId === currentUser.uid) {
        return;
      }

      setTypingStatus((prev) => ({
        ...prev,
        [conversationId]: isTyping ? senderName ?? 'Someone' : null,
      }));
    });

    socket.on('messagesRead', ({ conversationId, messageIds }) => {
      setMessageMap((prev) => {
        const existing = prev[conversationId];
        if (!existing) {
          return prev;
        }
        const updated = existing.map((message) =>
          messageIds.includes(message.id) ? { ...message, status: 'read' } : message,
        );
        return { ...prev, [conversationId]: updated };
      });
    });

    return () => {
      socket.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  const appendMessage = useCallback(
    (conversationId, message) => {
      setMessageMap((prev) => {
        const existing = prev[conversationId] ?? [];
        return {
          ...prev,
          [conversationId]: [...existing, message],
        };
      });

      setConversations((prev) =>
        prev.map((conversation) => {
          if (conversation.id !== conversationId) {
            return conversation;
          }

          const isIncoming = message.senderId !== currentUser?.uid;
          const updatedUnread = activeConversationRef.current === conversationId || !isIncoming
            ? 0
            : (conversation.unreadCount ?? 0) + 1;

          return {
            ...conversation,
            lastMessage: {
              preview: message.text ?? message.fileName ?? 'Attachment',
              createdAt: message.createdAt,
            },
            unreadCount: updatedUnread,
          };
        }),
      );
    },
    [currentUser?.uid],
  );

  useEffect(() => {
    if (!messageListRef.current) {
      return;
    }

    messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
  }, [activeConversationId, messageMap]);

  const filteredConversations = useMemo(() => {
    const normalized = searchTerm.trim().toLowerCase();
    if (!normalized) {
      return conversations;
    }

    return conversations.filter((conversation) =>
      conversation.title.toLowerCase().includes(normalized) ||
      conversation.lastMessage?.preview?.toLowerCase().includes(normalized),
    );
  }, [conversations, searchTerm]);

  const selectedConversation = useMemo(
    () => conversations.find((conversation) => conversation.id === activeConversationId) ?? null,
    [activeConversationId, conversations],
  );

  const currentMessages = messageMap[activeConversationId] ?? [];

  const handleMessageChange = (event) => {
    setMessageDraft(event.target.value);
    autoResizeTextArea(event.target);
    emitTypingEvent(true);
  };

  const autoResizeTextArea = (textarea) => {
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  const emitTypingEvent = (isTyping) => {
    const socket = socketRef.current;
    if (!socket || !currentUser || !activeConversationId || !connectionReady) {
      return;
    }

    socket.emit(isTyping ? 'startTyping' : 'stopTyping', {
      conversationId: activeConversationId,
      userId: currentUser.uid,
      senderName: currentUser.displayName ?? 'You',
    });

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    if (isTyping) {
      typingTimeoutRef.current = setTimeout(() => emitTypingEvent(false), 2000);
    }
  };

  const sendMessage = async (overrides = {}) => {
    if (!currentUser || !activeConversationId) {
      return;
    }

    const trimmed = overrides.text ?? messageDraft.trim();
    const hasFile = Boolean(overrides.fileUrl);

    if (!trimmed && !hasFile) {
      return;
    }

    const localId = `local-${Date.now()}`;
    const messagePayload = {
      id: localId,
      conversationId: activeConversationId,
      senderId: currentUser.uid,
      senderName: currentUser.displayName ?? 'You',
      text: trimmed || null,
      fileUrl: overrides.fileUrl ?? null,
      fileName: overrides.fileName ?? null,
      fileType: overrides.fileType ?? null,
      createdAt: new Date().toISOString(),
      status: 'sending',
    };

    appendMessage(activeConversationId, messagePayload);
    setMessageDraft('');

    const messageData = {
      ...messagePayload,
      status: 'sent',
    };

    const socket = socketRef.current;
    if (socket && connectionReady) {
      socket.emit('sendMessage', messageData);
    }

    try {
      await addDoc(collection(db, 'conversations', activeConversationId, 'messages'), {
        senderId: messageData.senderId,
        senderName: messageData.senderName,
        text: messageData.text,
        fileUrl: messageData.fileUrl,
        fileName: messageData.fileName,
        fileType: messageData.fileType,
        createdAt: serverTimestamp(),
        status: 'sent',
      });

      await addDoc(collection(db, 'conversations', activeConversationId, 'activityLogs'), {
        type: 'message',
        createdAt: serverTimestamp(),
        actorId: currentUser.uid,
      });
    } catch (error) {
      console.error('Failed to persist message:', error);
    }
  };

  const handleFileUpload = async (event) => {
    const [file] = event.target.files ?? [];
    if (!file || !currentUser || !activeConversationId) {
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    const storagePath = `chat_uploads/${currentUser.uid}/${Date.now()}-${file.name}`;
    const storageRef = ref(storage, storagePath);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        setUploadProgress(progress);
      },
      (error) => {
        console.error('File upload failed:', error);
        setIsUploading(false);
      },
      async () => {
        try {
          const fileUrl = await getDownloadURL(uploadTask.snapshot.ref);
          await sendMessage({
            fileUrl,
            fileName: file.name,
            fileType: file.type,
          });
        } finally {
          setIsUploading(false);
          setUploadProgress(0);
        }
      },
    );
  };

  const markConversationAsRead = useCallback(() => {
    if (!currentUser || !activeConversationId) {
      return;
    }

    setConversations((prev) =>
      prev.map((conversation) =>
        conversation.id === activeConversationId
          ? {
              ...conversation,
              unreadCount: 0,
            }
          : conversation,
      ),
    );

    const socket = socketRef.current;
    if (socket && connectionReady) {
      socket.emit('markAsRead', {
        conversationId: activeConversationId,
        userId: currentUser.uid,
      });
    }
  }, [activeConversationId, connectionReady, currentUser]);

  useEffect(() => {
    markConversationAsRead();
  }, [activeConversationId, markConversationAsRead]);

  const renderMessageBubble = (message) => {
    const isOwnMessage = message.senderId === currentUser?.uid;
    const bubbleClasses = isOwnMessage
      ? 'ml-auto bg-blue-600 text-white'
      : 'mr-auto bg-gray-200 text-gray-900';

    return (
      <div key={message.id} className={`flex max-w-xl flex-col gap-1 ${isOwnMessage ? 'items-end' : 'items-start'}`}>
        <div className={`w-full rounded-2xl px-4 py-3 text-sm shadow ${bubbleClasses}`}>
          {message.text && <p className="whitespace-pre-wrap break-words">{message.text}</p>}

          {message.fileUrl && (
            <div className="mt-3 rounded-xl bg-white/10 p-3 text-sm">
              {message.fileType?.startsWith('image/') ? (
                <a href={message.fileUrl} target="_blank" rel="noopener noreferrer">
                  <img
                    src={message.fileUrl}
                    alt={message.fileName ?? 'Shared file'}
                    className="max-h-48 rounded-xl object-cover"
                  />
                </a>
              ) : (
                <a
                  href={message.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-xl bg-white/20 px-3 py-2 text-left"
                >
                  <FaFileAlt className="h-5 w-5" />
                  <div>
                    <p className="text-xs font-semibold">{message.fileName ?? 'Download file'}</p>
                    <p className="text-[11px] opacity-70">{message.fileType ?? 'Attachment'}</p>
                  </div>
                </a>
              )}
            </div>
          )}
        </div>
        <div className="flex items-center gap-1 text-[11px] text-gray-400">
          <span>{format(new Date(message.createdAt), 'p')}</span>
          {isOwnMessage && <ReadReceipt status={message.status} />}
        </div>
      </div>
    );
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Navbar />
      <div className="mx-auto flex w-full max-w-7xl flex-1 gap-6 px-4 py-10 sm:px-6 lg:px-8">
        <aside className="flex w-80 shrink-0 flex-col overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-xl">
          <div className="border-b border-gray-100 p-4">
            <div className="flex items-center gap-2 rounded-full bg-gray-100 px-3 py-2">
              <HiOutlineSearch className="h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search conversations"
                className="w-full bg-transparent text-sm text-gray-600 outline-none"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {filteredConversations.map((conversation) => (
              <button
                key={conversation.id}
                type="button"
                onClick={() => setActiveConversationId(conversation.id)}
                className={`flex w-full items-center gap-3 border-b border-gray-50 px-4 py-4 text-left transition hover:bg-blue-50 ${
                  activeConversationId === conversation.id ? 'bg-blue-50' : ''
                }`}
              >
                <img
                  src={conversation.avatar ?? 'https://placehold.co/56x56'}
                  alt={conversation.title}
                  className="h-12 w-12 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-gray-900">{conversation.title}</p>
                    <span className="text-[11px] text-gray-400">
                      {conversation.lastMessage?.createdAt
                        ? format(new Date(conversation.lastMessage.createdAt), 'p')
                        : ''}
                    </span>
                  </div>
                  <p className="mt-1 line-clamp-1 text-xs text-gray-500">
                    {conversation.lastMessage?.preview ?? 'Start a conversation'}
                  </p>
                </div>
                {conversation.unreadCount > 0 && (
                  <span className="rounded-full bg-blue-600 px-2.5 py-0.5 text-[11px] font-semibold text-white">
                    {conversation.unreadCount}
                  </span>
                )}
              </button>
            ))}
          </div>
        </aside>

        <section className="flex flex-1 flex-col overflow-hidden rounded-3xl bg-white shadow-xl">
          {selectedConversation ? (
            <>
              <div className="flex items-center gap-3 border-b border-gray-100 bg-white px-6 py-4">
                <img
                  src={selectedConversation.avatar ?? 'https://placehold.co/64x64'}
                  alt={selectedConversation.title}
                  className="h-12 w-12 rounded-full object-cover"
                />
                <div>
                  <p className="text-sm font-semibold text-gray-900">{selectedConversation.title}</p>
                  <p className="text-xs text-gray-500">
                    {typingStatus[activeConversationId]
                      ? `${typingStatus[activeConversationId]} is typing...`
                      : selectedConversation.status === 'online'
                      ? 'Online'
                      : selectedConversation.lastSeen
                      ? `Last seen ${formatDistanceToNow(new Date(selectedConversation.lastSeen))} ago`
                      : 'Offline'}
                  </p>
                </div>
              </div>

              <div ref={messageListRef} className="flex-1 space-y-4 overflow-y-auto bg-gray-50 px-6 py-6">
                {currentMessages.length === 0 ? (
                  <div className="flex h-full items-center justify-center text-sm font-semibold text-gray-400">
                    No messages yet. Say hello!
                  </div>
                ) : (
                  currentMessages.map((message) => renderMessageBubble(message))
                )}
              </div>

              <div className="border-t border-gray-100 bg-white p-4">
                {isUploading && (
                  <div className="mb-3 rounded-2xl border border-dashed border-gray-300 p-3 text-xs text-gray-500">
                    Uploading attachment... {uploadProgress}%
                  </div>
                )}
                <div className="flex items-end gap-3">
                  <label className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-gray-100 text-gray-500 transition hover:bg-gray-200">
                    <FaPaperclip />
                    <input type="file" className="hidden" onChange={handleFileUpload} />
                  </label>
                  <textarea
                    rows={1}
                    value={messageDraft}
                    onChange={handleMessageChange}
                    onBlur={() => emitTypingEvent(false)}
                    placeholder="Type a message..."
                    className="max-h-40 flex-1 resize-none rounded-2xl bg-gray-100 px-4 py-3 text-sm text-gray-700 focus:bg-white focus:outline focus:outline-2 focus:outline-blue-500"
                  />
                  {messageDraft.trim() && (
                    <button
                      type="button"
                      onClick={() => sendMessage({ text: messageDraft.trim() })}
                      className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg transition hover:bg-blue-700"
                    >
                      <FaPaperPlane />
                    </button>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-1 items-center justify-center text-sm font-semibold text-gray-400">
              Select a conversation to get started.
            </div>
          )}
        </section>
      </div>
      <Footer />
    </div>
  );
}

function ReadReceipt({ status }) {
  if (status === 'read') {
    return <FaCheckDouble className="h-3 w-3 text-teal-500" />;
  }

  if (status === 'delivered') {
    return <FaCheckDouble className="h-3 w-3 text-gray-400" />;
  }

  return <FaCheck className="h-3 w-3 text-gray-400" />;
}

export default MessagingPage;
