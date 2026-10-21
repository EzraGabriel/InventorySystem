import { Check, CheckCircle2, UserRoundCheck, X } from "lucide-react";
import { Button } from "../components/Button.jsx";
import { PageHeader } from "../components/PageHeader.jsx";

const submittedAt = (date) => new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "short",
  year: "numeric",
}).format(new Date(date));

export function ApprovalsPage({ registrations, onReview }) {
  const pending = registrations.filter((registration) => registration.status === "pending");

  return (
    <>
      <PageHeader
        kicker="Akun pengguna"
        title="Persetujuan pendaftaran"
        description="Tinjau pendaftaran Volunteer sebelum mereka dapat menggunakan aplikasi."
      />
      <section className="panel approval-panel" aria-labelledby="approval-list-title">
        <header className="approval-panel-head">
          <div>
            <h2 id="approval-list-title">Menunggu ditinjau</h2>
            <p className="panel-sub">{pending.length} pendaftaran menunggu keputusan.</p>
          </div>
          <span className="approval-count" aria-label={`${pending.length} pendaftaran menunggu`}>{pending.length}</span>
        </header>

        {pending.length ? (
          <div className="approval-list">
            {pending.map((registration) => (
              <article className="approval-row" key={registration.id}>
                <div className="approval-applicant-icon" aria-hidden="true"><UserRoundCheck /></div>
                <div className="approval-applicant">
                  <h3>{registration.name}</h3>
                  <p>{registration.email}</p>
                  <small>Volunteer · Dikirim {submittedAt(registration.createdAt)}</small>
                </div>
                <div className="approval-actions">
                  <Button
                    type="button"
                    icon={Check}
                    variant="primary"
                    onClick={() => onReview(registration.id, "approved")}
                  >
                    Setujui
                  </Button>
                  <Button
                    type="button"
                    icon={X}
                    variant="soft-danger"
                    onClick={() => onReview(registration.id, "rejected")}
                  >
                    Tolak
                  </Button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="approval-empty">
            <CheckCircle2 aria-hidden="true" />
            <strong>Tidak ada pendaftaran yang menunggu.</strong>
            <p>Pendaftaran baru akan muncul di sini.</p>
          </div>
        )}
      </section>
    </>
  );
}
