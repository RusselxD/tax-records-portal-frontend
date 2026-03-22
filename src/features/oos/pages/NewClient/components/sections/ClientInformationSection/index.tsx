import { uid } from "../../../../../../../lib/uid";
import { Input, Dropdown } from "../../../../../../../components/common";
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

function SubsectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-sm font-semibold text-primary border-b border-gray-200 pb-2">
      {children}
    </h3>
  );
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
    <div className="space-y-8">
      {/* Header fields */}
      <div>
        <SubsectionHeading>General Information</SubsectionHeading>
        <div className="mt-4 space-y-4">
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
            />
          </div>
        </div>
      </div>

      {/* A. BIR Details */}
      <div>
        <SubsectionHeading>A. BIR Branch Details</SubsectionHeading>
        <div className="mt-4">
          <BirDetailsSubsection
            mainBranch={data.birMainBranch}
            branches={data.birBranches}
            onMainBranchChange={(birMainBranch) => update({ birMainBranch })}
            onBranchesChange={(birBranches) =>
              update({ birBranches, numberOfBranches: birBranches.length })
            }
          />
        </div>
      </div>

      {/* B. BIR Tax Compliance */}
      <div>
        <SubsectionHeading>B. BIR Tax Compliance</SubsectionHeading>
        <div className="mt-4">
          <BirTaxComplianceSubsection
            data={data.birTaxCompliance}
            onChange={(birTaxCompliance) => update({ birTaxCompliance })}
          />
        </div>
      </div>

      {/* C. BIR Compliance Breakdown */}
      <div>
        <SubsectionHeading>C. BIR Compliance Breakdown</SubsectionHeading>
        <div className="mt-4">
          <BirComplianceBreakdownSubsection
            data={data.birComplianceBreakdown}
            onChange={(birComplianceBreakdown) => update({ birComplianceBreakdown })}
          />
        </div>
      </div>

      {/* D. DTI Details */}
      <div>
        <SubsectionHeading>D. DTI Details</SubsectionHeading>
        <div className="mt-4">
          <DtiDetailsSubsection
            data={data.dtiDetails}
            onChange={(dtiDetails) => update({ dtiDetails })}
          />
        </div>
      </div>

      {/* E. SEC Details */}
      <div>
        <SubsectionHeading>E. SEC Details</SubsectionHeading>
        <div className="mt-4">
          <SecDetailsSubsection
            data={data.secDetails}
            onChange={(secDetails) => update({ secDetails })}
          />
        </div>
      </div>

      {/* F. SSS Details */}
      <div>
        <SubsectionHeading>F. SSS Details</SubsectionHeading>
        <div className="mt-4">
          <GovernmentAgencySubsection
            data={data.sssDetails}
            onChange={(sssDetails) => update({ sssDetails })}
          />
        </div>
      </div>

      {/* G. PhilHealth Details */}
      <div>
        <SubsectionHeading>G. PhilHealth Details</SubsectionHeading>
        <div className="mt-4">
          <GovernmentAgencySubsection
            data={data.philhealthDetails}
            onChange={(philhealthDetails) => update({ philhealthDetails })}
          />
        </div>
      </div>

      {/* H. HDMF / Pag-IBIG Details */}
      <div>
        <SubsectionHeading>H. HDMF / Pag-IBIG Details</SubsectionHeading>
        <div className="mt-4">
          <GovernmentAgencySubsection
            data={data.hdmfDetails}
            onChange={(hdmfDetails) => update({ hdmfDetails })}
          />
        </div>
      </div>

      {/* I. City Hall Details */}
      <div>
        <SubsectionHeading>I. City Hall Details</SubsectionHeading>
        <div className="mt-4">
          <CityHallDetailsSubsection
            data={data.cityHallDetails}
            onChange={(cityHallDetails) => update({ cityHallDetails })}
          />
        </div>
      </div>
    </div>
  );
}
