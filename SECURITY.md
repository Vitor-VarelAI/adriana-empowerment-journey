# 🔐 Segurança – Adriana Empowerment Journey

Este projeto foi desenvolvido com foco em simplicidade, transparência e conformidade prática com os métodos de pagamento em Portugal.

## ✅ Padrões Seguidos

- Validação estrita de telefone (regex português: `^9[1236]\d{7}$`)
- Campos mínimos obrigatórios (nome, email, telefone)
- Honeypot invisível para proteção contra bots (em breve)
- Mensagens visuais de aviso sobre uso de dados

## 🚫 O que não fazemos

- Não usamos APIs externas para MB WAY (sem Ifthenpay)
- Não guardamos dados sensíveis localmente ou em base de dados
- Não expomos o número de telefone publicamente
- Não automatizamos a cobrança — tudo é feito manualmente pela Adriana com consentimento prévio

## 🧠 Conformidade com práticas MB WAY

A lógica de pedido manual segue as recomendações do Millennium BCP e outras entidades bancárias:
- O utilizador é informado previamente
- O número é recolhido com consentimento
- O pedido é feito manualmente
- A sessão só é confirmada após o pagamento

## 🔒 Recomendações Futuras

- Adicionar reCAPTCHA invisível
- Validar email com campo duplo
- Integrar Google Calendar
- Migrar para backend com logging e base de dados, se o volume justificar

---
