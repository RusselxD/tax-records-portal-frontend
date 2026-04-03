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
    <div className="max-w-5xl mx-auto">
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
