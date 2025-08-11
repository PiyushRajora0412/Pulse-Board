export default function Spinner({ size = 18 }) {
  const border = Math.max(2, Math.floor(size / 9));
  return (
    <span
      className="inline-block animate-spin rounded-full border-t-transparent border-indigo-400"
      style={{ width: size, height: size, borderWidth: border }}
    />
  );
}
