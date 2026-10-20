import { CalendarDays, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { dateLabel, localDateKey, requestStatuses } from "../features/requests/requestUtils.js";

function reminderDate(date) {
  if (date === localDateKey()) return "Hari ini";
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  if (date === localDateKey(tomorrow)) return "Besok";
  return dateLabel(date, { day: "numeric", month: "short" });
}

export function UpcomingRequests({ requests, currentUser }) {
  const now = new Date();
  const upcoming = requests.filter((request) => new Date(`${request.date}T${request.endTime}:00`) >= now);
  const visibleRequests = currentUser.role === "supervisor"
    ? [
        ...requests.filter((request) => request.status === "pending").sort((a, b) => `${a.date}${a.startTime}`.localeCompare(`${b.date}${b.startTime}`)),
        ...upcoming.filter((request) => request.status === "approved").sort((a, b) => `${a.date}${a.startTime}`.localeCompare(`${b.date}${b.startTime}`)),
      ]
    : upcoming.filter((request) => request.status === "approved" || (request.status === "pending" && request.requesterId === currentUser.id))
      .sort((a, b) => `${a.date}${a.startTime}`.localeCompare(`${b.date}${b.startTime}`));
  const reminders = visibleRequests.slice(0, 4);
  const isSupervisor = currentUser.role === "supervisor";

  return (
    <section className="panel home-reminders" aria-labelledby="homeRemindersTitle">
      <div className="home-reminders-head">
        <div><div className="home-reminders-title"><span className="home-reminders-icon"><CalendarDays /></span><div><h2 id="homeRemindersTitle">Pengingat jadwal</h2><p className="panel-sub">{isSupervisor ? "Permintaan yang perlu ditinjau dan jadwal disetujui." : "Permintaan Anda dan jadwal lapangan yang disetujui."}</p></div></div></div>
        <Link className="text-link home-reminders-link" to="/calendar">Lihat kalender <ChevronRight /></Link>
      </div>
      {reminders.length ? <div className="home-reminders-list">{reminders.map((request) => <Link className="home-reminder" to={`/calendar?date=${request.date}`} key={request.id}>
        <span className={`home-reminder-date ${requestStatuses[request.status]?.color}`}>{reminderDate(request.date)}</span>
        <span className="home-reminder-copy"><strong>{request.itemName}</strong><span>{request.quantity} unit - {request.requesterName}</span></span>
        <span className={`request-status ${requestStatuses[request.status]?.color}`}>{requestStatuses[request.status]?.label}</span>
      </Link>)}</div> : <div className="home-reminders-empty">Belum ada pengingat jadwal mendatang.</div>}
    </section>
  );
}
