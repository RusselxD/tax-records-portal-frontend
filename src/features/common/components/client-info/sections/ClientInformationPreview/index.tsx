import type { ClientInformation } from "../../../../../../types/client-info";
import { ORGANIZATION_TYPE_LABELS } from "../../enum-labels";
import { TextDisplay, EnumDisplay } from "../../field-displays";
import SubsectionHeading from "../SubsectionHeading";
import BirBranchPreview, { branchHasData } from "./components/BirBranchPreview";
import BirTaxCompliancePreview from "./components/BirTaxCompliancePreview";
import BirComplianceBreakdownPreview from "./components/BirComplianceBreakdownPreview";
import DtiDetailsPreview from "./components/DtiDetailsPreview";
import SecDetailsPreview from "./components/SecDetailsPreview";
import GovernmentAgencyPreview, { agencyHasData } from "./components/GovernmentAgencyPreview";
import CityHallDetailsPreview from "./components/CityHallDetailsPreview";

export default function ClientInformationPreview({ data }: { data: ClientInformation }) {
  const hasHeader = !!(
    data.registeredName ||
    data.tradeName ||
    data.numberOfBranches > 0 ||
    data.organizationType
  );

  const hasMainBranch = branchHasData(data.birMainBranch);
  const hasBranches = data.birBranches.some(branchHasData);
  const hasSss = agencyHasData(data.sssDetails);
  const hasPhilhealth = agencyHasData(data.philhealthDetails);
  const hasHdmf = agencyHasData(data.hdmfDetails);

  // If nothing has data, skip the whole section
  const hasAnyData =
    hasHeader ||
    hasMainBranch ||
    hasBranches ||
    hasSss ||
    hasPhilhealth ||
    hasHdmf ||
    data.cityHallDetails.length > 0;

  if (!hasAnyData) return null;

  return (
    <div className="space-y-6">
        {/* Header fields */}
        {hasHeader && (
          <div className="grid grid-cols-2 gap-x-8 gap-y-5">
            <TextDisplay label="Registered Name" value={data.registeredName} />
            <TextDisplay label="Trade Name" value={data.tradeName} />
            <TextDisplay label="Number of Branches" value={data.numberOfBranches} />
            <EnumDisplay
              label="Organization Type"
              value={data.organizationType}
              labels={ORGANIZATION_TYPE_LABELS}
            />
          </div>
        )}

        {/* A. BIR Branch Details */}
        {(hasMainBranch || hasBranches) && (
          <div>
            <SubsectionHeading label="A. BIR Branch Details" />
            <div className="mt-4 space-y-3">
              <BirBranchPreview data={data.birMainBranch} label="Main Branch" />
              {data.birBranches.map((branch, i) => (
                <BirBranchPreview
                  key={i}
                  data={branch}
                  label={`Branch #${i + 1}`}
                />
              ))}
            </div>
          </div>
        )}

        {/* B. BIR Tax Compliance */}
        <div>
          <SubsectionHeading label="B. BIR Tax Compliance" />
          <div className="mt-4">
            <BirTaxCompliancePreview data={data.birTaxCompliance} />
          </div>
        </div>

        {/* C. BIR Compliance Breakdown */}
        <div>
          <SubsectionHeading label="C. BIR Compliance Breakdown" />
          <div className="mt-4">
            <BirComplianceBreakdownPreview data={data.birComplianceBreakdown} />
          </div>
        </div>

        {/* D. DTI Details */}
        <div>
          <SubsectionHeading label="D. DTI Details" />
          <div className="mt-4">
            <DtiDetailsPreview data={data.dtiDetails} />
          </div>
        </div>

        {/* E. SEC Details */}
        <div>
          <SubsectionHeading label="E. SEC Details" />
          <div className="mt-4">
            <SecDetailsPreview data={data.secDetails} />
          </div>
        </div>

        {/* F. SSS Details */}
        {hasSss && (
          <div>
            <SubsectionHeading label="F. SSS Details" />
            <div className="mt-4">
              <GovernmentAgencyPreview data={data.sssDetails} />
            </div>
          </div>
        )}

        {/* G. PhilHealth Details */}
        {hasPhilhealth && (
          <div>
            <SubsectionHeading label="G. PhilHealth Details" />
            <div className="mt-4">
              <GovernmentAgencyPreview data={data.philhealthDetails} />
            </div>
          </div>
        )}

        {/* H. HDMF / Pag-IBIG Details */}
        {hasHdmf && (
          <div>
            <SubsectionHeading label="H. HDMF / Pag-IBIG Details" />
            <div className="mt-4">
              <GovernmentAgencyPreview data={data.hdmfDetails} />
            </div>
          </div>
        )}

        {/* I. City Hall Details */}
        {data.cityHallDetails.length > 0 && (
          <div>
            <SubsectionHeading label="I. City Hall Details" />
            <div className="mt-4">
              <CityHallDetailsPreview data={data.cityHallDetails} />
            </div>
          </div>
        )}
    </div>
  );
}
