import { Input, Select, SelectItem } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import label_i18 from "@/lib/label_i18";
import prohibited_edit_values from "@/lib/prohibited_edit_values";
import { colorSet } from "./colorSet";

export const BoolInput = ({ val, label, onChange }) => {
  const [mod, setMod] = useState(val);
  const isProhibited = prohibited_edit_values.includes(label);
  const { action } = useSelector((state) => state.studentProfileActions);

  const defaultSelectedKeys = label_i18[label].selectItems.find(
    (x) => x.key === mod?.toString()
  );

  useEffect(() => {
    if (mod !== val) onChange(mod);
  }, [mod]);

  if (isProhibited) {
    return null;
  }

  return (
    <>
      {action === "view" ? (
        <Input
          readOnly
          className="dark"
          variant="bordered"
          color={colorSet(mod)}
          value={defaultSelectedKeys?.label}
          label={label_i18[label]?.label}
          description={label_i18[label]?.description}
          type="text"
        />
      ) : (
        <Select
          className="dark text-white"
          variant="bordered"
          selectionMode="single"
          color={colorSet(mod)}
          classNames={{
            popoverContent: "dark text-white",
          }}
          description={label_i18[label]?.description}
          value={mod}
          label={label_i18[label]?.label}
          onChange={(e) => {
            setMod(e.target.value);
          }}
          items={label_i18[label]?.selectItems}
          defaultSelectedKeys={[mod?.toString()]}
        >
          {(val) => <SelectItem key={val.key}>{val.label}</SelectItem>}
        </Select>
      )}
    </>
  );
};
