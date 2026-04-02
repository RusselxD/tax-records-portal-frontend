import { useState } from "react";
import { Plus } from "lucide-react";
import Button from "../../../../../components/common/Button";
import SearchInput from "../../../../../components/common/SearchInput";
import { useUserManagement } from "../context/UserManagementContext";
import UserFormModal from "./UserFormModal";

export default function UserFilters() {
  const [showAddModal, setShowAddModal] = useState(false);
  const { search, setSearch, addUser } = useUserManagement();

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between">
        <SearchInput
          placeholder="Search by name or email..."
          value={search}
          onChange={setSearch}
          className="w-full sm:w-auto"
        />
        <Button onClick={() => setShowAddModal(true)} className="w-full sm:w-auto shrink-0">
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
