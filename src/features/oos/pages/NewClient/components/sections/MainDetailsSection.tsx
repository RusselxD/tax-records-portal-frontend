import { useState, useEffect } from "react";
import { Input, Dropdown } from "../../../../../../components/common";
import type {
  MainDetails,
  AssignedAccountant,
} from "../../../../../../types/client-info";
import { usersAPI } from "../../../../../../api/users";
import type { AccountantListItemResponse } from "../../../../../../types/user";
import DateFieldInput from "./DateFieldInput";
import { useNewClient } from "../../context/NewClientContext";
import useMreCodeValidation from "./useMreCodeValidation";

function resolveAccountants(
  ids: string[] | null,
  list: AccountantListItemResponse[],
): AssignedAccountant[] {
  if (!ids || list.length === 0) return [];
  return ids
    .map((id) => list.find((a) => a.id === id))
    .filter((a): a is AccountantListItemResponse => Boolean(a));
}

interface MainDetailsSectionProps {
  data: MainDetails;
  onChange: (data: MainDetails) => void;
  hideQtdAccountant?: boolean;
}

export default function MainDetailsSection({
  data,
  onChange,
  hideQtdAccountant = false,
}: MainDetailsSectionProps) {
  const { updateHeaderAccountants, clientId, setMreCodeValid } = useNewClient();

  const mreValidation = useMreCodeValidation(data.mreCode, clientId);

  useEffect(() => {
    setMreCodeValid(mreValidation.isValid);
  }, [mreValidation.isValid, setMreCodeValid]);

  useEffect(() => {
    return () => setMreCodeValid(false);
  }, [setMreCodeValid]);

  const update = (fields: Partial<MainDetails>) =>
    onChange({ ...data, ...fields });

  const [qtdAccountants, setQtdAccountants] = useState<
    AccountantListItemResponse[]
  >([]);

  useEffect(() => {
    if (hideQtdAccountant) return;
    let cancelled = false;
    async function fetchQtd() {
      try {
        const data = await usersAPI.getAccountants("QTD");
        if (!cancelled) setQtdAccountants(data);
      } catch {}
    }
    fetchQtd();
    return () => { cancelled = true; };
  }, [hideQtdAccountant]);

  const qtdOptions = qtdAccountants.map((a) => ({
    value: a.id,
    label: a.displayName,
  }));

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="MRE Code"
          value={data.mreCode ?? ""}
          onChange={(e) => update({ mreCode: e.target.value || null })}
          placeholder="Enter MRE code"
          error={mreValidation.error ?? undefined}
        />
        <DateFieldInput
          label="Commencement of Work"
          value={data.commencementOfWork}
          onChange={(v) => update({ commencementOfWork: v })}
        />
      </div>

      {!hideQtdAccountant && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Dropdown
            label="QTD Accountant"
            options={qtdOptions}
            value={data.qtdAccountantId ?? ""}
            onChange={(v) => {
              const id = v || null;
              update({ qtdAccountantId: id });
              updateHeaderAccountants({
                qtd: resolveAccountants(
                  id ? [id] : null,
                  qtdAccountants,
                ),
              });
            }}
            placeholder="Select accountant"
          />
        </div>
      )}
    </div>
  );
}
