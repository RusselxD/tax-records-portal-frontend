import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../../../contexts/AuthContext";
import { getRolePrefix } from "../../../../../constants/roles";
import { useEditClientProfile } from "../context/EditClientProfileContext";
import BreadcrumbNav from "../../../../../components/common/BreadcrumbNav";

export default function EditClientHeader() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { clientId, header } = useEditClientProfile();
  const prefix = getRolePrefix(user?.roleKey ?? "");
  const clientName = header?.displayName || "Client";

  return (
    <div className="mb-8">
      <BreadcrumbNav
        items={[
          { label: "Client List", onClick: () => navigate(`/${prefix}/clients`) },
          { label: clientName, onClick: () => navigate(`/${prefix}/client-details/${clientId}`) },
          { label: "Edit Profile" },
        ]}
        className="mb-2"
      />

      <h1 className="text-2xl font-bold text-primary">Edit Client Profile</h1>
      <p className="mt-1 text-sm text-gray-500">{clientName}</p>
    </div>
  );
}
