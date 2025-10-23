# BYOK Chat Platform (Next.js)

BYOK Chat is a versatile Next.js platform designed to integrate with various AI providers, enabling seamless communication and customization. This platform supports both standard OpenAI-compatible APIs and Cloudflare Workers AI.

## Features

- **Beautiful Landing Page**: Modern, animated landing page with Aurora background effects and smooth scroll animations using ReactBits components
- **Next.js 16 App Router**: Built with the latest Next.js for optimal performance and SEO
- **Provider Management**: Add, edit, and manage multiple AI providers
- **Model Selection**: Fetch available models or manually add custom models
- **API Key Validation**: Test API keys with selected models
- **Cloudflare Workers Support**: Rotate between multiple accounts using worker URLs
- **Customizable UI**: Tailor the interface to your needs with Shadcn UI components
- **Client-Side Storage**: Uses IndexedDB for local data persistence
- **Theme Support**: Built-in light, dark, and cyber-aurora themes
- **TypeScript**: Fully typed for better development experience
- **Animated Components**: Leverages framer-motion and GSAP for smooth animations

## Routes

- `/` - Landing page showcasing features, advantages, and use cases
- `/chat` - Main chat interface for AI conversations

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

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v3
- **UI Components**: Shadcn UI
- **State Management**: Zustand
- **Database**: IndexedDB (via localforage)
- **Markdown**: React-Markdown with Mermaid support
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js (v20 or higher)
- npm, pnpm, or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/0xarchit/ByokChat.git
   cd ByokChat/byok-chat
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   pnpm install
   # or
   yarn install
   ```

3. Start the development server:
   ```bash
   npm run dev
   # or
   pnpm dev
   # or
   yarn dev
   ```

4. Open your browser and navigate to `http://localhost:3000`.

### Building for Production

```bash
npm run build
npm run start
```

This will create an optimized production build and start the production server.

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

## Project Structure

```
byok-chat/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout with metadata
│   ├── page.tsx           # Home page
│   ├── not-found.tsx      # 404 page
│   └── globals.css        # Global styles and theme variables
├── components/            # React components
│   ├── ui/               # Shadcn UI components
│   ├── settings/         # Settings-related components
│   └── *.tsx             # Feature components
├── lib/                  # Utility functions
│   ├── db.ts            # IndexedDB configuration
│   ├── api.ts           # API utilities
│   └── utils.ts         # Helper functions
├── store/               # Zustand state management
│   ├── chatStore.ts     # Chat state
│   ├── providerStore.ts # Provider state
│   └── settingsStore.ts # Settings state
├── types/               # TypeScript type definitions
├── hooks/               # Custom React hooks
└── public/              # Static assets
```

## Deployment

### Vercel (Recommended)

The easiest way to deploy your Next.js app is to use [Vercel](https://vercel.com):

1. Push your code to GitHub
2. Import your repository to Vercel
3. Vercel will automatically detect Next.js and configure the build settings
4. Deploy!

### Other Platforms

You can also deploy to:
- **Netlify**: Supports Next.js with automatic configuration
- **AWS Amplify**: Full support for Next.js
- **Docker**: Use the provided Dockerfile for containerized deployments
- **Self-hosted**: Build the app and run with `npm start`

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Support

For issues, questions, or contributions, please visit the [GitHub repository](https://github.com/0xarchit/ByokChat).

---

**Happy chatting!** 🚀