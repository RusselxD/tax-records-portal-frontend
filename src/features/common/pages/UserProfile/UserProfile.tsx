import { useAuth } from "../../../../contexts/AuthContext";
import { UserRole } from "../../../../constants";
import usePageTitle from "../../../../hooks/usePageTitle";
import PersonalInfoCard from "./components/PersonalInfoCard";
import ChangePasswordCard from "./components/ChangePasswordCard";
import MyClientsCard from "./components/MyClientsCard";

export default function UserProfile() {
  usePageTitle("My Profile");
  const { user } = useAuth();

  const showClientsSection =
    user?.roleKey === UserRole.CSD ||
    user?.roleKey === UserRole.OOS ||
    user?.roleKey === UserRole.QTD;

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-primary">My Profile</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your profile photo and account security.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6 items-start">
        <div className="flex flex-col gap-6">
          <PersonalInfoCard />
          {showClientsSection && <MyClientsCard />}
        </div>
        <ChangePasswordCard />
      </div>
    </div>
  );
}
