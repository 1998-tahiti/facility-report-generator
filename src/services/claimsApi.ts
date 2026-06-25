import Papa from "papaparse";

type CsvRow = Record<string, string>;

export type BonusMetrics = {
  shortTermHospitalization: string;
  strHospitalizationNationalAvg: string;
  strHospitalizationStateAvg: string;
  strEdVisit: string;
  strEdVisitNationalAvg: string;
  strEdVisitStateAvg: string;
  ltHospitalization: string;
  ltHospitalizationNationalAvg: string;
  ltHospitalizationStateAvg: string;
  edVisit: string;
  ltEdVisitNationalAvg: string;
  ltEdVisitStateAvg: string;
};

export async function getClaimsMetricsByCCN(
  ccn: string
): Promise<BonusMetrics | null> {
  const response = await fetch("/NH_QualityMsr_Claims_Jun2026.csv");
  const csvText = await response.text();

  const parsed = Papa.parse<CsvRow>(csvText, {
    header: true,
    skipEmptyLines: true,
  });

  const rows = parsed.data.filter(
    (item) => item["CMS Certification Number (CCN)"] === ccn
  );

  if (rows.length === 0) {
    return null;
  }

  const shortStayHosp = rows.find(
    (r) => r["Measure Code"] === "521"
  );

  const shortStayEd = rows.find(
    (r) => r["Measure Code"] === "522"
  );

  const longStayHosp = rows.find(
    (r) => r["Measure Code"] === "551"
  );

  const longStayEd = rows.find(
    (r) => r["Measure Code"] === "552"
  );

  return {
    shortTermHospitalization:
      shortStayHosp?.["Adjusted Score"] || "",

    strHospitalizationNationalAvg: "",
    strHospitalizationStateAvg: "",

    strEdVisit:
      shortStayEd?.["Adjusted Score"] || "",

    strEdVisitNationalAvg: "",
    strEdVisitStateAvg: "",

    ltHospitalization:
      longStayHosp?.["Adjusted Score"] || "",

    ltHospitalizationNationalAvg: "",
    ltHospitalizationStateAvg: "",

    edVisit:
      longStayEd?.["Adjusted Score"] || "",

    ltEdVisitNationalAvg: "",
    ltEdVisitStateAvg: "",
  };
}