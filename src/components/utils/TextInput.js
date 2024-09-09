import { Input } from "@nextui-org/react";
import { useEffect, useState } from "react";
import label_i18 from "@/lib/label_i18";
import prohibited_edit_values from "@/lib/prohibited_edit_values";
import { useSelector } from "react-redux";

export const TextInput = ({ val, label, onChange }) => {
  const [mod, setMod] = useState(val);
  const isProhibited = prohibited_edit_values.find((val) => val === label);
  const { action } = useSelector((state) => state.studentProfileActions);

  useEffect(() => {
    if (mod !== val) onChange(mod);
  }, [mod]);

  if (isProhibited) {
    return;
  }

  return (
    <Input
      readOnly={!label_i18[label]?.isEditable || action === "view"}
      className="dark"
      variant="bordered"
      color="success"
      description={label_i18[label]?.description}
      aria-controls="controlled"
      value={mod}
      onChange={(e) => {
        setMod(e.target.value);
      }}
      label={label_i18[label]?.label}
      type="text"
    />
  );
};
