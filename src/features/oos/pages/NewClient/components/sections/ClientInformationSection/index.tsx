import { uid } from "../../../../../../../lib/uid";
import { Input, Dropdown, CollapsibleSubsection } from "../../../../../../../components/common";
import type {
  ClientInformation,
  OrganizationType,
  BirBranchDetails,
} from "../../../../../../../types/client-info";
import BirDetailsSubsection from "./BirDetailsSubsection";
import BirTaxComplianceSubsection from "./BirTaxComplianceSubsection";
import BirComplianceBreakdownSubsection from "./BirComplianceBreakdownSubsection";
import DtiDetailsSubsection from "./DtiDetailsSubsection";
import SecDetailsSubsection from "./SecDetailsSubsection";
import GovernmentAgencySubsection from "./GovernmentAgencySubsection";
import CityHallDetailsSubsection from "./CityHallDetailsSubsection";

const ORG_TYPE_OPTIONS = [
  { value: "SOLE_PROPRIETORSHIP", label: "Sole Proprietorship" },
  { value: "PROFESSIONAL", label: "Professional" },
  { value: "PARTNERSHIP", label: "Partnership" },
  { value: "OPC", label: "One Person Corporation (OPC)" },
  { value: "REGULAR_CORPORATION", label: "Regular Corporation" },
];

interface ClientInformationSectionProps {
  data: ClientInformation;
  onChange: (data: ClientInformation) => void;
}

export default function ClientInformationSection({
  data,
  onChange,
}: ClientInformationSectionProps) {
  const update = (fields: Partial<ClientInformation>) =>
    onChange({ ...data, ...fields });

  const emptyBranch = (): BirBranchDetails => ({
    _uid: uid(),
    businessTradeName: null,
    tin: null,
    rdo: null,
    completeRegisteredAddress: null,
    birRegistrationNumber: null,
    typeOfBusiness: null,
    classification: null,
    dateOfBirRegistration: null,
    birCertificateOfRegistration: null,
    birForm1901: null,
    birForm1921Atp: null,
    birForm1905: null,
    sampleInvoiceReceipts: null,
    niriPoster: null,
    birBookOfAccountsStamp: null,
    birForm2000Dst: null,
    contractOfLease: null,
  });

  const handleNumberOfBranchesChange = (value: number) => {
    const count = Math.max(0, value);
    const current = data.birBranches;
    let birBranches: BirBranchDetails[];
    if (count > current.length) {
      birBranches = [
        ...current,
        ...Array.from({ length: count - current.length }, emptyBranch),
      ];
    } else {
      birBranches = current.slice(0, count);
    }
    update({ numberOfBranches: count, birBranches });
  };

  return (
    <div className="space-y-3">
      <CollapsibleSubsection title="General Information">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Registered Name"
              value={data.registeredName ?? ""}
              onChange={(e) => update({ registeredName: e.target.value || null })}
              placeholder="Enter registered name"
            />
            <Input
              label="Trade Name"
              value={data.tradeName ?? ""}
              onChange={(e) => update({ tradeName: e.target.value || null })}
              placeholder="Enter trade name"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Number of Branches"
              type="number"
              value={data.numberOfBranches}
              onChange={(e) =>
                handleNumberOfBranchesChange(parseInt(e.target.value) || 0)
              }
              placeholder="0"
            />
            <Dropdown
              label="Organization Type"
              options={ORG_TYPE_OPTIONS}
              value={data.organizationType ?? ""}
              onChange={(v) =>
                update({
                  organizationType: (v || null) as OrganizationType | null,
                })
              }
              placeholder="Select type"
              portal
            />
          </div>
        </div>
      </CollapsibleSubsection>

      <CollapsibleSubsection title="BIR Branch Details" defaultOpen={false}>
        <BirDetailsSubsection
          mainBranch={data.birMainBranch}
          branches={data.birBranches}
          onMainBranchChange={(birMainBranch) => update({ birMainBranch })}
          onBranchesChange={(birBranches) =>
            update({ birBranches, numberOfBranches: birBranches.length })
          }
        />
      </CollapsibleSubsection>

      <CollapsibleSubsection title="BIR Tax Compliance" defaultOpen={false}>
        <BirTaxComplianceSubsection
          data={data.birTaxCompliance}
          onChange={(birTaxCompliance) => update({ birTaxCompliance })}
        />
      </CollapsibleSubsection>

      <CollapsibleSubsection title="BIR Compliance Breakdown" defaultOpen={false}>
        <BirComplianceBreakdownSubsection
          data={data.birComplianceBreakdown}
          onChange={(birComplianceBreakdown) => update({ birComplianceBreakdown })}
        />
      </CollapsibleSubsection>

      <CollapsibleSubsection title="DTI Details" defaultOpen={false}>
        <DtiDetailsSubsection
          data={data.dtiDetails}
          onChange={(dtiDetails) => update({ dtiDetails })}
        />
      </CollapsibleSubsection>

      <CollapsibleSubsection title="SEC Details" defaultOpen={false}>
        <SecDetailsSubsection
          data={data.secDetails}
          onChange={(secDetails) => update({ secDetails })}
        />
      </CollapsibleSubsection>

      <CollapsibleSubsection title="SSS Details" defaultOpen={false}>
        <GovernmentAgencySubsection
          data={data.sssDetails}
          onChange={(sssDetails) => update({ sssDetails })}
        />
      </CollapsibleSubsection>

      <CollapsibleSubsection title="PhilHealth Details" defaultOpen={false}>
        <GovernmentAgencySubsection
          data={data.philhealthDetails}
          onChange={(philhealthDetails) => update({ philhealthDetails })}
        />
      </CollapsibleSubsection>

      <CollapsibleSubsection title="HDMF / Pag-IBIG Details" defaultOpen={false}>
        <GovernmentAgencySubsection
          data={data.hdmfDetails}
          onChange={(hdmfDetails) => update({ hdmfDetails })}
        />
      </CollapsibleSubsection>

      <CollapsibleSubsection title="City Hall Details" defaultOpen={false}>
        <CityHallDetailsSubsection
          data={data.cityHallDetails}
          onChange={(cityHallDetails) => update({ cityHallDetails })}
        />
      </CollapsibleSubsection>
    </div>
  );
}
