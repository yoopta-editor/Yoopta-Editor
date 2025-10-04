export type GPT35Model = 'gpt-3.5-turbo' | 'gpt-3.5-turbo-0301';

export type GPT4Model = 'gpt-4' | 'gpt-4-0314' | 'gpt-4-32k' | 'gpt-4-32k-0314';

export type OpenAIChatRole = 'user' | 'assistant' | 'system' | '';

export type Model = GPT35Model | GPT4Model;

export type OpenAIChatMessage = {
  content: string;
  role: OpenAIChatRole;
}

export type ContextChatGPTMessage = OpenAIChatMessage;

export type ChatMessage = OpenAIChatMessage & { id: string; order: number; fromContext?: boolean };

export type ChatMessageMap = Record<string, ChatMessage>;

export type OpenAIChatCompletionChunk = {
  id: string;
  object: string;
  created: number;
  model: Model;
  choices: {
    delta: Partial<OpenAIChatMessage>;
    index: number;
    finish_reason: string | null;
  }[];
}

export type ChatCompletionToken = {
  timestamp: number;
} & OpenAIChatMessage

export type ChatMessageParams = {
  timestamp?: number;
  data?: {
    loading?: boolean;
    responseTime?: string;
    chunks?: ChatCompletionToken[];
  };
} & OpenAIChatMessage

// For more information on each of these properties:
// https://platform.openai.com/docs/api-reference/chat
export type OpenAIStreamingParams = {
  apiKey: string;
  model: Model;
  temperature?: number;
  top_p?: number;
  n?: number;
  stop?: string | string[];
  max_tokens?: number;
  presence_penalty?: number;
  frequency_penalty?: number;
  logit_bias?: Map<string | number, number>;
  user?: string;
};

export type FetchRequestOptions = {
  headers: Record<string, string>;
  method: 'POST';
  body: string;
  signal?: AbortSignal;
};

export type Action = { name: string };
