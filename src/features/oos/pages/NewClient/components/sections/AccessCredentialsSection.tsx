import { Plus, Trash2 } from "lucide-react";
import { Input, Button } from "../../../../../../components/common";
import type { AccessCredentialDetails } from "../../../../../../types/client-info";

interface AccessCredentialsSectionProps {
  data: AccessCredentialDetails[];
  onChange: (data: AccessCredentialDetails[]) => void;
}

function emptyCredential(): AccessCredentialDetails {
  return {
    platform: null,
    linkToPlatform: null,
    usernameOrEmail: null,
    password: null,
    notes: null,
  };
}

export default function AccessCredentialsSection({
  data,
  onChange,
}: AccessCredentialsSectionProps) {
  const updateItem = (
    index: number,
    fields: Partial<AccessCredentialDetails>,
  ) => {
    const updated = data.map((item, i) =>
      i === index ? { ...item, ...fields } : item,
    );
    onChange(updated);
  };

  const addItem = () => onChange([...data, emptyCredential()]);

  const removeItem = (index: number) =>
    onChange(data.filter((_, i) => i !== index));

  return (
    <div className="space-y-4">
      {data.map((entry, index) => (
        <div
          key={index}
          className="rounded-lg border border-gray-200 bg-gray-50/50 p-4"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-primary">
              Credential #{index + 1}
            </span>
            <button
              type="button"
              onClick={() => removeItem(index)}
              className="rounded-md p-1.5 text-gray-400 hover:bg-red-50 hover:text-status-rejected transition-colors"
              title="Remove credential"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Platform"
                value={entry.platform ?? ""}
                onChange={(e) =>
                  updateItem(index, { platform: e.target.value || null })
                }
                placeholder="e.g. BIR eFPS, eSPARC"
              />
              <Input
                label="Link to Platform"
                value={entry.linkToPlatform?.url ?? ""}
                onChange={(e) =>
                  updateItem(index, {
                    linkToPlatform: e.target.value
                      ? {
                          url: e.target.value,
                          label: entry.linkToPlatform?.label ?? e.target.value,
                        }
                      : null,
                  })
                }
                placeholder="https://..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Username / Email"
                value={entry.usernameOrEmail ?? ""}
                onChange={(e) =>
                  updateItem(index, {
                    usernameOrEmail: e.target.value || null,
                  })
                }
                placeholder="Enter username or email"
              />
              <Input
                label="Password"
                type="password"
                value={entry.password ?? ""}
                onChange={(e) =>
                  updateItem(index, { password: e.target.value || null })
                }
                placeholder="Enter password"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-primary">
                Notes
              </label>
              <textarea
                value={entry.notes ?? ""}
                onChange={(e) =>
                  updateItem(index, { notes: e.target.value || null })
                }
                placeholder="Additional notes..."
                rows={2}
                className="w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm text-primary placeholder-gray-400 transition-colors focus:outline-none focus:ring-1 focus:border-primary/40 focus:ring-primary/20 resize-none"
              />
            </div>
          </div>
        </div>
      ))}

      <Button variant="secondary" onClick={addItem}>
        <Plus className="h-4 w-4 mr-1.5" />
        Add Credential
      </Button>
    </div>
  );
}
