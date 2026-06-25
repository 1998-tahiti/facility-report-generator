import { useState } from "react";
import { getFacilityByCCN } from "../services/cmsApi";
import type { Facility } from "../types/Facility";

type Props = {
  onFacilityFound: (facility: Facility) => void;
};

export default function CCNSearch({ onFacilityFound }: Props) {
  const [ccn, setCcn] = useState("");
  const [error, setError] = useState("");

  const handleSearch = async () => {
    setError("");

    const result = await getFacilityByCCN(ccn.trim());

    if (!result) {
      setError("No facility found for this CCN.");
      return;
    }

    onFacilityFound(result);
  };

  return (
    <div className="space-y-4">
      <input
        type="text"
        value={ccn}
        onChange={(e) => setCcn(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSearch();
          }
        }}
        placeholder="Enter CCN, e.g. 686123"
        className="w-full rounded border p-3"
      />

      <button
        onClick={handleSearch}
        className="cursor-pointer rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
      >
        Search
      </button>

      {error && <p className="text-red-600">{error}</p>}
    </div>
  );
}