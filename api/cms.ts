export default async function handler(req: any, res: any) {
  const { ccn } = req.query;

  const cmsUrl =
    `https://data.cms.gov/provider-data/api/1/datastore/query/4pq5-n9py/0` +
    `?conditions%5B0%5D%5Bproperty%5D=cms_certification_number_ccn` +
    `&conditions%5B0%5D%5Boperator%5D=%3D` +
    `&conditions%5B0%5D%5Bvalue%5D=${ccn}` +
    `&limit=1`;

  try {
    const response = await fetch(cmsUrl);
    const data = await response.json();

    res.status(200).json(data);
  } catch {
    res.status(500).json({ error: "CMS API failed" });
  }
}