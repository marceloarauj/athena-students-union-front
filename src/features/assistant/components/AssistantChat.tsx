'use client';

import { useEffect, useRef, useState, KeyboardEvent, ChangeEvent } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { BotMessageSquare, Loader2, Send, Trash2, X } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from '@/lib/utils';
import { useAssistant } from '../hooks/useAssistant';

interface AssistantChatProps {
  institution: string;
}

export function AssistantChat({ institution }: AssistantChatProps) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { messages, loading, sendMessage, clearMessages } = useAssistant(institution);

  useEffect(() => {
    if (open) messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open]);

  const handleSend = async () => {
    const prompt = input.trim();
    if (!prompt || loading) return;
    setInput('');
    resetTextareaHeight();
    await sendMessage(prompt);
  };

  const resetTextareaHeight = () => {
    if (textareaRef.current) textareaRef.current.style.height = '40px';
  };

  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 112)}px`;
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="fixed bottom-20 right-4 z-50 w-[360px] sm:w-[400px] h-[540px] flex flex-col rounded-2xl shadow-2xl border border-border bg-card overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-primary text-white shrink-0">
              <div className="flex items-center gap-2">
                <BotMessageSquare className="w-5 h-5" />
                <span className="font-semibold text-sm">Assistente Athena</span>
              </div>
              <div className="flex items-center gap-1">
                {messages.length > 0 && (
                  <button
                    onClick={clearMessages}
                    disabled={loading}
                    className="p-1.5 rounded-lg hover:bg-white/20 transition-colors disabled:opacity-40"
                    title="Limpar conversa"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => setOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-white/20 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
              {messages.length === 0 && (
                <div className="flex-1 flex flex-col items-center justify-center gap-3 text-muted-foreground text-center px-6 h-full">
                  <BotMessageSquare className="w-10 h-10 opacity-25" />
                  <p className="text-sm leading-relaxed">
                    Olá! Como posso te ajudar hoje?
                  </p>
                </div>
              )}

              {messages.map(message => (
                <div
                  key={message.id}
                  className={cn(
                    'flex flex-col max-w-[86%]',
                    message.role === 'user' ? 'self-end items-end' : 'self-start items-start',
                  )}
                >
                  <div
                    className={cn(
                      'rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed',
                      message.role === 'user'
                        ? 'bg-primary text-white rounded-br-sm'
                        : 'bg-muted text-foreground rounded-bl-sm',
                    )}
                  >
                    {message.role === 'user' ? (
                      <p className="whitespace-pre-wrap">{message.content}</p>
                    ) : (
                      <div className="assistant-markdown">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={{
                            h1: ({ children }) => (
                              <p className="font-bold text-base mb-1.5 mt-2 first:mt-0">{children}</p>
                            ),
                            h2: ({ children }) => (
                              <p className="font-bold text-sm mb-1 mt-2 first:mt-0">{children}</p>
                            ),
                            h3: ({ children }) => (
                              <p className="font-semibold text-sm mb-1 mt-1.5 first:mt-0">{children}</p>
                            ),
                            p: ({ children }) => (
                              <p className="mb-1.5 last:mb-0 leading-relaxed">{children}</p>
                            ),
                            ul: ({ children }) => (
                              <ul className="list-disc pl-4 mb-1.5 space-y-0.5">{children}</ul>
                            ),
                            ol: ({ children }) => (
                              <ol className="list-decimal pl-4 mb-1.5 space-y-0.5">{children}</ol>
                            ),
                            li: ({ children }) => <li className="leading-snug">{children}</li>,
                            strong: ({ children }) => (
                              <strong className="font-semibold">{children}</strong>
                            ),
                            em: ({ children }) => <em className="italic">{children}</em>,
                            code: ({ children, className }) => {
                              const isBlock = Boolean(className?.includes('language-'));
                              return isBlock ? (
                                <code className="block bg-black/10 rounded-lg p-2.5 text-xs font-mono my-1.5 overflow-x-auto whitespace-pre">
                                  {children}
                                </code>
                              ) : (
                                <code className="bg-black/10 rounded px-1 py-0.5 text-xs font-mono">
                                  {children}
                                </code>
                              );
                            },
                            pre: ({ children }) => <>{children}</>,
                            blockquote: ({ children }) => (
                              <blockquote className="border-l-2 border-primary/50 pl-3 my-1.5 opacity-80 italic">
                                {children}
                              </blockquote>
                            ),
                            a: ({ href, children }) => (
                              <a
                                href={href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary underline underline-offset-2 hover:opacity-80"
                              >
                                {children}
                              </a>
                            ),
                            hr: () => <hr className="border-border my-2" />,
                          }}
                        >
                          {message.content || ' '}
                        </ReactMarkdown>
                        {message.streaming && (
                          <span className="inline-block w-1.5 h-3.5 bg-primary/50 animate-pulse rounded-sm align-middle ml-0.5" />
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="shrink-0 border-t border-border p-3 flex items-end gap-2 bg-card">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Digite sua mensagem… (Enter para enviar)"
                disabled={loading}
                rows={1}
                className="flex-1 resize-none bg-muted rounded-xl px-3 py-2 text-sm outline-none border border-transparent focus:border-primary/50 transition-colors disabled:opacity-50 leading-relaxed"
                style={{ minHeight: '40px', maxHeight: '112px' }}
              />
              <button
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className="p-2.5 rounded-xl bg-primary text-white hover:bg-primary-hover transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0 self-end"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating button */}
      <motion.button
        onClick={() => setOpen(prev => !prev)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        className="fixed bottom-4 right-4 z-50 w-14 h-14 rounded-full bg-primary text-white shadow-lg shadow-primary/30 flex items-center justify-center hover:bg-primary-hover transition-colors"
        aria-label={open ? 'Fechar assistente' : 'Abrir assistente'}
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.span
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <X className="w-6 h-6" />
            </motion.span>
          ) : (
            <motion.span
              key="chat"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <BotMessageSquare className="w-6 h-6" />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </>
  );
}
