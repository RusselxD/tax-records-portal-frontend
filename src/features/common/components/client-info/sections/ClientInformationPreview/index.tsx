import type { ClientInformation } from "../../../../../../types/client-info";
import { CollapsibleSubsection } from "../../../../../../components/common";
import { ORGANIZATION_TYPE_LABELS } from "../../enum-labels";
import { TextDisplay, EnumDisplay } from "../../field-displays";
import BirBranchPreview, { branchHasData } from "./components/BirBranchPreview";
import BirTaxCompliancePreview, { hasBirTaxComplianceData } from "./components/BirTaxCompliancePreview";
import BirComplianceBreakdownPreview, { hasBirComplianceBreakdownData } from "./components/BirComplianceBreakdownPreview";
import DtiDetailsPreview, { hasDtiData } from "./components/DtiDetailsPreview";
import SecDetailsPreview, { hasSecData } from "./components/SecDetailsPreview";
import GovernmentAgencyPreview, { agencyHasData } from "./components/GovernmentAgencyPreview";
import CityHallDetailsPreview from "./components/CityHallDetailsPreview";
import OtherPermitsPreview from "./components/OtherPermitsPreview";

export default function ClientInformationPreview({ data }: { data: ClientInformation }) {
  const hasHeader = !!(
    data.registeredName ||
    data.tradeName ||
    data.numberOfBranches > 0 ||
    data.organizationType
  );

  const hasMainBranch = branchHasData(data.birMainBranch);
  const hasBranches = data.birBranches.some(branchHasData);
  const hasTaxCompliance = hasBirTaxComplianceData(data.birTaxCompliance);
  const hasComplianceBreakdown = hasBirComplianceBreakdownData(data.birComplianceBreakdown);
  const hasDti = hasDtiData(data.dtiDetails);
  const hasSec = hasSecData(data.secDetails);
  const hasSss = agencyHasData(data.sssDetails);
  const hasPhilhealth = agencyHasData(data.philhealthDetails);
  const hasHdmf = agencyHasData(data.hdmfDetails);
  const hasCityHall = data.cityHallDetails.length > 0;
  const hasOtherPermits = data.otherPermits?.length > 0;

  const hasAnyData =
    hasHeader || hasMainBranch || hasBranches || hasTaxCompliance ||
    hasComplianceBreakdown || hasDti || hasSec ||
    hasSss || hasPhilhealth || hasHdmf || hasCityHall || hasOtherPermits;

  if (!hasAnyData) return null;

  return (
    <div className="space-y-3">
      {hasHeader && (
        <CollapsibleSubsection title="General Information">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
            <TextDisplay label="Registered Name" value={data.registeredName} />
            <TextDisplay label="Trade Name" value={data.tradeName} />
            <TextDisplay label="Number of Branches" value={data.numberOfBranches} />
            <EnumDisplay
              label="Organization Type"
              value={data.organizationType}
              labels={ORGANIZATION_TYPE_LABELS}
            />
          </div>
        </CollapsibleSubsection>
      )}

      {(hasMainBranch || hasBranches) && (
        <CollapsibleSubsection title="BIR Branch Details" defaultOpen={false}>
          <div className="space-y-3">
            <BirBranchPreview data={data.birMainBranch} label="Main Branch" />
            {data.birBranches.map((branch, i) => (
              <BirBranchPreview key={i} data={branch} label={`Branch #${i + 1}`} />
            ))}
          </div>
        </CollapsibleSubsection>
      )}

      {hasTaxCompliance && (
        <CollapsibleSubsection title="BIR Tax Compliance" defaultOpen={false}>
          <BirTaxCompliancePreview data={data.birTaxCompliance} />
        </CollapsibleSubsection>
      )}

      {hasComplianceBreakdown && (
        <CollapsibleSubsection title="BIR Compliance Breakdown" defaultOpen={false}>
          <BirComplianceBreakdownPreview data={data.birComplianceBreakdown} />
        </CollapsibleSubsection>
      )}

      {hasDti && (
        <CollapsibleSubsection title="DTI Details" defaultOpen={false}>
          <DtiDetailsPreview data={data.dtiDetails} />
        </CollapsibleSubsection>
      )}

      {hasSec && (
        <CollapsibleSubsection title="SEC Details" defaultOpen={false}>
          <SecDetailsPreview data={data.secDetails} />
        </CollapsibleSubsection>
      )}

      {hasSss && (
        <CollapsibleSubsection title="SSS Details" defaultOpen={false}>
          <GovernmentAgencyPreview data={data.sssDetails} />
        </CollapsibleSubsection>
      )}

      {hasPhilhealth && (
        <CollapsibleSubsection title="PhilHealth Details" defaultOpen={false}>
          <GovernmentAgencyPreview data={data.philhealthDetails} />
        </CollapsibleSubsection>
      )}

      {hasHdmf && (
        <CollapsibleSubsection title="HDMF / Pag-IBIG Details" defaultOpen={false}>
          <GovernmentAgencyPreview data={data.hdmfDetails} />
        </CollapsibleSubsection>
      )}

      {hasCityHall && (
        <CollapsibleSubsection title="City Hall Details" defaultOpen={false}>
          <CityHallDetailsPreview data={data.cityHallDetails} />
        </CollapsibleSubsection>
      )}

      {hasOtherPermits && (
        <CollapsibleSubsection title="Other Permits" defaultOpen={false}>
          <OtherPermitsPreview data={data.otherPermits} />
        </CollapsibleSubsection>
      )}
    </div>
  );
}
