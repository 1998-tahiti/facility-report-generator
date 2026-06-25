import Papa from "papaparse";

type CsvRow = Record<string, string>;

export type StateAverages = {
  strHospitalizationNationalAvg: string;
  strHospitalizationStateAvg: string;
  strEdVisitNationalAvg: string;
  strEdVisitStateAvg: string;
  ltHospitalizationNationalAvg: string;
  ltHospitalizationStateAvg: string;
  ltEdVisitNationalAvg: string;
  ltEdVisitStateAvg: string;
};

export async function getStateAverages(
  state: string
): Promise<StateAverages | null> {
  const response = await fetch("/NH_StateUSAverages_Jun2026.csv");
  const csvText = await response.text();

  const parsed = Papa.parse<CsvRow>(csvText, {
    header: true,
    skipEmptyLines: true,
  });

  const nation = parsed.data.find(
    (row) => row["State or Nation"] === "NATION"
  );

  const stateRow = parsed.data.find(
    (row) => row["State or Nation"] === state
  );

  if (!nation || !stateRow) {
    return null;
  }

  return {
  strHospitalizationNationalAvg:
    nation["Percentage of short stay residents who were rehospitalized after a nursing home admission"] || "",

  strHospitalizationStateAvg:
    stateRow["Percentage of short stay residents who were rehospitalized after a nursing home admission"] || "",

  strEdVisitNationalAvg:
    nation["Percentage of short stay residents who had an outpatient emergency department visit"] || "",

  strEdVisitStateAvg:
    stateRow["Percentage of short stay residents who had an outpatient emergency department visit"] || "",

  ltHospitalizationNationalAvg:
    nation["Number of hospitalizations per 1000 long-stay resident days"] || "",

  ltHospitalizationStateAvg:
    stateRow["Number of hospitalizations per 1000 long-stay resident days"] || "",

  ltEdVisitNationalAvg:
    nation["Number of outpatient emergency department visits per 1000 long-stay resident days"] || "",

  ltEdVisitStateAvg:
    stateRow["Number of outpatient emergency department visits per 1000 long-stay resident days"] || "",
};
}