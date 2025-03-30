"use client";
export default function Status({
  name,
  status,
  className,
}: {
  name: string;
  status: string;
  className?: string;
}) {
  return (
    <div
      className={`flex items-center justify-center lg:justify-start ${className}`}
    >
      <div style={{ marginRight: "8px" }} className={`status-${status}`}>
        &bull;
      </div>
      <span className={`status-${status} hidden lg:block whitespace-nowrap`}>
        {name}
      </span>
    </div>
  );
}
