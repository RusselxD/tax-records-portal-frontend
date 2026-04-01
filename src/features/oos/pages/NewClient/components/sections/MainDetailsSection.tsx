import { useState, useEffect } from "react";
import { Input, Dropdown, MultiSelect } from "../../../../../../components/common";
import type {
  MainDetails,
  AssignedAccountant,
} from "../../../../../../types/client-info";
import { usersAPI } from "../../../../../../api/users";
import type { AccountantListItemResponse } from "../../../../../../types/user";
import DateFieldInput from "./DateFieldInput";
import { useNewClient } from "../../context/NewClientContext";

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
  hideAccountants?: boolean;
}

export default function MainDetailsSection({
  data,
  onChange,
  hideAccountants = false,
}: MainDetailsSectionProps) {
  const { updateHeaderAccountants } = useNewClient();

  const update = (fields: Partial<MainDetails>) =>
    onChange({ ...data, ...fields });

  const [csdOosAccountants, setCsdOosAccountants] = useState<
    AccountantListItemResponse[]
  >([]);
  const [qtdAccountants, setQtdAccountants] = useState<
    AccountantListItemResponse[]
  >([]);

  useEffect(() => {
    if (hideAccountants) return;
    let cancelled = false;
    async function fetchCsdOos() {
      try {
        const data = await usersAPI.getAccountants("CSD,OOS");
        if (!cancelled) setCsdOosAccountants(data);
      } catch {}
    }
    async function fetchQtd() {
      try {
        const data = await usersAPI.getAccountants("QTD");
        if (!cancelled) setQtdAccountants(data);
      } catch {}
    }
    fetchCsdOos();
    fetchQtd();
    return () => { cancelled = true; };
  }, [hideAccountants]);

  const csdOosOptions = csdOosAccountants.map((a) => ({
    value: a.id,
    label: a.displayName,
  }));

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
        />
        <DateFieldInput
          label="Commencement of Work"
          value={data.commencementOfWork}
          onChange={(v) => update({ commencementOfWork: v })}
        />
      </div>

      {!hideAccountants && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <MultiSelect
            label="CSD / OOS Accountants"
            options={csdOosOptions}
            value={data.csdOosAccountantIds ?? []}
            onChange={(v) => {
              const ids = v.length ? v : null;
              update({ csdOosAccountantIds: ids });
              updateHeaderAccountants({
                csdOos: resolveAccountants(ids, csdOosAccountants),
              });
            }}
            placeholder="Select accountants"
          />
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
