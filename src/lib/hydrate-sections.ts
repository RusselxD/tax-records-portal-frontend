import { hydrateUids } from "./uid";
import type { ClientInfoSections, InfoSectionKey } from "../types/client-info";

/**
 * Stamp `_uid` on every array item in a section so React can use stable keys.
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

    case "clientInformation": {
      const ci = { ...(data as ClientInfoSections["clientInformation"]) };
      ci.birBranches = hydrateUids(ci.birBranches);
      ci.cityHallDetails = hydrateUids(ci.cityHallDetails);
      ci.birTaxCompliance = {
        ...ci.birTaxCompliance,
        grossSales: hydrateUids(ci.birTaxCompliance.grossSales),
      };
      ci.birComplianceBreakdown = {
        ...ci.birComplianceBreakdown,
        items: hydrateUids(ci.birComplianceBreakdown.items),
      };
      return ci as ClientInfoSections[K];
    }

    case "corporateOfficerInformation": {
      const coi = { ...(data as ClientInfoSections["corporateOfficerInformation"]) };
      coi.officers = hydrateUids(coi.officers);
      return coi as ClientInfoSections[K];
    }

    case "scopeOfEngagement": {
      const soe = { ...(data as ClientInfoSections["scopeOfEngagement"]) };
      soe.registeredBooks = hydrateUids(soe.registeredBooks);
      soe.consultationHours = {
        ...soe.consultationHours,
        consultations: hydrateUids(soe.consultationHours.consultations),
      };
      return soe as ClientInfoSections[K];
    }

    case "onboardingDetails": {
      const od = { ...(data as ClientInfoSections["onboardingDetails"]) };
      od.meetings = hydrateUids(od.meetings);
      od.pendingActionItems = hydrateUids(od.pendingActionItems);
      return od as ClientInfoSections[K];
    }

    default:
      return data;
  }
}
