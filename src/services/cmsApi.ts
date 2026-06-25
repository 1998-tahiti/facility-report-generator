import Papa from "papaparse";
import type { Facility } from "../types/Facility";

type CsvRow = Record<string, string>;

export async function getFacilityByCCN(ccn: string): Promise<Facility | null> {
  const response = await fetch("/NH_ProviderInfo_May2026.csv");
  const csvText = await response.text();

  const parsed = Papa.parse<CsvRow>(csvText, {
    header: true,
    skipEmptyLines: true,
  });

  const row = parsed.data.find(
    (item) => item["CMS Certification Number (CCN)"] === ccn
  );

  if (!row) {
    return null;
  }

  return {
    ccn: row["CMS Certification Number (CCN)"] || "",
    providerName: row["Provider Name"] || "",
    providerAddress: row["Provider Address"] || "",
    city: row["City/Town"] || "",
    state: row["State"] || "",
    zipCode: row["ZIP Code"] || "",
    certifiedBeds: row["Number of Certified Beds"] || "",
    averageResidentsPerDay: row["Average Number of Residents per Day"] || "",
    overallRating: row["Overall Rating"] || "",
    healthInspectionRating: row["Health Inspection Rating"] || "",
    staffingRating: row["Staffing Rating"] || "",
    qmRating: row["QM Rating"] || "",
    location: row["Location"] || "",
  };
}