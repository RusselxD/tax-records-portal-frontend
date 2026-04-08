import type { ProfileReviewStatus, ProfileReviewType } from "./client-profile";

// ── Supporting Types ──

export interface DateField {
  date: string | null;
  isImportant: boolean;
  isCritical: boolean;
}

export interface FileReference {
  id: string;
  name: string;
}

export interface LinkReference {
  url: string;
  label: string;
}

export interface RichTextContent {
  type: "doc";
  content?: Record<string, unknown>[];
}

export type OrganizationType =
  | "SOLE_PROPRIETORSHIP"
  | "PROFESSIONAL"
  | "PARTNERSHIP"
  | "OPC"
  | "REGULAR_CORPORATION";

export type TaxpayerClassification = "MICRO" | "SMALL" | "MEDIUM" | "LARGE";

export type BookOfAccountsType = "MANUAL" | "LOOSE_LEAF" | "CAS";

export interface AssignedAccountant {
  id: string;
  displayName: string;
  position: string;
  role: string;
  roleKey: string;
}

export interface PermitDetails {
  number: string | null;
  expirationDate: DateField | null;
}

export interface GrossSalesEntry {
  _uid?: string;
  year: number;
  amount: number | null;
}

export interface RegisteredBookEntry {
  _uid?: string;
  bookName: string | null;
  notes: string | null;
}

export interface PendingActionItem {
  _uid?: string;
  particulars: string | null;
  notes: string | null;
}

// ── Section DTOs ──

// Section 1: Main Details
export interface MainDetails {
  mreCode: string | null;
  commencementOfWork: DateField | null;
  csdOosAccountantIds?: string[] | null;
  qtdAccountantId?: string | null;
}

// Section 2: Client Information (wraps header + 9 sub-sections)
export interface BirBranchDetails {
  _uid?: string;
  businessTradeName: string | null;
  tin: string | null;
  rdo: string | null;
  completeRegisteredAddress: string | null;
  birRegistrationNumber: string | null;
  typeOfBusiness: string | null;
  classification: string | null;
  dateOfBirRegistration: DateField | null;
  birCertificateOfRegistration: FileReference[];
  birForm1901: FileReference[];
  birForm1921Atp: FileReference[];
  birForm1905: FileReference[];
  sampleInvoiceReceipts: FileReference[];
  niriPoster: FileReference[];
  birBookOfAccountsStamp: FileReference[];
  birForm2000Dst: FileReference[];
  contractOfLease: FileReference[];
}

export interface BirTaxComplianceDetails {
  grossSales: GrossSalesEntry[];
  taxpayerClassification: TaxpayerClassification | null;
  topWithholding: boolean | null;
  dateClassifiedTopWithholding: DateField | null;
  incomeTaxRegime: string | null;
}

export interface BirComplianceItem {
  _uid?: string;
  category: string | null;
  taxReturnName: string | null;
  deadline: string | null;
  applicable: boolean;
  notes: string | null;
}

export interface BirComplianceBreakdown {
  items: BirComplianceItem[];
  othersSpecify: string | null;
}

export interface DtiDetails {
  // DTI Registration
  dtiRegistrationNo: string | null;
  dtiDateOfRegistration: DateField | null;
  dtiDateOfExpiration: DateField | null;
  dtiBusinessRegistrationCertificate: FileReference[];
  dtiBnrsUndertakingForm: FileReference[];
  dtiOfficialReceipt: FileReference[];

  // BMBE Compliance
  bmbeTotalAssets: string | null;
  bmbeNo: string | null;
  bmbeDateOfRegistration: DateField | null;
  bmbeDateOfExpiration: DateField | null;
  bmbeOfficialReceipt: FileReference[];

  // Others
  others: string | null;
}

export interface SecDetails {
  dateOfIncorporation: DateField | null;
  secRegistrationNumber: string | null;
  dateOfActualMeetingPerBylaws: DateField | null;
  primaryPurposePerArticles: string | null;
  corporationCategory: string | null;
  secCertificateOfIncorporation: FileReference[];
  articlesOfIncorporation: FileReference[];
  bylawsOfCorporation: FileReference[];
  certificateOfAuthentication: FileReference[];
  authorizeFilerSecretaryCertificate: FileReference[];
  secOfficialReceipts: FileReference[];
  latestGisOrAppointmentOfOfficer: FileReference[];
  stockAndTransferBook: FileReference[];
  boardResolutionsSecretaryCertificate: FileReference[];
  previousYearAfsAndItr: FileReference[];
  others: string | null;
}

export interface GovernmentAgencyDetails {
  dateOfRegistration: DateField | null;
  registrationNumber: string | null;
  certificatesAndDocuments: FileReference[];
  others: string | null;
}

export interface CityHallDetails {
  _uid?: string;
  businessPermitCity: string | null;
  businessPermitNumber: string | null;
  dateOfRegistration: DateField | null;
  renewalBasis: string | null;
  quarterlyDeadlineQ2: DateField | null;
  quarterlyDeadlineQ3: DateField | null;
  quarterlyDeadlineQ4: DateField | null;
  permitExpirationDate: DateField | null;
  firePermit: PermitDetails | null;
  sanitaryPermit: PermitDetails | null;
  otherPermit: PermitDetails | null;
  mayorBusinessPermit: FileReference[];
  businessPermitPlate: FileReference[];
  billingAssessment: FileReference[];
  officialReceiptOfPayment: FileReference[];
  sanitaryPermitFile: FileReference[];
  firePermitFile: FileReference[];
  barangayPermit: FileReference[];
  communityTaxCertificate: FileReference[];
  locationalClearance: FileReference[];
  environmentalClearance: FileReference[];
  comprehensiveGeneralLiabilityInsurance: FileReference[];
}

export interface ClientInformation {
  registeredName: string | null;
  tradeName: string | null;
  numberOfBranches: number;
  organizationType: OrganizationType | null;
  birMainBranch: BirBranchDetails;
  birBranches: BirBranchDetails[];
  birTaxCompliance: BirTaxComplianceDetails;
  birComplianceBreakdown: BirComplianceBreakdown;
  dtiDetails: DtiDetails;
  secDetails: SecDetails;
  sssDetails: GovernmentAgencyDetails;
  philhealthDetails: GovernmentAgencyDetails;
  hdmfDetails: GovernmentAgencyDetails;
  cityHallDetails: CityHallDetails[];
}

// Section 3: Corporate Officer Information
export interface CorporateOfficerDetails {
  _uid?: string;
  name: string | null;
  birthday: DateField | null;
  address: string | null;
  position: string | null;
  idScannedWith3Signature: FileReference | null;
}

export interface PointOfContactDetails {
  contactPerson: string | null;
  contactNumber: string | null;
  deliveryAddress: string | null;
  landmarkPinLocation: string | null;
  emailAddress: string | null;
  preferredMethodOfCommunication: string | null;
  alternativeContact: string | null;
}

export interface CorporateOfficerInformation {
  officers: CorporateOfficerDetails[];
  pointOfContact: PointOfContactDetails;
}

// Section 4: Access & Credentials
export interface AccessCredentialDetails {
  _uid?: string;
  platform: string | null;
  linkToPlatform: LinkReference | null;
  usernameOrEmail: string | null;
  password: string | null;
  notes: string | null;
}

// Section 5: Scope of Engagement
export interface ScopeOfEngagementDetails {
  // Header
  dateOfEngagementLetter: DateField | null;
  engagementLetters: FileReference[];

  // A. Documents & Information Gathering
  salesInvoicesAndDocuments: RichTextContent;
  purchaseAndExpenseDocuments: RichTextContent;
  payrollDocuments: RichTextContent;
  sssPhilhealthHdmfDocuments: RichTextContent;
  businessPermitsLicensesAndOtherDocuments: RichTextContent;
  additionalNotes: RichTextContent;

  // B. Client Engagements
  taxCompliance: RichTextContent;
  bookOfAccounts: BookOfAccountsType | null;
  bookkeepingPermitNo: string | null;
  looseleafCertificateAndBirTemplate: FileReference[];
  registeredBooks: RegisteredBookEntry[];
  bookkeepingProcess: RichTextContent;
  sssPhilhealthHdmfEngagement: RichTextContent;
  paymentAssistance: RichTextContent;
  consultationFreeAllowance: string | null;
  consultationExcessRate: string | null;

  // C. Required Deliverable & Report
  standardDeliverable: RichTextContent;
  requiredDeliverableOthers: string | null;
}

// Section 6: Professional Fees
export interface ProfessionalFeeEntry {
  _uid?: string;
  serviceName: string | null;
  fee: string | null;
}

// Section 7: Onboarding Details
export interface OnboardingDetails {
  nameOfGroupChat: string | null;
  platformUsed: string | null;
  gcCreatedBy: string | null;
  gcCreatedDate: DateField | null;
  pendingActionItems: PendingActionItem[];
}

// ── Master Response ──

export type { ClientStatus as ClientStatusType } from "./client";

// Header sub-types
export interface ClientInfoHeaderAccountants {
  csdOos: AssignedAccountant[];
  qtd: AssignedAccountant[];
}

export interface ClientInfoHeaderTaskReview {
  hasActiveTask: boolean;
  activeTaskId: string | null;
  activeTaskType: ProfileReviewType | null;
  lastReviewStatus: ProfileReviewStatus | null;
}

export interface ClientInfoHeaderOffboarding {
  accountantName: string | null;
  endOfEngagementDate: string | null;
  deactivationDate: string | null;
  taxRecordsProtected: boolean;
  endOfEngagementLetterSent: boolean;
}

// Header-only response (lightweight, fetched on page load)
export interface ClientInfoHeaderResponse {
  displayName: string | null;
  taxpayerClassification: string | null;
  status: import("./client").ClientStatus;
  pocEmail: string | null;
  isProfileApproved: boolean;
  handedOff: boolean;
  accountants: ClientInfoHeaderAccountants;
  taskReview: ClientInfoHeaderTaskReview;
  offboarding: ClientInfoHeaderOffboarding;
}

// Returned by GET /client-info/tasks/{taskId} — header is nested, not flat
export interface ClientInfoTaskResponse {
  clientId: string;
  header: ClientInfoHeaderResponse;
}

// Section data map (for lazy-loaded sections)
export interface ClientInfoSections {
  mainDetails: MainDetails;
  clientInformation: ClientInformation;
  corporateOfficerInformation: CorporateOfficerInformation;
  accessCredentials: AccessCredentialDetails[];
  scopeOfEngagement: ScopeOfEngagementDetails;
  professionalFees: ProfessionalFeeEntry[];
  onboardingDetails: OnboardingDetails;
}

export type InfoSectionKey = keyof ClientInfoSections;

// Full response (used by template endpoint and backward compat)
export interface ClientInfoResponse extends ClientInfoHeaderResponse {
  id: number;
  mainDetails: MainDetails;
  clientInformation: ClientInformation;
  corporateOfficerInformation: CorporateOfficerInformation;
  accessCredentials: AccessCredentialDetails[];
  scopeOfEngagement: ScopeOfEngagementDetails;
  professionalFees: ProfessionalFeeEntry[];
  onboardingDetails: OnboardingDetails;
}

export interface InfoSectionMeta {
  key: InfoSectionKey;
  label: string;
}

export const SECTIONS: InfoSectionMeta[] = [
  { key: "mainDetails", label: "Main Details" },
  { key: "clientInformation", label: "Client Information" },
  { key: "corporateOfficerInformation", label: "Owner's or Corporate Officer's Information" },
  { key: "accessCredentials", label: "Access & Credentials" },
  { key: "scopeOfEngagement", label: "Scope of Engagement" },
  { key: "professionalFees", label: "Professional Fees" },
  { key: "onboardingDetails", label: "Onboarding Details" },
];

export const SECTION_KEYS: InfoSectionKey[] = SECTIONS.map((s) => s.key);
