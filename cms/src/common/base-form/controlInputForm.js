import React from "react";
import { Form } from "react-bootstrap";
import { setField } from "../../services/common";


export const InputBase = ( props ) =>
{


	return (
		<React.Fragment>
			{
				props.label && <Form.Label>{props.label}</Form.Label>
			}
			<Form.Control 
			required={props.required} type={props.type || 'text'} 
			name={ props.name } 
			placeholder={props.placeholder}
			as={props.as}
			style={{lineHeight: 2}}
			rows={props.rows}
			readOnly={props.readOnly || false}
			
				onChange={ event =>
				{
					let value = event && event.target.value.trim() || null;
					if(props.maxLength && value?.length > props.maxLength) {
						value = value.slice(0, props.maxLength)
					}
					setField( props.form, props.key_name, value, props.setForm )
				} }
				value={ props.form[props.key_name] || '' } />
			<Form.Control.Feedback type="invalid">
				{props.error || ''}
			</Form.Control.Feedback>
		</React.Fragment>
	);
};

