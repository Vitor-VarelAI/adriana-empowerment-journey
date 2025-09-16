# Adriana Empowerment Journey

**Coaching Profissional Personalizado em Portugal**

[![Live Demo](https://img.shields.io/badge/Live-Demo-brown?style=for-the-badge&logo=vercel)](https://www.adrianairia.pt)
[![Tech Stack](https://img.shields.io/badge/Tech%20Stack-React%20%7C%20TypeScript%20%7C%20Tailwind%20CSS-blue?style=for-the-badge)](https://github.com/Vitor-VarelAI/adriana-empowerment-journey)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

## 🌟 Sobre o Projeto

Website profissional para Adriana, coach especializada em desenvolvimento pessoal e profissional. O projeto oferece uma plataforma completa para marcação de sessões de coaching com integração em tempo real com Google Calendar.

## ✨ Funcionalidades Principais

- 🎯 **Landing Page Responsiva**: Design moderno e adaptável a todos os dispositivos
- 📅 **Google Calendar Integration**: Sistema de marcação em tempo real com verificação de disponibilidade
- 💳 **Sistema de Preços**: Múltiplos pacotes de sessões (Única, 4 Sessões, 10 Sessões)
- 🎨 **UI/UX Moderna**: Interface intuitiva construída com shadcn/ui e Tailwind CSS
- 🌐 **SEO Optimizado**: Meta tags Open Graph para melhor compartilhamento em redes sociais
- ⚡ **Performance Otimizada**: Build rápido com Vite e React 19

## 🚀 Tech Stack

- **Frontend**: React 19.1.0 + TypeScript
- **Build Tool**: Vite 7.0.4
- **Styling**: Tailwind CSS + shadcn/ui
- **State Management**: React Context + TanStack Query
- **Backend**: Node.js/Express (Google Calendar API)
- **Authentication**: OAuth2 com Google
- **Forms**: React Hook Form + Zod Validation

## 📦 Instalação Local

### Pré-requisitos
- Node.js 18+ e pnpm
- Google Cloud Console account
- Google Calendar API access

### Passos

```bash
# Clonar o repositório
git clone https://github.com/Vitor-VarelAI/adriana-empowerment-journey.git
cd adriana-empowerment-journey

# Instalar dependências
pnpm install

# Configurar variáveis de ambiente
cp .env.example .env

# Iniciar servidor de desenvolvimento
pnpm dev

# Build para produção
pnpm build
```

## 🔧 Configuração do Backend

O backend para integração com Google Calendar está na pasta `gcal-server/`:

```bash
# Navegar para o diretório do servidor
cd gcal-server

# Instalar dependências
npm install

# Configurar .env com:
# GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI, ADMIN_EMAIL

# Iniciar servidor
npm run dev
```

## 📱 Demonstração

Acesse o site em produção: [www.adrianairia.pt](https://www.adrianairia.pt)

## 💻 Desenvolvimento

### Scripts Disponíveis
- `pnpm dev` - Servidor de desenvolvimento
- `pnpm build` - Build para produção
- `pnpm lint` - Lint do código
- `pnpm test` - Executar testes

### Estrutura do Projeto
```
src/
├── components/           # Componentes React
│   ├── ui/              # Componentes shadcn/ui
│   ├── SectionWrapper.tsx # Wrapper para espaçamento consistente
│   └── ...               # Componentes de negócio
├── contexts/            # Contextos React
├── hooks/               # Hooks customizados
├── pages/               # Páginas
└── lib/                 # Utilitários
```

## 🎨 Design System

O projeto utiliza um sistema de design consistente com:
- **Cores Primárias**: Brown (#875c51), Offwhite (#f9f8f8)
- **Tipografia**: Inter (sans-serif) + Playfair Display (serif)
- **Espaçamento**: Sistema baseado em múltiplos de 8 (py-20 md:py-24)
- **Componentes**: Biblioteca shadcn/ui com customizações

## 📝 Licença

Este projeto está licenciado sob a MIT License - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 🤝 Contribuição

Contribuições são bem-vindas! Por favor, sinta-se à vontade para abrir uma issue ou submit um pull request.

## 📞 Contato

- **Email**: adrianairia@gmail.com
- **LinkedIn**: [Adriana Coaching](https://linkedin.com/in/adriana-coaching)
- **Instagram**: [@a.iria](https://instagram.com/a.iria)

---

Desenvolvido com ❤️ por [Vitor Varela](https://github.com/Vitor-VarelAI) para Adriana Empowerment Journey
