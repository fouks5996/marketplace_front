import React, { useEffect, useReducer, useState } from "react";
import { API } from "../../utils/variables";
import Article from "../../components/article/Article";
import { Link } from "react-router-dom";
import "./home.scss";
import { logged } from "../../components/atoms/logged";
import { useAtomValue } from "jotai";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";

function Home(props) {
	const [data, setData] = useState();
	const [recucerValue, forceUpdate] = useReducer((x) => x + 1, 0);
	const isLogged = useAtomValue(logged);
	const [radio, setRadio] = useState("indifferent");
	const [price, setPrice] = useState([0, 3000000]);
	const [surface, setSurface] = useState([0, 500]);

	useEffect(() => {
		console.log("API", API);
		fetch(API + "articles")
			.then((response) => {
				return response.json();
			})
			.then((res) => {
				setData(res);
			});
	}, [setData, recucerValue]);

	const handlePrice = (event, newValue) => {
		setPrice(newValue);
	};

	const handleSurface = (event, newValue) => {
		setSurface(newValue);
	};

	const handleRadio = (event) => {
		setRadio(event.target.value);
	};

	return (
		<div className='home'>
			<div className='hero-container'>
				<div className='img-container'>
					<img
						src='https://media.vanityfair.fr/photos/62552e007e811623e1a5c2b2/16:9/w_2560%2Cc_limit/5.%2520Photo%2520by%2520Dronalist.jpeg'
						alt=''
					/>
					<h1>Bienvenue sur notre MarketPlace</h1>
					<div className='btn-container'>
						<Link to={isLogged ? "/user" : "/login"}>
							<button>Acheter des biens</button>
						</Link>
						<Link to={isLogged ? "/user" : "/login"}>
							<button>Vendre des biens</button>
						</Link>
					</div>
				</div>
			</div>

			<div className='flex gap-14 mt-3 ml-8'>
				<div>
					<div className='price'>
						<h1>Prix</h1>

						<Box sx={{ width: 500 }}>
							<Slider
								getAriaLabel={() => "Temperature range"}
								value={price}
								onChange={handlePrice}
								valueLabelDisplay='auto'
								min={0}
								max={3000000}
							/>
						</Box>
					</div>
					<div className='surface'>
						<h1>Superficie</h1>

						<Box sx={{ width: 500 }}>
							<Slider
								getAriaLabel={() => "Temperature range"}
								value={surface}
								onChange={handleSurface}
								valueLabelDisplay='auto'
								min={0}
								max={500}
							/>
						</Box>
					</div>
				</div>

				<FormControl>
					<FormLabel id='demo-controlled-radio-buttons-group'>Meublé</FormLabel>
					<RadioGroup
						aria-labelledby='demo-controlled-radio-buttons-group'
						name='controlled-radio-buttons-group'
						value={radio}
						onChange={handleRadio}>
						<FormControlLabel value='true' control={<Radio />} label='Oui' />
						<FormControlLabel value='false' control={<Radio />} label='Non' />
						<FormControlLabel
							value='indifferent'
							control={<Radio />}
							label='indifferent'
						/>
					</RadioGroup>
				</FormControl>
			</div>

			<h1 className='text-center font-bold text-2xl my-10 mb-10'>
				Voici les appartements qui peuvent vous intéresser
			</h1>
			<div className='flex gap-10 flex-wrap mx-24 mt-4 mb-20'>
				{data &&
					data
						.filter(
							(article) =>
								(article.price > price[0] &&
									article.price < price[1] &&
									article.surface > surface[0] &&
									article.surface < surface[1] &&
									article.furnished.toString() === radio) ||
								(article.price > price[0] &&
									article.price < price[1] &&
									article.surface > surface[0] &&
									article.surface < surface[1] &&
									radio === "indifferent")
						)
						.map((article) => (
							<Article
								key={article.id}
								article={article}
								forceUpdate={forceUpdate}
								allowEdit={false}
							/>
						))}
			</div>
		</div>
	);
}

export default Home;
