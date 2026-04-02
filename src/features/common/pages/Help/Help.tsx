import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useAuth } from "../../../../contexts/AuthContext";
import { UserRole } from "../../../../constants/roles";
import usePageTitle from "../../../../hooks/usePageTitle";
import { csdSections } from "./content/csd";
import { oosSections } from "./content/oos";
import { qtdSections } from "./content/qtd";
import { managerSections } from "./content/manager";
import { billingSections } from "./content/billing";
import type { HelpSection } from "./types";

function getSections(roleKey: string): HelpSection[] {
  switch (roleKey) {
    case UserRole.MANAGER:
      return managerSections;
    case UserRole.OOS:
      return oosSections;
    case UserRole.QTD:
      return qtdSections;
    case UserRole.CSD:
      return csdSections;
    case UserRole.BILLING:
      return billingSections;
    default:
      return [];
  }
}

function SectionAccordion({ section }: { section: HelpSection }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white rounded-lg custom-shadow overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          {section.icon && (
            <div className={`p-2 rounded-lg ${section.iconBg ?? "bg-gray-100"}`}>
              <section.icon
                className={`w-4 h-4 ${section.iconColor ?? "text-gray-600"}`}
              />
            </div>
          )}
          <div>
            <h2 className="text-sm font-semibold text-primary">{section.title}</h2>
            {section.subtitle && (
              <p className="text-xs text-gray-400 mt-0.5">{section.subtitle}</p>
            )}
          </div>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-gray-400 shrink-0 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      {isOpen && (
        <div className="px-6 pb-5 border-t border-gray-100">
          <div className="pt-4 space-y-4">{section.content}</div>
        </div>
      )}
    </div>
  );
}

export default function Help() {
  usePageTitle("Help & Guides");
  const { user } = useAuth();
  const sections = getSections(user?.roleKey ?? "");

  if (sections.length === 0) {
    return (
      <div className="flex items-center justify-center py-20 text-sm text-gray-400">
        No help content available for your role yet.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {sections.map((section) => (
        <SectionAccordion key={section.id} section={section} />
      ))}
    </div>
  );
}
