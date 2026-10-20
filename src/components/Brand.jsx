import { Layers3 } from "lucide-react";

export function Brand({ mobile = false }) {
  return (
    <div className={mobile ? "mobile-brand" : "brand"}>
      <div className="brand-mark" aria-hidden="true">
        <Layers3 />
      </div>
      {mobile ? (
        "ruangstok"
      ) : (
        <div>
          <div className="brand-name">GMS Sidoarjo</div>
          <div className="brand-sub">Inventaris Multimedia</div>
        </div>
      )}
    </div>
  );
}
