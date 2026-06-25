import type { Facility } from "../types/Facility";

type CmsResponse = {
  results: Array<Record<string, string>>;
};


// const API_URL = "/cms/provider-data/api/1/datastore/query/4pq5-n9py/0";

export async function getFacilityByCCN(ccn: string): Promise<Facility | null> {
//   const url = `${API_URL}?conditions%5B0%5D%5Bproperty%5D=cms_certification_number_ccn&conditions%5B0%5D%5Boperator%5D=%3D&conditions%5B0%5D%5Bvalue%5D=${ccn}&limit=1`;

  const response = await fetch(`/api/cms?ccn=${ccn}`);

  if (!response.ok) {
    throw new Error("CMS API failed");
  }

  const data: CmsResponse = await response.json();
  const row = data.results[0];

  if (!row) {
    return null;
  }

  return {
    ccn: row.cms_certification_number_ccn || "",
    providerName: row.provider_name || "",
    providerAddress: row.provider_address || "",
    city: row.citytown || "",
    state: row.state || "",
    zipCode: row.zip_code || "",
    certifiedBeds: row.number_of_certified_beds || "",
    averageResidentsPerDay: row.average_number_of_residents_per_day || "",
    overallRating: row.overall_rating || "",
    healthInspectionRating: row.health_inspection_rating || "",
    staffingRating: row.staffing_rating || "",
    qmRating: row.qm_rating || "",
    location: row.location || "",
  };
}