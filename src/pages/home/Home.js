import React, { useEffect, useReducer, useState } from "react";
import { API } from "../../utils/variables";
import Article from "../../components/article/Article";
import hero from "../../assets/images/hero.jpeg";
import { Link } from "react-router-dom";
import "./home.scss";
import { logged } from "../../components/atoms/logged";
import { errorMessageValues } from "../../components/auth/errors";
import { useAtomValue } from "jotai";
import ScrollReveal from "scrollreveal";
import { useForm } from "react-hook-form";
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
  const { register, handleSubmit } = useForm();
  const [price, setPrice] = useState([0, 3000000]);
  const [surface, setSurface] = useState([0, 100000]);
  const [radio, setRadio] = useState("any");

  useEffect(() => {
    fetch(API + "articles")
      .then((response) => {
        return response.json();
      })
      .then((res) => {
        setData(res);
      });
  }, [setData, recucerValue]);

  //   useEffect(() => {
  //     let slideUp = {
  //       distance: "10px",
  //       origin: "bottom",
  //       opacity: 1,
  //       duration: 300,
  //       reset: true,
  //       easing: "ease-in-out",
  //     };
  //     ScrollReveal().reveal(".reveal", slideUp);
  //   }, []);

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
    <div className="home">
      <div className="hero-container">
        <div className="img-container">
          <img src={hero} alt="" />
          <h1>Bienvenue sur notre MarketPlace</h1>
          <div className="btn-container">
            <Link to={isLogged ? "/user" : "/login"}>
              <button>Acheter des biens</button>
            </Link>
            <Link to={isLogged ? "/user" : "/login"}>
              <button>Vendre des biens</button>
            </Link>
          </div>
        </div>
      </div>

      <div className="price">
        <h1>Prix</h1>

        <Box sx={{ width: 500, padding: "20px" }}>
          <Slider
            getAriaLabel={() => "Temperature range"}
            value={price}
            onChange={handlePrice}
            valueLabelDisplay="auto"
            min={0}
            max={3000000}
          />
        </Box>
      </div>
      <div className="surface">
        <h1>Superficie</h1>

        <Box sx={{ width: 500, padding: "20px" }}>
          <Slider
            getAriaLabel={() => "Temperature range"}
            value={surface}
            onChange={handleSurface}
            valueLabelDisplay="auto"
            min={0}
            max={100000}
          />
        </Box>

        <FormControl>
          <FormLabel id="demo-controlled-radio-buttons-group">Meublé</FormLabel>
          <RadioGroup
            aria-labelledby="demo-controlled-radio-buttons-group"
            name="controlled-radio-buttons-group"
            value={radio}
            onChange={handleRadio}
          >
            <FormControlLabel value="true" control={<Radio />} label="Oui" />
            <FormControlLabel value="false" control={<Radio />} label="Non" />
            <FormControlLabel
              value="any"
              control={<Radio />}
              label="any"
            />
          </RadioGroup>
        </FormControl>
      </div>
      <h1 className="text-center font-bold text-2xl my-10 mb-10 reveal">
        {" "}
        Voici les appartements qui peuvent vous intéresser{" "}
      </h1>
      <div className="flex gap-10 flex-wrap mx-24 mt-4">
        {data &&
          data
            .filter(
              (article) =>
                (article.price > price[0] &&
                article.price < price[1] &&
                article.surface > surface[0] &&
                article.surface < surface[1] &&
                article.furnished.toString() === radio) 
					 ||
					 (article.price > price[0] &&
						article.price < price[1] &&
						article.surface > surface[0] &&
						article.surface < surface[1] &&
						radio === "any") 
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
