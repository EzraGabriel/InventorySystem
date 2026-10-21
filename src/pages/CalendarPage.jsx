import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { CalendarDays, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { Button } from "../components/Button.jsx";
import { PageHeader } from "../components/PageHeader.jsx";
import { RequestDialog } from "../components/RequestDialog.jsx";
import {
  dateLabel,
  localDateKey,
  requestStatuses,
} from "../features/requests/requestUtils.js";

const weekdays = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];
const monthLabel = (date) =>
  new Intl.DateTimeFormat("id-ID", { month: "long", year: "numeric" }).format(
    date,
  );

function getMonthDays(monthDate) {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const firstWeekday = (new Date(year, month, 1).getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = Array(firstWeekday).fill(null);
  for (let day = 1; day <= daysInMonth; day += 1) cells.push(day);
  while (cells.length % 7) cells.push(null);
  return cells;
}

export function CalendarPage({
  requests,
  items,
  activityLocations = [],
  currentUser,
  onCreate,
  onUpdate,
  onReview,
}) {
  const today = localDateKey();
  const [searchParams] = useSearchParams();
  const requestedDate = searchParams.get("date");
  const initialDate =
    requestedDate &&
    /^\d{4}-\d{2}-\d{2}$/.test(requestedDate) &&
    localDateKey(new Date(`${requestedDate}T12:00:00`)) === requestedDate
      ? requestedDate
      : today;
  const [monthDate, setMonthDate] = useState(
    () => new Date(`${initialDate}T12:00:00`),
  );
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [dialog, setDialog] = useState(null);
  const monthDays = useMemo(() => getMonthDays(monthDate), [monthDate]);
  const dayRequests = useMemo(
    () =>
      requests
        .filter((request) => request.date === selectedDate)
        .sort((a, b) => a.startTime.localeCompare(b.startTime)),
    [requests, selectedDate],
  );
  const countByStatus = (status) =>
    requests.filter(
      (request) => request.date === selectedDate && request.status === status,
    ).length;

  const moveMonth = (delta) => {
    const nextMonth = new Date(
      monthDate.getFullYear(),
      monthDate.getMonth() + delta,
      1,
    );
    setMonthDate(nextMonth);
    setSelectedDate(localDateKey(nextMonth));
  };
  const selectDay = (day) => {
    if (!day) return;
    const next = new Date(monthDate.getFullYear(), monthDate.getMonth(), day);
    setSelectedDate(localDateKey(next));
  };
  const openCreate = () => setDialog({ mode: "create" });
  const closeDialog = () => setDialog(null);
  const save = (data) => {
    if (dialog.mode === "edit") onUpdate(dialog.request.id, data);
    else onCreate(data);
    setSelectedDate(data.date);
    setMonthDate(new Date(`${data.date}T12:00:00`));
    closeDialog();
  };
  const review = (request, status) => {
    onReview(request.id, status);
    closeDialog();
  };
  const roleName =
    currentUser.role === "supervisor" ? "Supervisor" : "Volunteer";

  return (
    <>
      <PageHeader
        kicker="Jadwal lapangan"
        title="Kalender permintaan"
        description="Lihat jadwal barang dan status permintaan dalam satu tempat."
        action={
          <Button icon={Plus} variant="primary" onClick={openCreate}>
            Ajukan permintaan
          </Button>
        }
      />
      <section
        className="calendar-role-bar"
        aria-label="Simulasi peran pengguna"
      >
        <div>
          <span className="calendar-role-indicator" />
          <span>Mode frontend</span>
          <strong>{roleName}</strong>
        </div>
        <span className="calendar-role-session">Masuk sebagai {roleName}</span>
      </section>
      <section
        className="calendar-layout"
        aria-label="Kalender dan agenda permintaan"
      >
        <div className="panel calendar-panel">
          <div className="calendar-month-head">
            <div>
              <h2>{monthLabel(monthDate)}</h2>
              <p className="panel-sub">
                Pilih tanggal untuk melihat permintaan
              </p>
            </div>
            <div className="calendar-month-controls">
              <button
                type="button"
                className="calendar-icon-button"
                onClick={() => moveMonth(-1)}
                aria-label="Bulan sebelumnya"
              >
                <ChevronLeft />
              </button>
              <button
                type="button"
                className="calendar-today-button"
                onClick={() => {
                  setMonthDate(new Date());
                  setSelectedDate(today);
                }}
              >
                Hari ini
              </button>
              <button
                type="button"
                className="calendar-icon-button"
                onClick={() => moveMonth(1)}
                aria-label="Bulan berikutnya"
              >
                <ChevronRight />
              </button>
            </div>
          </div>
          <div
            className="calendar-grid"
            role="grid"
            aria-label={monthLabel(monthDate)}
          >
            {weekdays.map((day) => (
              <div className="calendar-weekday" role="columnheader" key={day}>
                {day}
              </div>
            ))}
            {monthDays.map((day, index) => {
              const date = day
                ? localDateKey(
                    new Date(
                      monthDate.getFullYear(),
                      monthDate.getMonth(),
                      day,
                    ),
                  )
                : null;
              const dayItems = date
                ? requests.filter((request) => request.date === date)
                : [];
              const statuses = [
                ...new Set(dayItems.map((request) => request.status)),
              ];
              const isSelected = date === selectedDate;
              return (
                <button
                  type="button"
                  role="gridcell"
                  key={`${date || "empty"}-${index}`}
                  className={`calendar-day${day ? "" : " is-empty"}${isSelected ? " is-selected" : ""}${date === today ? " is-today" : ""}`}
                  onClick={() => selectDay(day)}
                  disabled={!day}
                  aria-label={
                    date
                      ? `${dateLabel(date)}, ${dayItems.length} permintaan`
                      : undefined
                  }
                  aria-pressed={isSelected}
                >
                  <span>{day || ""}</span>
                  {dayItems.length > 0 && (
                    <span className="calendar-day-markers" aria-hidden="true">
                      {statuses.map((status) => (
                        <i
                          key={status}
                          className={requestStatuses[status]?.color}
                        />
                      ))}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
          <div className="calendar-legend" aria-label="Keterangan status">
            <span>
              <i className="pending" />
              Pending
            </span>
            <span>
              <i className="approved" />
              Disetujui
            </span>
            <span>
              <i className="rejected" />
              Ditolak
            </span>
          </div>
        </div>
        <div className="panel calendar-agenda">
          <div className="calendar-agenda-head">
            <div>
              <span className="eyebrow">Agenda tanggal</span>
              <h2>
                {dateLabel(selectedDate, { day: "numeric", month: "long" })}
              </h2>
            </div>
            <span className="calendar-request-count">
              {dayRequests.length} permintaan
            </span>
          </div>
          <div className="calendar-status-counts">
            <span className="pending">{countByStatus("pending")} pending</span>
            <span className="approved">
              {countByStatus("approved")} disetujui
            </span>
            <span className="rejected">
              {countByStatus("rejected")} ditolak
            </span>
          </div>
          {dayRequests.length ? (
            <div className="calendar-request-list">
              {dayRequests.map((request) => (
                <button
                  type="button"
                  className="calendar-request-card"
                  key={request.id}
                  onClick={() => setDialog({ mode: "detail", request })}
                >
                  <span
                    className={`calendar-request-accent ${requestStatuses[request.status]?.color}`}
                  />
                  <span className="calendar-request-copy">
                    <strong>{request.itemName}</strong>
                    <span>
                      {request.quantity} unit - {request.requesterName}
                    </span>
                    <small>{request.location}</small>
                  </span>
                  <span
                    className={`request-status ${requestStatuses[request.status]?.color}`}
                  >
                    {requestStatuses[request.status]?.label}
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <div className="calendar-empty">
              <CalendarDays />
              <strong>Belum ada permintaan</strong>
              <p>Pilih tanggal lain atau ajukan permintaan baru.</p>
              {currentUser.role === "volunteer" && (
                <button
                  type="button"
                  className="text-link"
                  onClick={openCreate}
                >
                  Ajukan permintaan
                </button>
              )}
            </div>
          )}
        </div>
      </section>
      {dialog && (
        <RequestDialog
          key={`${dialog.mode}-${dialog.request?.id || "new"}`}
          {...dialog}
          items={items}
          requests={requests}
          activityLocations={activityLocations}
          currentUser={currentUser}
          initialDate={selectedDate}
          onClose={closeDialog}
          onEdit={(request) => setDialog({ mode: "edit", request })}
          onSubmit={save}
          onReview={review}
        />
      )}
    </>
  );
}
