import type { AccessCredentialDetails } from "../../../../../types/client-info";
import { TextDisplay, LinkDisplay } from "../field-displays";

function credentialHasData(entry: AccessCredentialDetails): boolean {
  return !!(
    entry.platform ||
    entry.linkToPlatform?.url ||
    entry.usernameOrEmail ||
    entry.password ||
    entry.notes
  );
}

export default function AccessCredentialsPreview({ data }: { data: AccessCredentialDetails[] }) {
  const filled = data.filter(credentialHasData);
  if (filled.length === 0) return null;

  return (
    <div className="space-y-3">
        {filled.map((entry, i) => (
          <div
            key={i}
            className="rounded-lg border border-gray-200 bg-gray-50/50 p-4"
          >
            <span className="text-sm font-semibold text-primary mb-3 block">
              Credential #{i + 1}
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
              <TextDisplay label="Platform" value={entry.platform} />
              <LinkDisplay label="Link to Platform" value={entry.linkToPlatform} />
              <TextDisplay label="Username / Email" value={entry.usernameOrEmail} />
              <TextDisplay label="Password" value={entry.password} />
              <TextDisplay label="Notes" value={entry.notes} fullWidth />
            </div>
          </div>
        ))}
    </div>
  );
}
