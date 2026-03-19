import { useState } from "react";
import { Plus } from "lucide-react";
import Button from "../../../../../components/common/Button";
import Dropdown from "../../../../../components/common/Dropdown";
import SearchInput from "../../../../../components/common/SearchInput";
import { UserRole } from "../../../../../constants";
import { useUserManagement } from "../context/UserManagementContext";
import AddUserModal from "./AddUserModal";

const roleOptions = [
  { label: "All Roles", value: "" },
  { label: "QTD", value: UserRole.QTD },
  { label: "CSD", value: UserRole.CSD },
  { label: "OOS", value: UserRole.OOS },
  { label: "Billing", value: UserRole.BILLING },
  { label: "Manager", value: UserRole.MANAGER },
];

const statusOptions = [
  { label: "All", value: "" },
  { label: "Pending", value: "PENDING" },
  { label: "Active", value: "ACTIVE" },
  { label: "Deactivated", value: "DEACTIVATED" },
];

export default function UserFilters() {
  const [showAddModal, setShowAddModal] = useState(false);
  const {
    search,
    roleFilter,
    statusFilter,
    setSearch,
    setRoleFilter,
    setStatusFilter,
    addUser,
  } = useUserManagement();

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <SearchInput
            placeholder="Search by name or email..."
            value={search}
            onChange={setSearch}
          />
          <Dropdown
            options={roleOptions}
            value={roleFilter}
            onChange={setRoleFilter}
          />
          <Dropdown
            options={statusOptions}
            value={statusFilter}
            onChange={setStatusFilter}
          />
        </div>
        <Button onClick={() => setShowAddModal(true)}>
          <Plus className="w-4 h-4" />
          Add User
        </Button>
      </div>

      {showAddModal && (
        <AddUserModal setModalOpen={setShowAddModal} onSuccess={addUser} />
      )}
    </>
  );
}
