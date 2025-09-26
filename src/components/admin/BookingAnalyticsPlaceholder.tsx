import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { API_BASE_URL } from "@/lib/config";

type NoShowRow = {
  booking_day: string;
  attendance_rate: number | null;
  no_show_rate: number | null;
  total_bookings: number;
};

type ReminderRow = {
  channel: string;
  sent: number;
  failed: number;
  total: number;
  success_rate: number | null;
};

type SlotRow = {
  slot: string;
  bookings: number;
  weekday: number;
  hour: number;
};

export function BookingAnalyticsPlaceholder() {
  const [noShowData, setNoShowData] = useState<NoShowRow[]>([]);
  const [reminderData, setReminderData] = useState<ReminderRow[]>([]);
  const [slotData, setSlotData] = useState<SlotRow[]>([]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/admin/analytics/overview`)
      .then((response) => response.json())
      .then((json) => {
        setNoShowData(json.noShowRate ?? []);
        setReminderData(json.reminderEffectiveness ?? []);
        setSlotData(json.slotUtilization ?? []);
      })
      .catch((error) => {
        console.warn("Failed to load analytics overview", error);
      });
  }, []);

  return (
    <div className="space-y-6">
      <Card className="border-brown/20">
        <CardHeader>
          <CardTitle>No-show rate (rolling 30 days)</CardTitle>
        </CardHeader>
        <CardContent>
          {noShowData.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Dados não disponíveis. Depois de ativar o processamento de engajamento, este painel mostrará tendências diárias.
            </p>
          ) : (
            <ul className="space-y-2 text-sm">
              {noShowData.slice(0, 7).map((row) => (
                <li key={row.booking_day}>
                  <span className="font-medium">{new Date(row.booking_day).toLocaleDateString()}</span>{' '}
                  — presença {(row.attendance_rate ?? 0).toLocaleString(undefined, { style: 'percent', minimumFractionDigits: 0 })},
                  faltas {(row.no_show_rate ?? 0).toLocaleString(undefined, { style: 'percent', minimumFractionDigits: 0 })},
                  total {row.total_bookings}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Card className="border-brown/20">
        <CardHeader>
          <CardTitle>Reminder effectiveness</CardTitle>
        </CardHeader>
        <CardContent>
          {reminderData.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Em breve: usar `reminder_logs` para mostrar taxa de sucesso por canal. Configure o runner para popular esta tabela.
            </p>
          ) : (
            <ul className="space-y-2 text-sm">
              {reminderData.map((row) => (
                <li key={row.channel}>
                  <span className="font-medium">{row.channel}</span>{' '}
                  — sucesso {(row.success_rate ?? 0).toLocaleString(undefined, { style: 'percent', minimumFractionDigits: 0 })},
                  enviados {row.sent}, erros {row.failed}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Card className="border-brown/20">
        <CardHeader>
          <CardTitle>Idle time heatmap</CardTitle>
        </CardHeader>
        <CardContent>
          {slotData.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Este painel mostrará horários com pouca ocupação. O endpoint irá agregar por dia/hora usando `vw_slot_utilization`.
            </p>
          ) : (
            <ul className="grid gap-2 text-sm md:grid-cols-2">
              {slotData.slice(0, 10).map((row) => (
                <li key={row.slot} className="rounded border border-brown/10 p-2">
                  <span className="font-medium">{new Date(row.slot).toLocaleString()}</span>
                  <br />Reservas: {row.bookings}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
