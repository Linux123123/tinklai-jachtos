import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { Conversation, PageProps } from '@/types/models';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { formatDistanceToNow } from 'date-fns';
import { Clock, MessageSquare, Send } from 'lucide-react';
import { FormEventHandler } from 'react';

interface MessagesIndexProps {
    conversations: {
        data: Conversation[];
    };
    recipient?: {
        id: number;
        name: string;
        email: string;
    } | null;
}

export default function MessagesIndex({ conversations, recipient }: MessagesIndexProps) {
    const { auth } = usePage<PageProps>().props;
    const hasConversations = conversations.data.length > 0;

    const { data, setData, post, processing, errors } = useForm({
        recipient_id: recipient?.id || 0,
        message: '',
    });

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/messages', {
            preserveScroll: true,
        });
    };

    return (
        <AppLayout>
            <Head title="Žinutės" />

            <div className="container mx-auto py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold">Žinutės</h1>
                    <p className="text-muted-foreground mt-1">Jūsų pokalbiai su jachtų savininkais ir nuomininkais</p>
                </div>

                {recipient && (
                    <Card className="mb-6">
                        <CardHeader>
                            <CardTitle>Pradėti pokalbį su {recipient.name}</CardTitle>
                            <CardDescription>Siųsti pirmą žinutę jachtos savininkui</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit}>
                                <div className="space-y-4">
                                    <div>
                                        <Label htmlFor="message">Žinutė</Label>
                                        <Textarea
                                            id="message"
                                            value={data.message}
                                            onChange={(e) => setData('message', e.target.value)}
                                            placeholder="Rašykite savo žinutę čia..."
                                            rows={4}
                                            className="mt-1"
                                        />
                                        {errors.message && <p className="text-destructive mt-1 text-sm">{errors.message}</p>}
                                    </div>
                                    <div className="flex justify-end gap-2">
                                        <Button type="button" variant="outline" onClick={() => router.visit('/messages')}>
                                            Atšaukti
                                        </Button>
                                        <Button type="submit" disabled={processing || !data.message.trim()}>
                                            <Send className="mr-2 h-4 w-4" />
                                            Siųsti žinutę
                                        </Button>
                                    </div>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                )}

                {!hasConversations ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <MessageSquare className="text-muted-foreground mb-4 h-16 w-16" />
                            <h3 className="mb-2 text-xl font-semibold">Kol kas žinučių nėra</h3>
                            <p className="text-muted-foreground mb-4 max-w-md text-center">
                                Pradėkite pokalbį su jachtos savininku apsilankę jachtos skelbime ir paspaudę „Susisiekti su savininku"
                            </p>
                            <Button asChild>
                                <Link href="/">Naršyti jachtas</Link>
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {conversations.data.map((conversation) => {
                            const otherParticipant =
                                conversation.participantOne?.id === auth.user?.id ? conversation.participantTwo : conversation.participantOne;
                            const lastMessage = conversation.messages?.[0];
                            const isUnread = lastMessage && !lastMessage.readAt && lastMessage.senderId !== auth.user?.id;

                            return (
                                <Link key={conversation.id} href={`/messages/${conversation.id}`}>
                                    <Card className="cursor-pointer transition-shadow hover:shadow-md">
                                        <CardHeader>
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <CardTitle className="flex items-center gap-2">
                                                        <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full">
                                                            <span className="text-lg font-semibold">
                                                                {otherParticipant?.name?.charAt(0).toUpperCase()}
                                                            </span>
                                                        </div>
                                                        <div>
                                                            {otherParticipant?.name}
                                                            {isUnread && (
                                                                <Badge variant="default" className="ml-2">
                                                                    Nauja
                                                                </Badge>
                                                            )}
                                                        </div>
                                                    </CardTitle>
                                                    {lastMessage && (
                                                        <CardDescription className="mt-2">
                                                            <p className="line-clamp-2">{lastMessage.body}</p>
                                                            <div className="mt-1 flex items-center gap-1 text-xs">
                                                                <Clock className="h-3 w-3" />
                                                                {formatDistanceToNow(new Date(lastMessage.createdAt), { addSuffix: true })}
                                                            </div>
                                                        </CardDescription>
                                                    )}
                                                </div>
                                            </div>
                                        </CardHeader>
                                    </Card>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
