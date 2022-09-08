import React, { useState } from "react";
import { useParams } from "react-router-dom";
import useFetch from "../../hooks/useGet";
import Cookies from "js-cookie";
import { API } from "../../utils/variables";
import './ArticleDetails.scss';
import ContactForm from "./ContactForm";

function ArticleDetails() {
	const articleId = useParams().articleId;
	const [contact, setContact] = useState(false)

	

	const [data, loading] = useFetch(
		`${API}/articles/${articleId}`,
		Cookies.get("token")
	);

	console.log(data);
	return (
		<div id="details-container">
			{loading && (
				<>
				<div >
					<img src='https://d1fmx1rbmqrxrr.cloudfront.net/zdnet/i/edit/ne/2017/09/issy_610.jpg' alt="bien immobilier"/>
				</div>

			
					
				<div>
					<h1>
						{data.title} : {data.price}€
					</h1>
					<ul>
						<li>Descripition : {data.content}</li>
						<li>Propriétaire : {data.user.email}</li>
					</ul>

					<button onClick={() => setContact(!contact)} className="bg-slate-800 text-white rounded p-2 px-3 mt-2">Contacter le propriétaire</button>
					{contact &&
					<ContactForm recipient_id={data.user.id}/>
					}
					
					
				</div>
				
				</>
			
				
			)}
		</div>
	);
}

export default ArticleDetails;
