import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../../../contexts/AuthContext";
import { getRolePrefix } from "../../../../../constants/roles";
import { useEditClientProfile } from "../context/EditClientProfileContext";

export default function EditClientHeader() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { clientId, header } = useEditClientProfile();
  const prefix = getRolePrefix(user?.roleKey ?? "");
  const clientName = header?.displayName || "Client";

  return (
    <div className="mb-8">
      <div className="flex items-center gap-1.5 text-sm text-gray-400 mb-2">
        <button
          onClick={() => navigate(`/${prefix}/clients`)}
          className="hover:text-accent transition-colors"
        >
          Client List
        </button>
        <ChevronRight className="h-3.5 w-3.5" />
        <button
          onClick={() => navigate(`/${prefix}/client-details/${clientId}`)}
          className="hover:text-accent transition-colors"
        >
          {clientName}
        </button>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-gray-600">Edit Profile</span>
      </div>

      <h1 className="text-2xl font-bold text-primary">Edit Client Profile</h1>
      <p className="mt-1 text-sm text-gray-500">{clientName}</p>
    </div>
  );
}
