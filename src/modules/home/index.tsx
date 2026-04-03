import { Conversation, ConversationContent, ConversationEmptyState, ConversationScrollButton } from "@/components/ai-elements/conversation";
import { Message, MessageContent } from "@/components/ai-elements/message";
import { PromptInput, PromptInputBody, PromptInputFooter, PromptInputSubmit, PromptInputTextarea } from "@/components/ai-elements/prompt-input";
import { GeminiService } from "@/service/gemini";
import { BotMessageSquare, LoaderCircle } from "lucide-react";
import { useState } from "react";

type ChatMessage = {
    id: string;
    role: "user" | "assistant";
    content: string;
};

export const Home = () => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async ({ text }: { text: string }) => {
        const prompt = text.trim();

        if (!prompt || isLoading) {
            return;
        }

        setError(null);
        setIsLoading(true);

        const userMessage: ChatMessage = {
            id: crypto.randomUUID(),
            role: "user",
            content: prompt,
        };

        setMessages((current) => [...current, userMessage]);

        const assistantMessageId = crypto.randomUUID();

        setMessages((current) => [
            ...current,
            {
                id: assistantMessageId,
                role: "assistant",
                content: "",
            },
        ]);

        try {
            let accumulatedText = "";

            await GeminiService(prompt, (chunk) => {
                accumulatedText += chunk;

                setMessages((current) =>
                    current.map((message) =>
                        message.id === assistantMessageId
                            ? {
                                  ...message,
                                  content: accumulatedText,
                              }
                            : message
                    )
                );
            });

            setMessages((current) =>
                current.map((message) =>
                    message.id === assistantMessageId
                        ? {
                              ...message,
                              content: accumulatedText || "No obtuve respuesta del modelo.",
                          }
                        : message
                )
            );
        } catch (err) {
            setMessages((current) => current.filter((message) => message.id !== assistantMessageId));
            setError(err instanceof Error ? err.message : "Error al consultar Gemini.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="mx-auto flex min-h-[calc(100vh-73px)] w-full max-w-5xl flex-col gap-4 p-4">
            <section className="rounded-3xl border bg-background/70 p-4 shadow-sm backdrop-blur">
                <div className="flex items-center gap-3 border-b pb-4">
                    <div className="flex size-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                        <BotMessageSquare className="size-5" />
                    </div>
                    <div>
                        <h1 className="font-semibold text-xl">Ali Chatbot</h1>
                        <p className="text-muted-foreground text-sm">
                            Conversa con Gemini desde el frontend.
                        </p>
                    </div>
                </div>

                <Conversation className="mt-4 h-[60vh] rounded-2xl border bg-muted/20">
                    <ConversationContent>
                        {messages.length === 0 ? (
                            <ConversationEmptyState
                                icon={<BotMessageSquare className="size-8" />}
                                title="Tu chat está listo"
                                description="Escribe un mensaje abajo para empezar a hablar con Zeus."
                            />
                        ) : (
                            messages.map((message) => (
                                <Message key={message.id} from={message.role}>
                                    <MessageContent>
                                        {message.role === "assistant" && !message.content && isLoading ? (
                                            <span className="flex items-center gap-2 text-muted-foreground">
                                                <LoaderCircle className="size-4 animate-spin" />
                                                Zeus está pensando...
                                            </span>
                                        ) : (
                                            message.content
                                        )}
                                    </MessageContent>
                                </Message>
                            ))
                        )}
                    </ConversationContent>
                    <ConversationScrollButton />
                </Conversation>

                {error ? (
                    <p className="mt-3 rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-destructive text-sm">
                        {error}
                    </p>
                ) : null}

                <div className="mt-4">
                    <PromptInput onSubmit={handleSubmit}>
                        <PromptInputBody>
                            <PromptInputTextarea placeholder="Escribe tu mensaje..." />
                        </PromptInputBody>
                        <PromptInputFooter>
                            <PromptInputSubmit status={isLoading ? "submitted" : "ready"}>
                                {isLoading ? <LoaderCircle className="size-4 animate-spin" /> : null}
                            </PromptInputSubmit>
                        </PromptInputFooter>
                    </PromptInput>
                </div>
            </section>
        </main>
    );
};