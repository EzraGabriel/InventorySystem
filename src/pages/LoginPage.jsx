import { useState } from "react";
import { ArrowRight, Eye, EyeOff, Layers3, LockKeyhole, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { demoAccounts } from "../services/demoAuth.js";

export function LoginPage({ onSignIn }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const chooseAccount = (account) => {
    setEmail(account.email);
    setPassword(account.password);
    setError("");
  };

  const submit = (event) => {
    event.preventDefault();
    const result = onSignIn(email, password);
    if (result.error === "pending") setError("Akunmu masih menunggu persetujuan supervisor.");
    else if (result.error === "rejected") setError("Pendaftaran belum disetujui. Hubungi supervisor untuk informasi lebih lanjut.");
    else if (result.error) setError("Email atau kata sandi belum cocok. Periksa kembali atau gunakan akun demo.");
  };

  return (
    <main className="login-page">
      <section className="login-side" aria-labelledby="login-title">
        <div className="login-form-wrap">
          <div className="login-brand" aria-label="Ruangstok">
            <span className="brand-mark" aria-hidden="true"><Layers3 /></span>
            <span><strong>GMS Sidoarjo</strong><small>Inventaris Multimedia</small></span>
          </div>
          <div className="login-heading">
            <h1 id="login-title">Masuk</h1>
            <p>Gunakan akun Ruangstok untuk melanjutkan.</p>
          </div>

          <form className="login-form" onSubmit={submit} noValidate>
            <div className="login-field">
              <label htmlFor="login-email">Email</label>
              <div className="login-input-wrap">
                <Mail aria-hidden="true" />
                <input
                  autoComplete="username"
                  id="login-email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(event) => { setEmail(event.target.value); setError(""); }}
                  placeholder="nama@contoh.com"
                  required
                />
              </div>
            </div>

            <div className="login-field">
              <label htmlFor="login-password">Kata sandi</label>
              <div className="login-input-wrap">
                <LockKeyhole aria-hidden="true" />
                <input
                  autoComplete="current-password"
                  id="login-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => { setPassword(event.target.value); setError(""); }}
                  placeholder="Masukkan kata sandi"
                  required
                />
                <button
                  type="button"
                  className="login-password-toggle"
                  onClick={() => setShowPassword((shown) => !shown)}
                  aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                  aria-pressed={showPassword}
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
            </div>

            {error && <p className="login-error" role="alert">{error}</p>}

            <button className="login-submit" type="submit">
              Masuk <ArrowRight aria-hidden="true" />
            </button>
          </form>

          <p className="login-register-link">Belum punya akun? <Link to="/register">Daftar</Link></p>

          <section className="demo-accounts" aria-labelledby="demo-accounts-title">
            <div className="demo-accounts-heading">
              <h2 id="demo-accounts-title">Akun demo</h2>
              <span>Untuk pengujian</span>
            </div>
            <div className="demo-account-list">
              {demoAccounts.map((account) => (
                <button className="demo-account" key={account.id} type="button" onClick={() => chooseAccount(account)}>
                  <span className="demo-account-copy">
                    <strong>{account.role === "supervisor" ? "Supervisor" : "Volunteer"}</strong>
                    <small>{account.email}</small>
                  </span>
                  <span className="demo-account-action">Pilih</span>
                </button>
              ))}
            </div>
            <p className="demo-password-note">Kata sandi: <code>volunteer123</code> (Volunteer) · <code>supervisor123</code> (Supervisor)</p>
          </section>

          <p className="login-demo-note">Mode demo frontend · kredensial hanya untuk pengujian.</p>
        </div>
      </section>
    </main>
  );
}
