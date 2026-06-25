import { useState } from "react";

export default function FacilityForm() {
  const [formData, setFormData] = useState({
    nameOverride: "",
    emr: "",
    currentCensus: "",
    patientType: "",
    previousCoverage: "Yes",
    previousProviderPerformance: "",
    medicalCoverage: "",
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  return (
    <div className="mt-8 rounded border p-4">
      <h2 className="mb-4 text-xl font-bold">Manual Inputs</h2>

      <div className="grid gap-4 md:grid-cols-2">
        <input name="nameOverride" placeholder="Facility Name Override" onChange={handleChange} className="rounded border p-3" />
        <input name="emr" placeholder="EMR, e.g. PCC" onChange={handleChange} className="rounded border p-3" />
        <input name="currentCensus" placeholder="Current Census" onChange={handleChange} className="rounded border p-3" />
        <input name="patientType" placeholder="Type of Patient" onChange={handleChange} className="rounded border p-3" />

        <select name="previousCoverage" onChange={handleChange} className="rounded border p-3">
          <option value="Yes">Previous Coverage: Yes</option>
          <option value="No">Previous Coverage: No</option>
        </select>

        <input name="previousProviderPerformance" placeholder="Previous Provider Performance" onChange={handleChange} className="rounded border p-3" />
        <input name="medicalCoverage" placeholder="Medical Coverage" onChange={handleChange} className="rounded border p-3 md:col-span-2" />
      </div>
    </div>
  );
}