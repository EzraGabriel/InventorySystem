import { useState } from "react";
import { ArrowLeft, CheckCircle2, Layers3 } from "lucide-react";
import { Link } from "react-router-dom";

export function RegistrationPage({ onRegister }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const submit = (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      setError("Konfirmasi kata sandi belum sama.");
      return;
    }
    const result = onRegister({ name, email, password });
    if (result.error) {
      setError(result.error);
      return;
    }
    setError("");
    setSubmitted(true);
  };

  return (
    <main className="login-page registration-page">
      <section className="login-side" aria-labelledby="registration-title">
        <div className="login-form-wrap">
          <div className="login-brand" aria-label="Ruangstok">
            <span className="brand-mark" aria-hidden="true"><Layers3 /></span>
            <span><strong>GMS Sidoarjo</strong><small>Inventaris Multimedia</small></span>
          </div>

          {submitted ? (
            <div className="registration-success" role="status">
              <CheckCircle2 aria-hidden="true" />
              <h1 id="registration-title">Pendaftaran terkirim</h1>
              <p>Akunmu menunggu persetujuan supervisor. Kamu bisa masuk setelah akun disetujui.</p>
              <Link className="login-submit registration-back" to="/login"><ArrowLeft aria-hidden="true" /> Kembali ke login</Link>
            </div>
          ) : (
            <>
              <div className="login-heading">
                <h1 id="registration-title">Buat akun</h1>
                <p>Daftar sebagai Volunteer. Supervisor akan meninjau pendaftaranmu.</p>
              </div>

              <form className="login-form registration-form" onSubmit={submit} noValidate>
                <div className="login-field">
                  <label htmlFor="registration-name">Nama lengkap</label>
                  <input
                    className="registration-input"
                    autoComplete="name"
                    id="registration-name"
                    name="name"
                    value={name}
                    onChange={(event) => { setName(event.target.value); setError(""); }}
                    maxLength={60}
                    required
                  />
                </div>
                <div className="login-field">
                  <label htmlFor="registration-email">Email</label>
                  <input
                    className="registration-input"
                    autoComplete="email"
                    id="registration-email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={(event) => { setEmail(event.target.value); setError(""); }}
                    required
                  />
                </div>
                <div className="login-field">
                  <label htmlFor="registration-password">Kata sandi</label>
                  <input
                    className="registration-input"
                    autoComplete="new-password"
                    id="registration-password"
                    name="password"
                    type="password"
                    value={password}
                    onChange={(event) => { setPassword(event.target.value); setError(""); }}
                    minLength={8}
                    required
                  />
                  <span className="registration-hint">Minimal 8 karakter.</span>
                </div>
                <div className="login-field">
                  <label htmlFor="registration-confirm-password">Konfirmasi kata sandi</label>
                  <input
                    className="registration-input"
                    autoComplete="new-password"
                    id="registration-confirm-password"
                    name="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(event) => { setConfirmPassword(event.target.value); setError(""); }}
                    required
                  />
                </div>

                {error && <p className="login-error" role="alert">{error}</p>}
                <button className="login-submit" type="submit">Kirim pendaftaran</button>
              </form>

              <p className="registration-existing">Sudah punya akun? <Link to="/login">Masuk</Link></p>
              <p className="registration-demo-note">Mode demo: pendaftaran tersimpan di browser ini dan perlu disetujui Supervisor.</p>
            </>
          )}
        </div>
      </section>
    </main>
  );
}
