export function ProfileBadge({ name = "Andi Rahman" }) {
  const initials = name.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase();
  return <div className="avatar" aria-hidden="true">{initials}</div>;
}
