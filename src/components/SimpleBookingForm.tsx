import { FC } from 'react'
import { Button } from '@/components/ui/button'

const SimpleBookingForm: FC = () => (
  <form
    action="https://formsubmit.co/adrianairia.leadercoach@gmail.com"
    method="POST"
    className="space-y-4 max-w-md mx-auto"
  >
    <div>
      <label htmlFor="nome" className="block text-sm font-medium mb-1">
        Nome:
      </label>
      <input
        type="text"
        id="nome"
        name="nome"
        placeholder="O seu nome"
        required
        className="w-full rounded-md border p-2"
      />
    </div>
    <div>
      <label htmlFor="email" className="block text-sm font-medium mb-1">
        Email:
      </label>
      <input
        type="email"
        id="email"
        name="email"
        placeholder="O seu email"
        required
        className="w-full rounded-md border p-2"
      />
    </div>
    <div>
      <label htmlFor="data" className="block text-sm font-medium mb-1">
        Data da sessão:
      </label>
      <input
        type="date"
        id="data"
        name="data"
        required
        className="w-full rounded-md border p-2"
      />
    </div>
    <div>
      <label htmlFor="hora" className="block text-sm font-medium mb-1">
        Hora da sessão:
      </label>
      <input
        type="time"
        id="hora"
        name="hora"
        required
        className="w-full rounded-md border p-2"
      />
    </div>
    <div>
      <label htmlFor="mensagem" className="block text-sm font-medium mb-1">
        Mensagem adicional (opcional):
      </label>
      <textarea
        id="mensagem"
        name="mensagem"
        placeholder="Mensagem adicional..."
        className="w-full rounded-md border p-2"
      />
    </div>
    <input
      type="hidden"
      name="_next"
      value="https://wa.me/351912187975?text=%C3%93l%C3%A1%20Adriana%2C%20acabei%20de%20preencher%20o%20formul%C3%A1rio%20no%20teu%20site%20para%20marcar%20uma%20sess%C3%A3o.%20Fico%20a%20aguardar%20os%20dados%20para%20pagamento."
    />
    <Button type="submit" className="w-full">
      Marcar Sessão
    </Button>
  </form>
)

export default SimpleBookingForm
