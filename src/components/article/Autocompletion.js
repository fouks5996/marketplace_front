import React from 'react';

const Autocompletion = ({res, setCoordinates, setAutocompleteVisible, origin}) => {

    const handleClick = () => {
        const lat = res.lat;
        const lon = res.lon;
        const location = res.formatted;
        let input;
        setCoordinates({
            lat,
            lon,
            location,
            city : res.city
        })
        setAutocompleteVisible(false);

        if (origin === "editForm") {
            input = document.getElementById("autocomplete-edit");
        }

        if (origin === "createForm") {
            input = document.getElementById("autocomplete-create");
        }
        

        input.value = location; 

    }

    return (
        <>
            <p className='border-b border-slate-300 py-1 hover:bg-slate-100 cursor-pointer' onClick={ () => handleClick() }>
										
										{res.formatted}{" "}
            </p>
        </>
    );
};

export default Autocompletion;