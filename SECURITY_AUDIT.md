# Security Audit Report

**Date:** 2025-08-16

---

## 1. Unprotected Admin API Endpoints

*   **Status:** Secure
*   **Evidence:** Toda a lógica de disponibilidade/agendamento vive em rotas Next.js (`app/api/**`). A versão atual não usa Google Calendar nem Supabase; o servidor apenas valida a slot, envia o pedido ao Formspree e guarda um registo em memória para evitar duplicados temporariamente. Não existe superfície “admin” exposta ao browser.
*   **Recommended Mitigation:** N/A

---

## 2. Leaked Admin Logic in the Client

*   **Status:** Secure
*   **Evidence:** A thorough search for keywords such as `admin`, `role`, and `isAdmin` did not reveal any administrative logic in the client-side code. The occurrences of the word `role` are related to ARIA attributes for accessibility, which is a recommended practice.
*   **Recommended Mitigation:** N/A

---

## 3. Users Accessing Others' Resources

*   **Status:** Secure
*   **Evidence:** Os pedidos de agendamento são mantidos apenas durante a execução do servidor (store em memória). O email enviado via Formspree é o registo oficial. O browser não tem acesso direto ao estado interno para além da resposta `success`.
*   **Recommended Mitigation:** Se o projeto voltar a ter histórico persistente, reintroduzir controles por utilizador/cliente.

---

## 4. Leaked Secrets in Frontend

*   **Status:** Mitigated
*   **Evidence:** Formspree configuration is now resolved via `src/lib/config.ts`, which reads `NEXT_PUBLIC_FORMSPREE_ID` (Next.js) or `VITE_FORMSPREE_ID` (legacy dev server) from environment variables. No IDs are hardcoded in the bundle.
*   **Mitigation Implemented:** Ensure `.env.local` remains gitignored (already in place) and populate the Formspree ID only in environment files.

---

## 5. Users Updating Protected Properties

*   **Status:** Secure
*   **Evidence:** The application does not have user data or protected properties (such as `isAdmin`). The form only submits the information necessary for booking through Formspree. There is no way for a user to modify their "access level" or other protected fields.
*   **Recommended Mitigation:** N/A

---

## 6. Exposed Sitemaps/Endpoint Lists

*   **Status:** Secure
*   **Evidence:** A search for `sitemap.xml` and `robots.txt` found no files. The application does not expose a list of routes or endpoints.
*   **Recommended Mitigation:** N/A

---

## 7. Improper Row-Level Security (RLS)

*   **Status:** Secure (Current Scope)
*   **Evidence:** Não há base de dados externa neste release. As entradas vivem apenas na memória do processo.
*   **Recommended Mitigation:** Caso volte a existir uma base de dados multi-tenant, introduzir RLS ou checagens por utilizador.

---

## 8. Returning Unnecessary Data

*   **Status:** Secure
*   **Evidence:** Next.js API responses return only availability arrays or simple confirmation payloads. No sensitive tokens or database rows are exposed to the browser.
*   **Recommended Mitigation:** Continue to keep responses minimal; avoid echoing stored OAuth tokens.

---

## 9. Use of Incremented IDs

*   **Status:** Secure
*   **Evidence:** The services in the [`src/components/BookingTable.tsx`](src/components/BookingTable.tsx) component use sequential numeric IDs (1, 2, 3). However, these IDs are only used on the client-side to manage the selection state and are not exposed in the URL or used to access resources. The application's routes, defined in [`src/App.tsx`](src/App.tsx), are static and do not include dynamic parameters.
*   **Recommended Mitigation:** N/A. If the IDs were used in URLs (e.g., `/services/1`), it would be recommended to replace them with UUIDs to prevent resource enumeration.

---

## 10. Vulnerability to Google Dorks

*   **Status:** Mitigated
*   **Evidence:** A search for potentially sensitive files found the `.env` file and a Codacy log file.
*   **Mitigation Implemented:** The `.env` file and the `.codacy` directory have been added to the `.gitignore` file to ensure they are not included in the repository.
