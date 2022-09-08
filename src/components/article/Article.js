import { useAtomValue } from "jotai";
import Cookies from "js-cookie";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { currentuser } from "../atoms/logged";
import { errorMessageValues, errorInput, errorMessage } from "../auth/errors";
import { API } from "../../utils/variables";
import { logged } from "../atoms/logged";
import { Link } from "react-router-dom";
import "./article.scss";
import ArticleTags from "./ArticleTags";
import Autocompletion from "./Autocompletion";

function Article({ article, allowEdit, forceUpdate }) {
	const [editing, setEditing] = useState(false);
	const current_user = useAtomValue(currentuser);
	const token = Cookies.get("token");
	const isLogged = useAtomValue(logged);
	const [autocompleteVisible, setAutocompleteVisible] = useState(false);
	const [autocomplete, setAutocomplete] = useState();
	const [coordinates, setCoordinates] = useState({
		lat: article.lat,
		lon: article.lon,
		city: article.city,
		location: article.location,
	});

	console.log(article);
	console.log(coordinates);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm();

	const deleteArticle = (id) => {
		fetch(`${API}/articles/${id}`, {
			method: "DELETE",
			headers: { Authorization: `Bearer ${token}` },
		}).then((response) => {
			forceUpdate();
		});
	};

	const onSubmit = (data) => {
		fetch(`${API}/articles/${article.id}`, {
			method: "PUT",
			headers: {
				"Content-type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({
				article: {
					title: data.title,
					content: data.content,
					price: data.price,
					other_charges: data.other_charges,
					location: coordinates.location,
					lat: coordinates.lat,
					lon: coordinates.lon,
					city: coordinates.city,
					furnished: data.furnished,
					included_charges: data.included_charges,
					surface: data.surface,
				},
			}),
		})
			.then((response) => {
				forceUpdate();
				setEditing(false);
				return response.json();
			})
			.then((res) => {
				// getCoordinate(data.location, article.id);
			});
	};

	function shortedString(string, length) {
		return string.substr(0, length) + "...";
	}

	function getData(e) {
		if (e.target.value.length > 4) {
			fetch(
				`https://api.geoapify.com/v1/geocode/autocomplete?text=${e.target.value}&format=json&apiKey=9aa5158850824f25b76a238e1d875cc8`
			)
				.then((response) => response.json())
				.then((data) => {
					setAutocompleteVisible(true);
					setAutocomplete(data);
				})
				.catch((err) => console.error(err));
		} else {
			setAutocompleteVisible(false);
		}
	}

	return (
		<>
			{editing && (
				<>
					<div
						id='beforeEl'
						className='flex items-center justify-center h-screen w-screen z-10 fixed top-0 left-0 '>
						<div className='bg-white border shadow-2xl	 border-black opacity-100 absolute top-[50%] left-[50%] pb-10 px-10 rounded-2xl translate-x-[-50%] translate-y-[-50%]'>
							<h1 className='my-6 text-xl font-semibold'> Edition </h1>
							<form
								onSubmit={handleSubmit(onSubmit)}
								className='max-w-[400px] flex flex-col gap-3 '>
								<div className='flex items-center justify-between gap-2'>
									<p> Titre </p>
									<input
										defaultValue={article.title}
										className={`border h-10 pl-3 ml-10  rounded-md  ${errorInput(
											errors.titre
										)}`}
										type='text'
										{...register("title", errorMessageValues.titre)}
									/>
									{errorMessage(errors.titre)}
								</div>
								<div className='flex items-center justify-between gap-2'>
									<p> Content </p>
									<input
										defaultValue={article.content}
										className={`border h-16 pl-3 rounded-md  ${errorInput(
											errors.content
										)}`}
										type='text'
										{...register("content", errorMessageValues.content)}
									/>
									{errorMessage(errors.content)}
								</div>
								<div className='flex items-center justify-between gap-2'>
									<p> Price </p>
									<input
										defaultValue={article.price}
										className={`border h-10 pl-3 rounded-md  ${errorInput(
											errors.price
										)}`}
										type='number'
										{...register("price", errorMessageValues.price)}
									/>
									{errorMessage(errors.price)}
								</div>
								<div className='flex flex-col'>
									<p> Autres charges </p>
									<input
										defaultValue={article.other_charges}
										className={`border h-10 pl-3 rounded-md  ${errorInput(
											errors.otherCharges
										)}`}
										type='number'
										{...register(
											"other_charges",
											errorMessageValues.otherCharges
										)}
									/>
									{errorMessage(errors.price)}
								</div>
								<div className='flex items-center justify-between gap-2 relative'>
									<p> Location </p>
									<input
										className={`border h-10 pl-3 rounded-md  ${errorInput(
											errors.location
										)}`}
										onChange={getData}
										type='text'
										id='autocomplete-edit'
										defaultValue={article.location}
										// {...register("location", errorMessageValues.location)}
									/>
									{autocompleteVisible && (
										<div className='border border-slate-500 rounded-xl p-3 absolute top-20 z-10 bg-white'>
											{" "}
											{autocomplete &&
												autocomplete.results.map((res) => (
													<Autocompletion
														res={res}
														setCoordinates={setCoordinates}
														setAutocompleteVisible={setAutocompleteVisible}
														origin={"editForm"}
													/>
												))}{" "}
										</div>
									)}
									{errorMessage(errors.location)}
								</div>
								<div className='flex items-center gap-2'>
									<input
										type='checkbox'
										defaultChecked={article.furnished}
										className={`border h-10 pl-3 rounded-md  ${errorInput(
											errors.furnished
										)}`}
										{...register("furnished", errorMessageValues.furnished)}
									/>
									<p> Meublé </p>
									{errorMessage(errors.furnished)}
								</div>
								<div className='flex items-center gap-2'>
									<input
										type='checkbox'
										defaultChecked={article.included_charges}
										className={`border h-10 pl-3 rounded-md  ${errorInput(
											errors.includedCharges
										)}`}
										{...register(
											"included_charges",
											errorMessageValues.includedCharges
										)}
									/>
									<p> Charges comprises </p>
									{errorMessage(errors.includedCharges)}
								</div>

								<div className='flex flex-col'>
									<p> Surface </p>
									<input
										defaultValue={article.surface}
										className={`border h-10 pl-3 rounded-md  ${errorInput(
											errors.surface
										)}`}
										type='number'
										{...register("surface", errorMessageValues.surface)}
									/>
									{errorMessage(errors.surface)}
								</div>
								<button
									className='py-2 px-4 rounded text-white bg-slate-800 mt-4'
									type='submit'>
									Editer
								</button>
							</form>
						</div>
					</div>
				</>
			)}
			<div className={`border border-black w-fit p-2  rounded-xl relative`}>
				<img
					alt=''
					className=' rounded-lg mb-2 w-full max-h-[190px] max-w-[280px] min-w-[280px]'
					src='https://d1fmx1rbmqrxrr.cloudfront.net/zdnet/i/edit/ne/2017/09/issy_610.jpg'
				/>

				<>
					<Link to={`/show/${article.id}`}>
						<h1 className='text-2xl font-bold max-w-[250px]'>
							{article.title}
						</h1>
					</Link>
					<div className='flex gap-2 my-2'>
						<ArticleTags
							article={article.furnished}
							bgColor='bg-blue-500'
							ifTrue='meublé'
							ifFalse='non-meublé'
						/>
						<ArticleTags
							article={article.included_charges}
							bgColor='bg-red-500'
							ifTrue='cc'
							ifFalse='cnc'
						/>
						<ArticleTags
							article={article.surface}
							bgColor='bg-purple-500'
							ifTrue={`${article.surface} m²`}
						/>
					</div>
					<h1 className='max-w-[250px]'>
						{" "}
						{shortedString(article.content, 70)}
					</h1>
					<span className='font-medium text-lg absolute top-5 left-5 bg-black text-white py-1 px-2 rounded'>
						{article.price}€
					</span>
					<span className='font-medium text-xs absolute top-5 right-5 bg-black text-white py-1 px-2 rounded'>
						autres charges : {article.other_charges}€
					</span>
					{article.location && (
						<p className='max-w-[250px]'>Location : {article.location}</p>
					)}
				</>

				{allowEdit ? (
					current_user.id === article.user_id &&
					isLogged && (
						<div className='flex gap-3 my-2'>
							<p
								className='text-orange-500 cursor-pointer'
								onClick={() => setEditing(true)}>
								Editer
							</p>

							<p
								className='text-red-500 cursor-pointer'
								onClick={() => deleteArticle(article.id)}>
								Supprimer
							</p>
						</div>
					)
				) : (
					<h1 className='underline mt-2'> User : {article.user.email} </h1>
				)}
			</div>
		</>
	);
}

export default Article;
