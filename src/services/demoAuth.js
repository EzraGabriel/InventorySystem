export const demoAccounts = [
  {
    id: "volunteer-1",
    name: "Rina Putri",
    role: "volunteer",
    email: "volunteer@ruangstok.test",
    password: "volunteer123",
  },
  {
    id: "supervisor-1",
    name: "Britney",
    role: "supervisor",
    email: "supervisor@ruangstok.test",
    password: "supervisor123",
  },
];

const sessionKey = "ruangstok-demo-session";
const registrationsKey = "ruangstok-demo-registrations";
const normalizeEmail = (email) => email.trim().toLocaleLowerCase();

export function loadRegistrations() {
  try {
    const registrations = JSON.parse(
      localStorage.getItem(registrationsKey) || "[]",
    );
    return Array.isArray(registrations) ? registrations : [];
  } catch {
    return [];
  }
}

function saveRegistrations(registrations) {
  try {
    localStorage.setItem(registrationsKey, JSON.stringify(registrations));
    return true;
  } catch {
    return false;
  }
}

export function registerVolunteer({ name, email, password }) {
  const cleanName = name.trim();
  const cleanEmail = normalizeEmail(email);
  if (!cleanName || !cleanEmail || !password)
    return { error: "Lengkapi semua kolom terlebih dahulu." };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail))
    return { error: "Masukkan alamat email yang valid." };
  if (password.length < 8)
    return { error: "Kata sandi harus terdiri dari minimal 8 karakter." };
  if (demoAccounts.some((account) => account.email === cleanEmail)) {
    return {
      error:
        "Email tersebut sudah digunakan. Silakan masuk atau gunakan email lain.",
    };
  }

  const registrations = loadRegistrations();
  const existing = registrations.find((entry) => entry.email === cleanEmail);
  if (existing && existing.status !== "rejected") {
    return {
      error:
        existing.status === "pending"
          ? "Pendaftaran dengan email ini masih menunggu persetujuan."
          : "Email tersebut sudah terdaftar. Silakan masuk.",
    };
  }

  const registration = {
    id: globalThis.crypto?.randomUUID?.() || `registration-${Date.now()}`,
    name: cleanName,
    email: cleanEmail,
    password,
    role: "volunteer",
    status: "pending",
    createdAt: new Date().toISOString(),
  };
  const nextRegistrations = [
    ...registrations.filter((entry) => entry.email !== cleanEmail),
    registration,
  ];
  if (!saveRegistrations(nextRegistrations)) {
    return { error: "Pendaftaran belum tersimpan di browser ini. Coba lagi." };
  }
  return { registration };
}

export function reviewRegistration(id, status, reviewedBy) {
  if (!["approved", "rejected"].includes(status)) return false;
  const registrations = loadRegistrations();
  const target = registrations.find(
    (entry) => entry.id === id && entry.status === "pending",
  );
  if (!target) return false;
  target.status = status;
  target.reviewedAt = new Date().toISOString();
  target.reviewedBy = reviewedBy;
  return saveRegistrations(registrations);
}

export function signInWithDemoAccount(email, password) {
  const cleanEmail = normalizeEmail(email);
  const demoAccount = demoAccounts.find(
    (candidate) =>
      candidate.email === cleanEmail && candidate.password === password,
  );
  if (demoAccount) {
    const user = {
      id: demoAccount.id,
      name: demoAccount.name,
      role: demoAccount.role,
    };
    sessionStorage.setItem(sessionKey, JSON.stringify(user));
    return { user };
  }

  const registration = loadRegistrations().find(
    (candidate) =>
      candidate.email === cleanEmail && candidate.password === password,
  );
  if (!registration) return { error: "invalid" };
  if (registration.status === "pending") return { error: "pending" };
  if (registration.status === "rejected") return { error: "rejected" };

  const user = {
    id: registration.id,
    name: registration.name,
    role: "volunteer",
  };
  sessionStorage.setItem(sessionKey, JSON.stringify(user));
  return { user };
}

export function readDemoSession() {
  try {
    const user = JSON.parse(sessionStorage.getItem(sessionKey) || "null");
    return user && ["volunteer", "supervisor"].includes(user.role)
      ? user
      : null;
  } catch {
    return null;
  }
}

export function signOutDemoUser() {
  sessionStorage.removeItem(sessionKey);
}
