export function Logo({ size = 28 }: { size?: number }) {
  return (
    <div className="flex items-center gap-2">
      <div
        className="grid place-items-center rounded-lg flame-gradient shadow-glow text-black font-black"
        style={{ width: size, height: size, fontSize: size * 0.55 }}
      >
        W
      </div>
      <span className="font-black tracking-tight text-lg">
        WAR<span className="flame-text">fit</span>
      </span>
    </div>
  );
}
