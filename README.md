# BYOK Chat Platform

BYOK Chat is a versatile platform designed to integrate with various AI providers, enabling seamless communication and customization. This platform supports both standard OpenAI-compatible APIs and Cloudflare Workers AI.

## Features

- **Provider Management**: Add, edit, and manage multiple AI providers.
- **Model Selection**: Fetch available models or manually add custom models.
- **API Key Validation**: Test API keys with selected models.
- **Cloudflare Workers Support**: Rotate between multiple accounts using worker URLs.
- **Customizable UI**: Tailor the interface to your needs with Shadcn UI components.

## Some popular supported Free AI Providers

1. **Groq**
   - Base URL: [https://api.groq.com/openai/](https://api.groq.com/openai/)

2. **Mistral**
   - Base URL: [https://api.mistral.ai/v1](https://api.mistral.ai/v1)

3. **OpenRouter**
   - Base URL: [https://openrouter.ai/api/v1](https://openrouter.ai/api/v1)

4. **Cerebras**
   - Base URL: [https://api.cerebras.ai/v1](https://api.cerebras.ai/v1)

5. **Google Generative Language**
   - Base URL: [https://generativelanguage.googleapis.com/v1beta/openai/](https://generativelanguage.googleapis.com/v1beta/openai/)

6. **Cloudflare Worker AI**
   - Deploy your own worker version to integrate seamlessly with the platform.
   - Refer to the [Cloudflare Workers documentation](https://developers.cloudflare.com/workers/) for setup instructions.

> It support all open ai compatible endpoints with several fallbacks

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- pnpm (preferred package manager)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd CustomChats
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Start the development server:
   ```bash
   pnpm dev
   ```

4. Open your browser and navigate to `http://localhost:3000`.

## Usage

### Adding a Provider

1. Click on "Add Provider".
2. Select the provider type (Standard or Cloudflare).
3. Fill in the required fields:
   - **Standard**: API URL, API keys, and models.
   - **Cloudflare**: Worker URL, max index, and models.
4. Test the API key and save the provider.

### Editing a Provider

1. Navigate to the "Providers" section.
2. Click on the edit icon next to the provider.
3. Update the fields and save changes.

### Fetching Models

- For standard providers, click "Fetch Available Models" to retrieve models from the API.
- For Cloudflare providers, manually add models using the input field.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request.

## License

This project is licensed under the MIT License. See the LICENSE file for details.

---

Happy chatting!