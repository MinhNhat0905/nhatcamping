import React, { useEffect } from "react";
import { Form } from "react-bootstrap";
import { setField } from "../../services/common";


export const SelectBase = ( props ) =>
{

	return (
		<React.Fragment>
			{
				props.label && <Form.Label>{ props.label }</Form.Label>
			}
			<Form.Select size="lg" 
			className=" form-control text-secondary" required
			 onChange={ ( event ) =>
			{
				let value = event && event.target.value && event.target.value.trim() || null;

				setField( props.form, props.key_name, value, props.setForm );
			} }>
				<option className="w-100 text-secondary" value={0}>{ props.placeholder }</option>
				{ props.data && props.data.map( ( item, index ) =>
				{ 
					return (
						<option className="w-100" key={ index } value={ item._id } selected={ item._id === props.form[ props.key_name ] ? true : false }>{ item.name }</option>
					)
				} ) }
			</Form.Select>
			<Form.Control.Feedback type="invalid">
				{ props.error || '' }
			</Form.Control.Feedback>

		</React.Fragment>
	);
};

