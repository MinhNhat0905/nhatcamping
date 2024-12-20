import React from "react";
import { Form } from "react-bootstrap";
import { setField } from "../../common/helper";

export const CheckboxBase = (props) => {
  const isChecked = props.form[props.key_name]?.includes(props.value);

  const handleChange = (event) => {
    const { checked } = event.target;
    let updatedValues = [...props.form[props.key_name]]; // Sao chép mảng cũ của facilities
  
    if (checked) {
      updatedValues.push(props.value); // Thêm vào mảng nếu checkbox được chọn
    } else {
      updatedValues = updatedValues.filter((val) => val !== props.value); // Loại bỏ nếu bỏ chọn
    }
  
    // Cập nhật state form với mảng facilities đã thay đổi
    setField(props.form, props.key_name, updatedValues, props.setForm);
  };

  return (
    <Form.Check
      type="checkbox"
      label={props.label}  // Chỉ hiển thị nhãn trong Form.Check
      name={props.name}
      value={props.value}
      checked={isChecked}
      onChange={handleChange}
    />
  );
};

