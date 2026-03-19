type Filter = "all" | "pending" | "purchased";

interface Props {
  current: Filter;
  onChange: (f: Filter) => void;
}

export default function FilterBar({ current, onChange }: Props) {
  return (
    <div className="flex gap-2">
      {["all", "pending", "purchased"].map((f) => (
        <button
          key={f}
          onClick={() => onChange(f as Filter)}
          className={`px-4 py-2 rounded-xl ${
            current === f ? "bg-black text-white" : "bg-gray-100"
          }`}
        >
          {f}
        </button>
      ))}
    </div>
  );
}