export function PageHeader({ kicker, title, description, action }) {
  return (
    <div className="page-head">
      <div>
        <div className="eyebrow">{kicker}</div>
        <h1>{title}</h1>
        <p className="page-description">{description}</p>
      </div>
      {action}
    </div>
  );
}
