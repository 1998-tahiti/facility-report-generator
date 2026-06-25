import { useState } from "react";
import CCNSearch from "./components/CCNSearch";
import ReportPreview from "./components/ReportPreview";
import type { Facility } from "./types/Facility";

function App() {
  const [facility, setFacility] = useState<Facility | null>(null);

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-5xl rounded-xl bg-white p-6 shadow">
        <h1 className="text-3xl font-bold">Facility Report Generator</h1>

        <div className="mt-6">
          <CCNSearch onFacilityFound={setFacility} />
        </div>

        {facility && <ReportPreview facility={facility} />}
      </div>
    </main>
  );
}

export default App;