import React from "react";
import { useForm } from "react-hook-form";
import {
	errorMessageValues,
	errorInput,
	errorMessage,
} from "../../components/auth/errors";
import { API } from "../../utils/variables";
import Cookies from "js-cookie";

const FormEdit = ({ userData, forceUpdate }) => {
	const token = Cookies.get("token");
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm();

	const onSubmit = (data) => {
		fetch(API + "update_user", {
			method: "PUT",
			headers: {
				"Content-type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({ user: data }),
		})
			.then((response) => {
				forceUpdate();
				return response.json();
			})
			.then((res) => {
				console.log(res);
			});
	};

	return (
		<form
			className='max-w-[400px] flex flex-col gap-3 mt-10 mb-6'
			onSubmit={handleSubmit(onSubmit)}>
			<div className='flex flex-col'>
				<p> Pseudo </p>
				<input
					className={`border h-10 pl-3 rounded-md  ${errorInput(errors.name)}`}
					type='text'
					{...register("name", errorMessageValues.name)}
					defaultValue={userData.avatar.record.name}
				/>
				{errorMessage(errors.name)}
			</div>
			<div className='flex flex-col'>
				<p> Mail </p>
				<input
					className={`border h-10 pl-3 rounded-md  ${errorInput(errors.email)}`}
					type='text'
					{...register("email", errorMessageValues.email)}
					defaultValue={userData.email}
				/>
				{errorMessage(errors.email)}
			</div>
			<button
				className='py-2 px-4 rounded text-white bg-slate-800'
				type='submit'>
				{" "}
				Submit{" "}
			</button>
		</form>
	);
};

export default FormEdit;
