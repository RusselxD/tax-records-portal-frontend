import { hydrateUids } from "./uid";
import type {
  ClientInfoSections,
  InfoSectionKey,
  DateField,
  PermitDetails,
  BirBranchDetails,
  CityHallDetails,
  GovernmentAgencyDetails,
  OtherPermitDetails,
} from "../types/client-info";

// Coerce null/undefined → [] for FileReference[] fields from old API responses
const arr = <T>(v: T[] | null | undefined): T[] => v ?? [];

// Normalize a DateField: ensure all four fields are present and boolean flags are never null
const normalizeDate = (v: DateField | null | undefined): DateField | null => {
  if (!v) return null;
  return {
    date: v.date ?? null,
    isImportant: v.isImportant ?? false,
    isCritical: v.isCritical ?? false,
    notApplicable: v.notApplicable ?? false,
  };
};

const normalizePermit = (p: PermitDetails | null | undefined): PermitDetails | null => {
  if (!p) return null;
  return { ...p, expirationDate: normalizeDate(p.expirationDate) };
};

function normalizeBirBranch(b: BirBranchDetails): BirBranchDetails {
  return {
    ...b,
    dateOfBirRegistration: normalizeDate(b.dateOfBirRegistration),
    birCertificateOfRegistration: arr(b.birCertificateOfRegistration),
    birForm1901: arr(b.birForm1901),
    birForm1921Atp: arr(b.birForm1921Atp),
    birForm1905: arr(b.birForm1905),
    sampleInvoiceReceipts: arr(b.sampleInvoiceReceipts),
    niriPoster: arr(b.niriPoster),
    birBookOfAccountsStamp: arr(b.birBookOfAccountsStamp),
    birForm2000Dst: arr(b.birForm2000Dst),
    contractOfLease: arr(b.contractOfLease),
  };
}

function normalizeCityHall(c: CityHallDetails): CityHallDetails {
  return {
    ...c,
    dateOfRegistration: normalizeDate(c.dateOfRegistration),
    quarterlyDeadlineQ2: normalizeDate(c.quarterlyDeadlineQ2),
    quarterlyDeadlineQ3: normalizeDate(c.quarterlyDeadlineQ3),
    quarterlyDeadlineQ4: normalizeDate(c.quarterlyDeadlineQ4),
    permitExpirationDate: normalizeDate(c.permitExpirationDate),
    firePermit: normalizePermit(c.firePermit),
    sanitaryPermit: normalizePermit(c.sanitaryPermit),
    otherPermit: normalizePermit(c.otherPermit),
    mayorBusinessPermit: arr(c.mayorBusinessPermit),
    businessPermitPlate: arr(c.businessPermitPlate),
    billingAssessment: arr(c.billingAssessment),
    officialReceiptOfPayment: arr(c.officialReceiptOfPayment),
    sanitaryPermitFile: arr(c.sanitaryPermitFile),
    firePermitFile: arr(c.firePermitFile),
    barangayPermit: arr(c.barangayPermit),
    communityTaxCertificate: arr(c.communityTaxCertificate),
    locationalClearance: arr(c.locationalClearance),
    environmentalClearance: arr(c.environmentalClearance),
    comprehensiveGeneralLiabilityInsurance: arr(c.comprehensiveGeneralLiabilityInsurance),
  };
}

function normalizeAgency(a: GovernmentAgencyDetails): GovernmentAgencyDetails {
  return {
    ...a,
    dateOfRegistration: normalizeDate(a.dateOfRegistration),
    certificatesAndDocuments: arr(a.certificatesAndDocuments),
  };
}

function normalizeOtherPermit(p: OtherPermitDetails): OtherPermitDetails {
  return {
    ...p,
    dateOfRegistration: normalizeDate(p.dateOfRegistration),
    dateOfExpiration: normalizeDate(p.dateOfExpiration),
  };
}

/**
 * Stamp `_uid` on every array item in a section so React can use stable keys.
 * Also normalizes: FileReference[] fields from null → [], DateField boolean flags
 * from null → false, and other primitive booleans from null → false.
 * Called once when section data is loaded from the API.
 */
export function hydrateSectionUids<K extends InfoSectionKey>(
  key: K,
  data: ClientInfoSections[K],
): ClientInfoSections[K] {
  switch (key) {
    case "accessCredentials":
    case "professionalFees":
      return hydrateUids(data as unknown as { _uid?: string }[]) as unknown as ClientInfoSections[K];

    case "mainDetails": {
      const md = { ...(data as ClientInfoSections["mainDetails"]) };
      md.commencementOfWork = normalizeDate(md.commencementOfWork);
      return md as ClientInfoSections[K];
    }

    case "clientInformation": {
      const ci = { ...(data as ClientInfoSections["clientInformation"]) };
      ci.birMainBranch = normalizeBirBranch(ci.birMainBranch);
      ci.birBranches = hydrateUids(ci.birBranches).map(normalizeBirBranch);
      ci.birTaxCompliance = {
        ...ci.birTaxCompliance,
        topWithholding: ci.birTaxCompliance.topWithholding ?? false,
        dateClassifiedTopWithholding: normalizeDate(ci.birTaxCompliance.dateClassifiedTopWithholding),
        grossSales: hydrateUids(ci.birTaxCompliance.grossSales),
      };
      ci.birComplianceBreakdown = {
        ...ci.birComplianceBreakdown,
        items: hydrateUids(ci.birComplianceBreakdown.items).map((item) => ({
          ...item,
          applicable: item.applicable ?? false,
        })),
      };
      ci.dtiDetails = {
        ...ci.dtiDetails,
        dtiDateOfRegistration: normalizeDate(ci.dtiDetails.dtiDateOfRegistration),
        dtiDateOfExpiration: normalizeDate(ci.dtiDetails.dtiDateOfExpiration),
        bmbeDateOfRegistration: normalizeDate(ci.dtiDetails.bmbeDateOfRegistration),
        bmbeDateOfExpiration: normalizeDate(ci.dtiDetails.bmbeDateOfExpiration),
        dtiBusinessRegistrationCertificate: arr(ci.dtiDetails.dtiBusinessRegistrationCertificate),
        dtiBnrsUndertakingForm: arr(ci.dtiDetails.dtiBnrsUndertakingForm),
        dtiOfficialReceipt: arr(ci.dtiDetails.dtiOfficialReceipt),
        bmbeOfficialReceipt: arr(ci.dtiDetails.bmbeOfficialReceipt),
      };
      ci.secDetails = {
        ...ci.secDetails,
        dateOfIncorporation: normalizeDate(ci.secDetails.dateOfIncorporation),
        dateOfActualMeetingPerBylaws: normalizeDate(ci.secDetails.dateOfActualMeetingPerBylaws),
        secCertificateOfIncorporation: arr(ci.secDetails.secCertificateOfIncorporation),
        articlesOfIncorporation: arr(ci.secDetails.articlesOfIncorporation),
        bylawsOfCorporation: arr(ci.secDetails.bylawsOfCorporation),
        certificateOfAuthentication: arr(ci.secDetails.certificateOfAuthentication),
        authorizeFilerSecretaryCertificate: arr(ci.secDetails.authorizeFilerSecretaryCertificate),
        secOfficialReceipts: arr(ci.secDetails.secOfficialReceipts),
        latestGisOrAppointmentOfOfficer: arr(ci.secDetails.latestGisOrAppointmentOfOfficer),
        stockAndTransferBook: arr(ci.secDetails.stockAndTransferBook),
        boardResolutionsSecretaryCertificate: arr(ci.secDetails.boardResolutionsSecretaryCertificate),
        previousYearAfsAndItr: arr(ci.secDetails.previousYearAfsAndItr),
      };
      ci.sssDetails = normalizeAgency(ci.sssDetails);
      ci.philhealthDetails = normalizeAgency(ci.philhealthDetails);
      ci.hdmfDetails = normalizeAgency(ci.hdmfDetails);
      ci.cityHallDetails = hydrateUids(ci.cityHallDetails).map(normalizeCityHall);
      ci.otherPermits = hydrateUids(ci.otherPermits ?? []).map(normalizeOtherPermit);
      return ci as ClientInfoSections[K];
    }

    case "corporateOfficerInformation": {
      const coi = { ...(data as ClientInfoSections["corporateOfficerInformation"]) };
      coi.officers = hydrateUids(coi.officers).map((o) => ({
        ...o,
        birthday: normalizeDate(o.birthday),
      }));
      return coi as ClientInfoSections[K];
    }

    case "scopeOfEngagement": {
      const soe = { ...(data as ClientInfoSections["scopeOfEngagement"]) };
      soe.dateOfEngagementLetter = normalizeDate(soe.dateOfEngagementLetter);
      soe.engagementLetters = arr(soe.engagementLetters);
      soe.looseleafCertificateAndBirTemplate = arr(soe.looseleafCertificateAndBirTemplate);
      soe.registeredBooks = hydrateUids(soe.registeredBooks);
      return soe as ClientInfoSections[K];
    }

    case "onboardingDetails": {
      const od = { ...(data as ClientInfoSections["onboardingDetails"]) };
      od.gcCreatedDate = normalizeDate(od.gcCreatedDate);
      od.pendingActionItems = hydrateUids(od.pendingActionItems);
      return od as ClientInfoSections[K];
    }

    default:
      return data;
  }
}
