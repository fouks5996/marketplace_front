import React from 'react';
import { useForm } from 'react-hook-form';
import {
	errorMessageValues,
	errorInput,
	errorMessage,
} from "../../components/auth/errors";
import { API } from '../../utils/variables';
import Cookies from "js-cookie";
import { currentuser } from "../../components/atoms/logged";
import { useAtomValue, useSetAtom } from 'jotai';
import { useNavigate } from 'react-router-dom';
import { firstchatterAtom } from '../../components/atoms/firstChatter'

function ContactForm({recipient_id}) {
   const token = Cookies.get("token");
   const currentUser = useAtomValue(currentuser);
   const navigate = useNavigate();
   const setChatter = useSetAtom(firstchatterAtom)

   const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm();

   const onSubmit = (data) => {
      fetch(API + "messages", {
         method: "POST",
         headers: {
            "Content-type": "application/json",
            Authorizarion: `Bearer ${token}`,
         },
         body: JSON.stringify({
            message: {
               sender_id: currentUser.id,
               recipient_id,
               content: data.content
            }
         })
      })
      .then((response) => {
         setChatter(recipient_id)
         return response.json()
      })
      .then((res) => {
         navigate("/user/chat")
         console.log(res);
      })
   }

   return (
      <form
			className='max-w-[400px] flex flex-col gap-3 mt-10 mb-6'
         onSubmit={handleSubmit(onSubmit)}
			>
            
			<div className='flex flex-col'>
				<p> Content </p>
				<input
					className={`border h-10 pl-3 rounded-md  ${errorInput(errors.content)}`}
					type='text'
					{...register("content", errorMessageValues.content)}
				/>
				{errorMessage(errors.content)}
			</div>
			<button
				className='py-2 px-4 rounded text-white bg-slate-800'
				type='submit'>
				{" "}
				Submit{" "}
			</button>
		</form>
   );
}

export default ContactForm;