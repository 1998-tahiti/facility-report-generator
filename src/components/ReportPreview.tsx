import type { Facility } from "../types/Facility";
import { useState, useEffect } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  getClaimsMetricsByCCN,
  type BonusMetrics,
} from "../services/claimsApi";

import {
  getStateAverages,
  type StateAverages,
} from "../services/stateAveragesApi";

type Props = {
  facility: Facility;
};

export default function ReportPreview({ facility }: Props) {
    const [formData, setFormData] = useState({
    currentCensus: "",
    emr: "",
    patientType: "",
    previousCoverage: "",
    providerPerformance: "",
    medicalCoverage: "",
    recommendations: "",
    facilityNameOverride: "",
    });

    const [bonusMetrics, setBonusMetrics] =
    useState<BonusMetrics | null>(null);

    const [stateAverages, setStateAverages] =
    useState<StateAverages | null>(null);

    const finalFacilityName =
        formData.facilityNameOverride.trim() !== ""
            ? formData.facilityNameOverride
            : facility.providerName;
    const medicareUrl = `https://www.medicare.gov/care-compare/details/nursing-home/${facility.ccn}`;

    useEffect(() => {
        async function loadBonusData() {
            const claims = await getClaimsMetricsByCCN(facility.ccn);
            const averages = await getStateAverages(facility.state);

            setBonusMetrics(claims);
            setStateAverages(averages);
        }

        loadBonusData();
        }, [facility.ccn, facility.state]);

    const downloadPDF = () => {
    const doc = new jsPDF();

    const pageWidth = doc.internal.pageSize.getWidth();

    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("INFINITE — Managed by MEDELITE", pageWidth / 2, 18, {
    align: "center",
    });

    doc.setFontSize(14);
    doc.text("FACILITY ASSESSMENT SNAPSHOT", pageWidth / 2, 28, {
    align: "center",
    });

    doc.setFontSize(12);
    doc.text(facility.state, pageWidth / 2, 36, {
    align: "center",
    });

    autoTable(doc, {
        startY: 42,
        margin: { left: 22, right: 22 },
        body: [
        ["Name of Facility", finalFacilityName],
        ["Location", facility.location],
        ["Census Capacity", facility.certifiedBeds],
        ["Current Census", formData.currentCensus || "N/A"],
        ["EMR", formData.emr || "N/A"],
        ["Type of Patient", formData.patientType || "N/A"],
        ["Previous Coverage", formData.previousCoverage || "N/A"],
        ["Previous Provider Performance", formData.providerPerformance || "N/A"],
        ["Medical Coverage", formData.medicalCoverage || "N/A"],
        ["Overall Rating", facility.overallRating],
        ["Health Inspection", facility.healthInspectionRating],
        ["Staffing", facility.staffingRating],
        ["Quality of Resident Care", facility.qmRating],
        
        ...(bonusMetrics && stateAverages
  ? [
      ["Short Term Hospitalization", bonusMetrics.shortTermHospitalization],
      ["STR National Avg. for Hospitalization", stateAverages.strHospitalizationNationalAvg],
      ["STR State Avg. for Hospitalization", stateAverages.strHospitalizationStateAvg],

      ["STR ED Visit", bonusMetrics.strEdVisit],
      ["STR ED Visits National Avg.", stateAverages.strEdVisitNationalAvg],
      ["STR ED Visits State Avg.", stateAverages.strEdVisitStateAvg],

      ["LT Hospitalization", bonusMetrics.ltHospitalization],
      ["LT National Avg. for Hospitalization", stateAverages.ltHospitalizationNationalAvg],
      ["LT State Avg. for Hospitalization", stateAverages.ltHospitalizationStateAvg],

      ["ED Visit", bonusMetrics.edVisit],
      ["LT ED Visits National Avg.", stateAverages.ltEdVisitNationalAvg],
      ["LT ED Visits State Avg.", stateAverages.ltEdVisitStateAvg],
    ]
  : []),


        ["Recommendations", formData.recommendations || "N/A"],
        ["Medicare Source", medicareUrl],
        ],
         theme: "grid",

    styles: {
        font: "helvetica",
        fontSize: 10,
        cellPadding: 3,
        lineWidth: 0.5,
        lineColor: [0, 0, 0],
        textColor: [0, 0, 0],
        fillColor: [255, 255, 255],
        valign: "middle",
    },

    columnStyles: {
        0: {
            cellWidth: 82,
            fontStyle: "bold",
            halign: "left",
        },
        1: {
            cellWidth: "auto",
            fontStyle: "italic",
            halign: "left",
        },
    },

    tableLineWidth: 0.5,
    tableLineColor: [0, 0, 0],
});

    doc.save("facility-report.pdf");
    };

  return (
    <div className="mx-auto mt-8 max-w-5xl rounded bg-white p-8 shadow-lg">
        <div className="mb-4 border-b pb-3 text-center">
            <h1 className="text-2xl font-bold">
                INFINITE — Managed by MEDELITE
            </h1>
            <p className="text-sm font-semibold text-gray-600">
                FACILITY ASSESSMENT SNAPSHOT - {facility.state}
            </p>
        </div>
      <h2 className="mb-4 text-center text-xl font-bold">
        FACILITY ASSESSMENT SNAPSHOT
      </h2>

      <button
        onClick={downloadPDF}
        className="mb-4 rounded cursor-pointer bg-blue-600 px-4 py-2 text-white"
        >
        Download PDF
      </button>
        
      <table className="w-full border-collapse border-2 border-black text-base">
        <tbody>
          <tr>
            <td className="w-2/5 border border-black bg-white px-4 py-3 text-base font-bold align-middle">Name of Facility</td>
            <td className="w-3/5 border border-black bg-white px-4 py-3 align-middle italic">
                <input
                className="w-full rounded border p-2"
                placeholder={facility.providerName}
                value={formData.facilityNameOverride}
                onChange={(e) =>
                    setFormData({
                    ...formData,
                    facilityNameOverride: e.target.value,
                    })
                }
                />
            </td>
            </tr>

            <tr><td className="w-2/5 border border-black bg-white px-4 py-3 text-base font-bold align-middle">Location</td><td className="w-3/5 border border-black bg-white px-4 py-3 align-middle italic">{facility.location}</td></tr>

            <tr>
            <td className="w-2/5 border border-black bg-white px-4 py-3 text-base font-bold align-middle">EMR</td>
            <td className="w-3/5 border border-black bg-white px-4 py-3 align-middle italic">
                <input className="w-full rounded border p-2" value={formData.emr}
                onChange={(e) => setFormData({ ...formData, emr: e.target.value })}
                />
            </td>
            </tr>

            <tr><td className="w-2/5 border border-black bg-white px-4 py-3 text-base font-bold align-middle">Census Capacity</td><td className="w-3/5 border border-black bg-white px-4 py-3 align-middle italic">{facility.certifiedBeds}</td></tr>

            <tr>
            <td className="w-2/5 border border-black bg-white px-4 py-3 text-base font-bold align-middle">Current Census</td>
            <td className="w-3/5 border border-black bg-white px-4 py-3 align-middle italic">
                <input className="w-full rounded border p-2" value={formData.currentCensus}
                onChange={(e) => setFormData({ ...formData, currentCensus: e.target.value })}
                />
            </td>
            </tr>

            <tr>
            <td className="w-2/5 border border-black bg-white px-4 py-3 text-base font-bold align-middle">Type of Patient</td>
            <td className="w-3/5 border border-black bg-white px-4 py-3 align-middle italic">
                <input className="w-full rounded border p-2" value={formData.patientType}
                onChange={(e) => setFormData({ ...formData, patientType: e.target.value })}
                />
            </td>
            </tr>

            <tr>
            <td className="w-2/5 border border-black bg-white px-4 py-3 text-base font-bold align-middle">Previous Coverage from Medelite</td>
            <td className="w-3/5 border border-black bg-white px-4 py-3 align-middle italic">
                <select className="w-full rounded border p-2" value={formData.previousCoverage}
                onChange={(e) => setFormData({ ...formData, previousCoverage: e.target.value })}
                >
                <option value="">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
                </select>
            </td>
            </tr>

            <tr>
            <td className="w-2/5 border border-black bg-white px-4 py-3 text-base font-bold align-middle">Previous Provider Performance from Medelite</td>
            <td className="w-3/5 border border-black bg-white px-4 py-3 align-middle italic">
                <input className="w-full rounded border p-2" value={formData.providerPerformance}
                onChange={(e) => setFormData({ ...formData, providerPerformance: e.target.value })}
                />
            </td>
            </tr>

            <tr>
            <td className="w-2/5 border border-black bg-white px-4 py-3 text-base font-bold align-middle">Medical Coverage</td>
            <td className="w-3/5 border border-black bg-white px-4 py-3 align-middle italic">
                <input className="w-full rounded border p-2" value={formData.medicalCoverage}
                onChange={(e) => setFormData({ ...formData, medicalCoverage: e.target.value })}
                />
            </td>
            </tr>

            <tr><td className="w-2/5 border border-black bg-white px-4 py-3 text-base font-bold align-middle">Overall Star Rating</td><td className="w-3/5 border border-black bg-white px-4 py-3 align-middle italic">{facility.overallRating}</td></tr>
            <tr><td className="w-2/5 border border-black bg-white px-4 py-3 text-base font-bold align-middle">Health Inspection</td><td className="w-3/5 border border-black bg-white px-4 py-3 align-middle italic">{facility.healthInspectionRating}</td></tr>
            <tr><td className="w-2/5 border border-black bg-white px-4 py-3 text-base font-bold align-middle">Staffing</td><td className="w-3/5 border border-black bg-white px-4 py-3 align-middle italic">{facility.staffingRating}</td></tr>
            <tr><td className="w-2/5 border border-black bg-white px-4 py-3 text-base font-bold align-middle">Quality of Resident Care</td><td className="w-3/5 border border-black bg-white px-4 py-3 align-middle italic">{facility.qmRating}</td></tr>

            <tr><td className="w-2/5 border border-black bg-white px-4 py-3 text-base font-bold align-middle">Short Term Hospitalization</td><td className="w-3/5 border border-black bg-white px-4 py-3 align-middle italic">{bonusMetrics?.shortTermHospitalization ?? "N/A"}</td></tr>
            <tr><td className="w-2/5 border border-black bg-white px-4 py-3 text-base font-bold align-middle">STR National Avg. for Hospitalization</td><td className="w-3/5 border border-black bg-white px-4 py-3 align-middle italic">{stateAverages?.strHospitalizationNationalAvg ?? "N/A"}</td></tr>
            <tr><td className="w-2/5 border border-black bg-white px-4 py-3 text-base font-bold align-middle">STR State National Avg. for Hospitalization</td><td className="w-3/5 border border-black bg-white px-4 py-3 align-middle italic">{stateAverages?.strHospitalizationStateAvg ?? "N/A"}</td></tr>

            <tr><td className="w-2/5 border border-black bg-white px-4 py-3 text-base font-bold align-middle">STR ED Visit</td><td className="w-3/5 border border-black bg-white px-4 py-3 align-middle italic">{bonusMetrics?.strEdVisit ?? "N/A"}</td></tr>
            <tr><td className="w-2/5 border border-black bg-white px-4 py-3 text-base font-bold align-middle">STR ED Visits National Avg.</td><td className="w-3/5 border border-black bg-white px-4 py-3 align-middle italic">{stateAverages?.strEdVisitNationalAvg ?? "N/A"}</td></tr>
            <tr><td className="w-2/5 border border-black bg-white px-4 py-3 text-base font-bold align-middle">STR ED Visits State Avg.</td><td className="w-3/5 border border-black bg-white px-4 py-3 align-middle italic">{stateAverages?.strEdVisitStateAvg ?? "N/A"}</td></tr>

            <tr><td className="w-2/5 border border-black bg-white px-4 py-3 text-base font-bold align-middle">LT Hospitalization</td><td className="w-3/5 border border-black bg-white px-4 py-3 align-middle italic">{bonusMetrics?.ltHospitalization ?? "N/A"}</td></tr>
            <tr><td className="w-2/5 border border-black bg-white px-4 py-3 text-base font-bold align-middle">LT National Avg. for Hospitalization</td><td className="w-3/5 border border-black bg-white px-4 py-3 align-middle italic">{stateAverages?.ltHospitalizationNationalAvg ?? "N/A"}</td></tr>
            <tr><td className="w-2/5 border border-black bg-white px-4 py-3 text-base font-bold align-middle">LT State National Avg. for Hospitalization</td><td className="w-3/5 border border-black bg-white px-4 py-3 align-middle italic">{stateAverages?.ltHospitalizationStateAvg ?? "N/A"}</td></tr>

            <tr><td className="w-2/5 border border-black bg-white px-4 py-3 text-base font-bold align-middle">ED Visit</td><td className="w-3/5 border border-black bg-white px-4 py-3 align-middle italic">{bonusMetrics?.edVisit ?? "N/A"}</td></tr>
            <tr><td className="w-2/5 border border-black bg-white px-4 py-3 text-base font-bold align-middle">LT ED Visits National Avg.</td><td className="w-3/5 border border-black bg-white px-4 py-3 align-middle italic">{stateAverages?.ltEdVisitNationalAvg ?? "N/A"}</td></tr>
            <tr><td className="w-2/5 border border-black bg-white px-4 py-3 text-base font-bold align-middle">LT ED Visits State Avg.</td><td className="w-3/5 border border-black bg-white px-4 py-3 align-middle italic">{stateAverages?.ltEdVisitStateAvg ?? "N/A"}</td></tr>
        </tbody>
      </table>
      <p className="mt-4 text-sm">
        Medicare Source:{" "}
        <a
            href={medicareUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
        >
            View Official Medicare Profile
        </a>
        </p>
    </div>
  );
}