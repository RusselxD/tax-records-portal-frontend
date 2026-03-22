import { useState, useMemo } from "react";
import { Plus } from "lucide-react";
import Button from "../../../../../components/common/Button";
import Dropdown from "../../../../../components/common/Dropdown";
import SearchInput from "../../../../../components/common/SearchInput";
import { useUserManagement } from "../context/UserManagementContext";
import UserFormModal from "./UserFormModal";

const roleOptions = [
  { label: "All Roles", value: "" },
  { label: "Manager", value: "Manager" },
  { label: "Onboarding, Offboarding & Support", value: "Onboarding, Offboarding & Support" },
  { label: "Quality, Training & Development", value: "Quality, Training & Development" },
  { label: "Client Service Delivery", value: "Client Service Delivery" },
  { label: "Internal Accounting / Billing", value: "Internal Accounting / Billing" },
];

const statusOptions = [
  { label: "All Statuses", value: "" },
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
    positionFilter,
    positions,
    setSearch,
    setRoleFilter,
    setStatusFilter,
    setPositionFilter,
    addUser,
  } = useUserManagement();

  const positionOptions = useMemo(
    () => [
      { label: "All Positions", value: "" },
      ...positions.map((p) => ({ label: p, value: p })),
    ],
    [positions],
  );

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
            className="min-w-[280px]"
          />
          <Dropdown
            options={positionOptions}
            value={positionFilter}
            onChange={setPositionFilter}
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
        <UserFormModal setModalOpen={setShowAddModal} onSuccess={addUser} />
      )}
    </>
  );
}
