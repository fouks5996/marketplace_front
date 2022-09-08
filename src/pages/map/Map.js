import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { errorMessageValues } from "../../components/auth/errors";
import MapComponent from "../../components/map_components/MapComponent";
import { API } from "../../utils/variables";

function Map(props) {
	const [mapCenter, setMapCenter] = useState([51.505, -0.09]);
	const [modalVisibility, setModalVisibility] = useState(false);
	const [searchedCity, setSearchedCity] = useState("");
	const [data, setData] = useState();
	const { register, handleSubmit } = useForm();

	const OnSubmit = (input) => {
		setSearchedCity(input.location);
		fetch(
			`https://api.geoapify.com/v1/geocode/search?city=${input.location}&format=json&apiKey=9aa5158850824f25b76a238e1d875cc8`
		)
			.then((response) => response.json())
			.then((data) => {
				setMapCenter([data.results[0].lat, data.results[0].lon]);
				setModalVisibility(true);
			})
			.catch((err) => console.error(err));
	};

	useEffect(() => {
		fetch(API + "articles")
			.then((response) => {
				return response.json();
			})
			.then((res) => {
				setData(removeDuplicatedCity(res))
			});
	}, [setData, mapCenter]);

	const removeDuplicatedCity = (res) => {
		return [
			...new Set(
				res.map((article) => {
					return article.city;
				})
			),
		];
	}

	return (
		<div className=''>
			<h1 className='text-center my-6 font-bold text-3xl'>
				Chercher les biens par ville :
			</h1>

			<form
				className={` flex flex-col gap-3 mt-2 mx-40 items-center`}
				onSubmit={handleSubmit(OnSubmit)}>
				<div className='flex flex-col'>
					<select
						className='border border-black py-2 px-4 rounded-md'
						{...register("location", errorMessageValues.location)}>
						<option> Choisir une ville 🏘 </option>
						{data &&
							data.map((article) => (
								<option value={article}>{article}</option>
							))}
					</select>
				</div>

				<button
					className='py-2 px-4 rounded text-white bg-slate-800'
					type='submit'>
					{" "}
					Chercher{" "}
				</button>
			</form>
			<div className='mx-[150px]'>
				{modalVisibility && (
					<div>
						<button onClick={() => setModalVisibility(false)}>Fermer</button>
						<MapComponent mapCenter={mapCenter} input={searchedCity} />
					</div>
				)}
			</div>
		</div>
	);
}

export default Map;
