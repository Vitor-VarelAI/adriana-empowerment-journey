# Plano de Integração MB WAY (IfThenPay)

## 1. Objetivos e Alcance
- Disponibilizar pagamentos MB WAY para as candidaturas da mentoria (pré-reserva, sinal, pagamento integral).
- Automatizar o envio de pedidos MB WAY diretamente a partir do painel interno e das notificações por email.
- Garantir que o processo é seguro, auditável e compatível com LGPD/GDPR.

## 2. Fornecedor Escolhido
- **IfThenPay** (PSP português autorizado): oferece API REST para MB WAY e referências Multibanco. Documentação e portal de suporte: https://helpdesk.ifthenpay.com/pt-PT/support/home
- Referências principais:
  - Portal IfThenPay para gestão de chaves, relatórios e estados de pagamentos.
  - Documentação API MB WAY: endpoints `/mbway/request`, `/mbway/status`, `/mbway/cancel`.
- Acordar previamente:
  - ID de conta e chave anti-phishing.
  - IBAN de liquidação.
  - Tabela de comissões e limites (valor mínimo/máximo em MB WAY).

## 3. Arquitetura de Alto Nível
```
Cliente (Landing / Portal)
        │
        ▼
Next.js API `/api/payments/mbway/request`
        │  (valida sessão + dados da candidatura)
        ▼
IfThenPay API (MB WAY)
        │
        ▼
Webhook IfThenPay → `/api/payments/mbway/webhook`
        │
        ▼
Base de dados (estado do pagamento) + Notificações (email/Slack)
```

## 4. Fluxos Principais
1. **Criação do pedido**
   - Origem: backoffice interno após aprovação ou fluxo automático após submissão (opcional).
   - Endpoint Next envia `mbwayKey`, `phone`, `amount`, `description`, `transactionId`.
   - Resposta IfThenPay com `status=pending`, `transactionId`.
   - Guardar registo com estado `pending` e timestamp.
2. **Confirmação do pagamento**
   - IfThenPay envia webhook (`status=paid`/`cancelled`/`expired`).
   - Endpoint valida assinatura via `antiPhishingKey`.
   - Atualiza registos + envia email interno/Slack.
3. **Consulta manual**
   - Endpoint protegido `/api/payments/mbway/status?transactionId=...` para “refresh” do estado.
4. **Cancelamento/reemissão**
   - Possível chamar `/mbway/cancel` antes de expirar para liberar reenvio.

## 5. Modelagem de Dados
- Tabela `payments` (ou coleção equivalente):
  - `id` (UUID)
  - `applicantId` / `email`
  - `phone`
  - `amount` (cêntimos)
  - `currency` (ISO, ex. `EUR`)
  - `provider` = `ifthenpay`
  - `transactionId` (fornecido pelo PSP)
  - `status` (`pending`, `paid`, `expired`, `cancelled`, `failed`)
  - `metadata` (JSON: `goal`, `mentorshipTier`, `notes`)
  - `createdAt`, `updatedAt`, `confirmedAt`
- Campos de auditoria: `createdBy`, `confirmedBy`.

## 6. Segurança e Compliance
- Armazenar `MBWAY_KEY`, `MBWAY_ANTI_PHISHING` e `MBWAY_ENDPOINT` em variáveis de ambiente (Vercel + local).
- Validar origem dos webhooks:
  - Confirmar IP da IfThenPay (lista de allowlist) e header `X-Ifthenpay-Signature`.
  - Rejeitar pedidos sem assinatura válida.
- Encriptação opcional de telefones (ex. AES) antes de persistir; mostrar apenas parcialmente.
- Rate limiting dos endpoints `/api/payments/mbway/*`.
- Logging sem dados sensíveis; logs com IDs transacionais.

## 7. Integração com Formulários Existentes
- Novo campo “Valor estimado da reserva” (opcional) para preparar o pedido.
- `SimpleCaptureForm` e `MentoriaForm`: armazenar `preferPaymentMethod`.
- Status da candidatura passa a ter estados: `submitted → under_review → payment_requested → paid`.
- Emails automáticos:
  - “Pedido MB WAY enviado” com instruções e prazo.
  - “Pagamento confirmado” com próximos passos.

## 8. Cronograma Sugerido
| Semana | Entregas |
|--------|----------|
| 1 | Configurar conta IfThenPay, recolher credenciais, criar tabela `payments`. |
| 2 | Implementar `/api/payments/mbway/request` + page interna de disparo; testes sandbox. |
| 3 | Implementar webhook, notificações e view no backoffice; testes E2E sandbox. |
| 4 | Ajustes finais, revisão de segurança, deploy e monitorização. |

## 9. Testes e QA
- **Unit Tests**: mocks da API IfThenPay para validar request/response.
- **Integration**: fluxo completo com sandbox IfThenPay e base local.
- **Webhook Replay**: armazenar payloads para reprocessamento seguro.
- **Load Test**: simular múltiplos pedidos para garantir limites de rate.

## 10. Operação e Monitorização
- Dashboard interno com lista de pagamentos (filtros por status).
- Alertas (email/Slack) quando existir `pending > 15 min`.
- Procedimento de suporte:
  1. Verificar status no dashboard.
  2. Consultar IfThenPay.
  3. Reenviar pedido manual se necessário.

## 11. Próximos Passos
1. Validar com a IfThenPay requisitos de contrato e chaves.
2. Definir política de reembolso/cancelamento e atualizar termos.
3. Decidir se haverá automação imediata após submissão ou apenas via painéis internos.
## Análise Comparativa e Plano de Implementação: MB WAY puro (IfThenPay) vs Stripe Checkout com MB WAY Default

---

### 1. **MB WAY Direto via IfThenPay (Requisito Obrigatório)**

#### **Custos IfThenPay**
- **Setup inicial:** Sem custos de adesão ou mensalidades.
- **Taxas MB WAY:** 0,07 € + 0,7% por transação, acrescido de IVA.
- **Manutenção:** Sem custos de manutenção; transferências diárias gratuitas; módulos/grátis para e-commerce; suporte técnico incluído.
- **Pagamentos automáticos:** Validação e liquidação automática via backoffice.
- **Gestão:** Necessita criar/gerir conta e chave backoffice. Setup manual na loja com plugins ou integração direta para plataformas nacionais ([fonte](https://helpdesk.ifthenpay.com/pt-PT/support/solutions/articles/79000086484-quais-os-custos-do-servico-)).

#### **Recursos Internos Necessários**
- Integração técnica direta (obter dados integração: chave backoffice, configurar na plataforma).
- Validação/monitorização recorrente de recebimentos e reconciliação.
- Apoio a clientes, documentação, conformidade legal/fiscal.
- Sem overhead técnico de servidores de pagamento.

---

### 2. **Stripe Checkout c/ MB WAY método predefinido**

#### **Fluxos e Objetivos**
- Checkout internacional e moderno.
- Stripe exibe MB WAY para clientes PT como método automático/predefinido.
- Requisitos: todos os items em EUR.
- Notificação instantânea de pagamento (ou recusa), integra reembolsos via Dashboard/API.
- Gestão centralizada e exportação de relatórios unificada.

#### **Custos Stripe (Portugal)**
- **Taxas:** Stripe não expõe taxa MB WAY publicamente mas, tipicamente, ronda os valores para UE (±1,5% + 0,25 €, confirmar com Stripe).
- **Setup/Manutenção:** Incluídos nas taxas transacionais; sem custos de adesão ou manutenção.
- API/documentação moderna, integração única ([fonte](https://docs.stripe.com/payments/mb-way/accept-a-payment)).

#### **Recursos Internos Necessários**
- Menor overhead técnico, integração única para vários métodos.
- Manutenção, reporting, reembolsos — tudo automatizado.
- Dashboard central para pagamentos, gestão, disputas e relatórios.
- Preparado para escala internacional/futuro.

---

### **Tabela Comparativa**

| Critério                | MB WAY Direto (IfThenPay)                        | Stripe Checkout (MB WAY)                      |
|-------------------------|--------------------------------------------------|-----------------------------------------------|
| Setup/Manutenção        | Zero adesão/mensalidade. Plugins nacionais       | Zero adesão/mensalidade. Setup via Dashboard  |
| Taxa MB WAY             | 0,07 € + 0,7% (+IVA)                             | ±1,5% + 0,25 € (confirmar)                    |
| Integração              | Plugins nacionais/front-end manual               | API/SDK única multi-métodos                   |
| Gestão                  | Separa, via ifthenpay/backoffice                 | Central no Stripe Dashboard/API               |
| Recursos internos       | Configuração/monitorização manual                | Automatização e reporting simplificado        |
| Futuro/Escala           | Nacional, depende da IfThenPay                   | Escalável, recurso internacional, tudo num só |

---

### **Sugestão para Decisão Interna**

- **Prioridade mercado nacional, baixo volume e máximo controlo:**  
  IfThenPay puro → custos baixos, integração local simples.
- **Expansão, menor manutenção e automação de backoffice:**  
  Stripe Checkout → overhead técnico reduzido, integração simplificada, scale-up futuro.

---

### **Plano Esboço de Implementação — Stripe Checkout (MB WAY default)**

1. **Configuração Stripe**
   - Criar conta Stripe
   - Certificar que métodos de pagamento MB WAY estão ativos (verificando dashboard Stripe)

2. **Fluxo de Checkout**
   - Integrar Stripe Checkout (ou Payment Intents API) no front-end
   - Definir moeda "eur" para todos os items
   - Personalizar branding e ordem dos métodos de pagamento (opcional, via dashboard ou options no código)
   - Testar: garantir que MB WAY aparece como opção principal para utilizadores portugueses

3. **Gestão**
   - Automatizar reporting e reconciliação (exportação de transações, webhooks para sincronização ERP/backoffice)
   - Active gestão de reembolsos, disputas e relatórios tudo no Stripe Dashboard

4. **Monitorização/Manutenção**
   - Manutenção e atualização por parte da Stripe (não interna)
   - Receber notificações e acompanhar status/configurações via dashboard

---

### **Fontes & Doc**

- [Custos IfThenPay](https://helpdesk.ifthenpay.com/pt-PT/support/solutions/articles/79000086484-quais-os-custos-do-servico-)
- [Stripe Checkout MB WAY - Docs](https://docs.stripe.com/payments/mb-way/accept-a-payment)
- [Comparativo métodos Portugal](https://jumpseller.pt/support/price-comparison-payment-gateways/)

---
