import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import type { Conversation, Message, PageProps } from '@/types/models';
import { Head, useForm, usePage } from '@inertiajs/react';
import { formatDistanceToNow } from 'date-fns';
import { Send } from 'lucide-react';
import { FormEventHandler, useEffect, useRef, useState } from 'react';

interface MessagesShowProps {
    conversation: Conversation;
}

export default function MessagesShow({ conversation }: MessagesShowProps) {
    const { auth } = usePage<PageProps>().props;
    const [messages, setMessages] = useState<Message[]>(conversation.messages || []);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const isInitialMount = useRef(true);
    const echoChannelJoined = useRef(false);

    const { data, setData, post, processing, reset } = useForm({
        message: '',
    });

    // Only update messages from props on initial mount or when navigating to different conversation
    useEffect(() => {
        if (isInitialMount.current) {
            setMessages(conversation.messages || []);
            isInitialMount.current = false;
        }
    }, [conversation.id]);

    useEffect(() => {
        console.log('Setting up Echo listener for conversation', conversation.id);

        // Subscribe to the private channel for this conversation
        const channel = window.Echo.private(`conversation.${conversation.id}`);

        // Define the listener function
        const handleNewMessage = (event: { message: Message }) => {
            console.log('New message received via Echo:', event.message);

            // Only add message if it doesn't already exist (prevent duplicates)
            setMessages((prev) => {
                const exists = prev.some((m) => m.id === event.message.id);
                if (exists) {
                    console.log('Message already exists, skipping duplicate');
                    return prev;
                }
                console.log('Adding new message to chat');
                return [...prev, event.message];
            });

            // Scroll to bottom when new message arrives
            setTimeout(() => {
                messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        };

        // Listen for new messages
        channel.listen('.message.sent', handleNewMessage);

        // Cleanup function
        return () => {
            console.log('Cleaning up Echo listener for conversation', conversation.id);
            channel.stopListening('.message.sent', handleNewMessage);
            window.Echo.leave(`private-conversation.${conversation.id}`);
        };
    }, [conversation.id]);

    // Scroll to bottom on initial load and when messages change
    useEffect(() => {
        if (messages.length > 0) {
            messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
        }
    }, [messages.length]);

    const otherParticipant = conversation.participantOne?.id === auth.user?.id ? conversation.participantTwo : conversation.participantOne;

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();

        if (!auth.user || !data.message.trim()) return;

        const messageText = data.message;
        reset(); // Clear input immediately for better UX

        post(`/messages/${conversation.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                console.log('Message sent successfully');
            },
            onError: (errors) => {
                console.error('Failed to send message:', errors);
                // Restore the message text on error
                setData('message', messageText);
            },
        });
    };

    return (
        <AppLayout>
            <Head title={`Chat with ${otherParticipant?.name}`} />

            <div className="container mx-auto max-w-4xl py-8">
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-full">
                                <span className="text-xl font-semibold">{otherParticipant?.name?.charAt(0).toUpperCase()}</span>
                            </div>
                            <CardTitle>{otherParticipant?.name}</CardTitle>
                        </div>
                    </CardHeader>

                    <CardContent>
                        <div className="mb-4 h-[500px] overflow-y-auto pr-4">
                            <div className="space-y-4">
                                {messages.map((message) => {
                                    const isOwn = message.senderId === auth.user?.id;
                                    return (
                                        <div key={message.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                                            <div
                                                className={`max-w-[70%] rounded-lg p-3 ${isOwn ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}
                                            >
                                                <p className="text-sm">{message.body}</p>
                                                <p className="mt-1 text-xs opacity-70">
                                                    {message.createdAt &&
                                                        formatDistanceToNow(new Date(message.createdAt), {
                                                            addSuffix: true,
                                                        })}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                                <div ref={messagesEndRef} />
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="flex gap-2">
                            <Textarea
                                value={data.message}
                                onChange={(e) => setData('message', e.target.value)}
                                placeholder="Rašykite savo žinutę..."
                                className="resize-none"
                                rows={2}
                            />
                            <Button type="submit" disabled={processing || !data.message.trim()}>
                                <Send className="h-4 w-4" />
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
