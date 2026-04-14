import { useEffect, useRef, useState } from "react";
import { Camera, Loader2, Pencil, X } from "lucide-react";
import { useAuth } from "../../../../../contexts/AuthContext";
import { UserRole } from "../../../../../constants";
import { usersAPI } from "../../../../../api/users";
import { useToast } from "../../../../../contexts/ToastContext";
import { getAvatarColor } from "../../../../../lib/avatar-colors";
import { getErrorMessage } from "../../../../../lib/api-error";
import { getInitials, resolveAssetUrl } from "../../../../../lib/formatters";
import InfoField from "../../../../../components/common/InfoField";
import Input from "../../../../../components/common/Input";
import Button from "../../../../../components/common/Button";
import TitlesEditor from "../../../../../components/common/TitlesEditor";
import type { MyProfileResponse, UserTitle } from "../../../../../types/user";

interface EditForm {
  firstName: string;
  lastName: string;
  email: string;
  titles: UserTitle[];
}

export default function PersonalInfoCard() {
  const { user, refreshFromToken } = useAuth();
  const { toastSuccess, toastError } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [profile, setProfile] = useState<MyProfileResponse | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState<EditForm>({ firstName: "", lastName: "", email: "", titles: [] });
  const [isUploading, setIsUploading] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await usersAPI.getMe();
        if (!cancelled) setProfile(data);
      } catch {
        // Profile fetch is best-effort — edit button won't show
      }
    })();
    return () => { cancelled = true; };
  }, []);

  if (!user) return null;

  const isClient = user.roleKey === UserRole.CLIENT;
  // Use profile data (from API) when available, fall back to auth context (JWT)
  const displayName = profile?.name ?? user.name;
  const displayEmail = profile?.email ?? user.email;
  const { bg, text } = getAvatarColor(displayName);
  const isBusy = isUploading || isRemoving;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";
    setIsUploading(true);
    try {
      const { accessToken } = await usersAPI.uploadAvatar(file);
      refreshFromToken(accessToken);
      toastSuccess("Profile photo updated.");
    } catch (err) {
      toastError(getErrorMessage(err));
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = async () => {
    setIsRemoving(true);
    try {
      const { accessToken } = await usersAPI.deleteAvatar();
      refreshFromToken(accessToken);
      toastSuccess("Profile photo removed.");
    } catch (err) {
      toastError(getErrorMessage(err));
    } finally {
      setIsRemoving(false);
    }
  };

  const openEdit = () => {
    if (!profile) return;
    setForm({ firstName: profile.firstName, lastName: profile.lastName, email: profile.email, titles: profile.titles ?? [] });
    setIsEditing(true);
  };

  const cancelEdit = () => setIsEditing(false);

  const handleSave = async () => {
    const payload = { ...form, titles: form.titles.filter((t) => t.title.trim()) };
    setIsSaving(true);
    try {
      const res = await usersAPI.updateMe(payload);
      refreshFromToken(res.accessToken);
      setProfile((prev) => prev ? { ...prev, ...payload, name: res.name, email: res.email } : prev);
      setIsEditing(false);
      toastSuccess("Profile updated.");
    } catch (err) {
      toastError(getErrorMessage(err));
    } finally {
      setIsSaving(false);
    }
  };

  const set = (field: keyof Omit<EditForm, "titles">) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-sm font-semibold text-primary">Personal Information</h2>
        {!isEditing && profile && (
          <button
            onClick={openEdit}
            className="flex items-center gap-1.5 text-sm text-accent hover:text-accent-hover transition-colors"
          >
            <Pencil className="w-3.5 h-3.5" />
            Edit
          </button>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-6">
        {/* Avatar */}
        <div className="flex flex-col items-center gap-2 shrink-0">
          <div className="relative group">
            <div className="w-20 h-20 rounded-full overflow-hidden">
              {user.profileUrl ? (
                <img
                  src={resolveAssetUrl(user.profileUrl) ?? user.profileUrl}
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className={`w-full h-full ${bg} flex items-center justify-center`}>
                  <span className={`${text} text-xl font-semibold`}>{getInitials(displayName)}</span>
                </div>
              )}
            </div>
            <button
              onClick={() => !isBusy && fileInputRef.current?.click()}
              disabled={isBusy}
              className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity disabled:cursor-not-allowed"
            >
              {isUploading ? <Loader2 className="w-5 h-5 text-white animate-spin" /> : <Camera className="w-5 h-5 text-white" />}
            </button>
          </div>

          {user.profileUrl && (
            <button
              onClick={handleRemove}
              disabled={isBusy}
              className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
            >
              {isRemoving ? <Loader2 className="w-3 h-3 animate-spin" /> : <X className="w-3 h-3" />}
              Remove
            </button>
          )}

          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input id="firstName" label="First Name" value={form.firstName} onChange={set("firstName")} />
                <Input id="lastName" label="Last Name" value={form.lastName} onChange={set("lastName")} />
              </div>
              <Input id="email" label="Email" type="email" value={form.email} onChange={set("email")} />
              <TitlesEditor titles={form.titles} onChange={(titles) => setForm((prev) => ({ ...prev, titles }))} />

              <div className="flex justify-end gap-2 pt-2">
                <Button variant="secondary" onClick={cancelEdit} disabled={isSaving}>Cancel</Button>
                <Button onClick={handleSave} isLoading={isSaving} disabled={isSaving}>Save Changes</Button>
              </div>
            </div>
          ) : (
            <dl className="grid grid-cols-2 gap-x-6 gap-y-4">
              <InfoField label="Full Name" value={displayName} />
              <InfoField label="Email" value={displayEmail} />
              {!isClient && (
                <>
                  <InfoField label="Position" value={user.position ?? undefined} />
                  <InfoField label="Role" value={user.role} />
                </>
              )}
            </dl>
          )}
        </div>
      </div>

      {!isEditing && !isClient && (
        <p className="mt-6 text-xs text-gray-400">
          Position and role can only be updated by your manager.
        </p>
      )}
    </div>
  );
}
