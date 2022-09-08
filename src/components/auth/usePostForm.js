import Cookies from "js-cookie";

function usePostForm(url, data, setLogged, current_user, navigate, path) {
	fetch(url, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ user: data }),
	})
		.then((response) => {
			console.log(response);
			Cookies.set(
				"token",
				response.headers.get("Authorization").replace("Bearer ", "")
			);
			return response.json();
		})
		.then((res) => {
			console.log(res);
			if (res !== undefined) {
				current_user(res.user);
				setLogged && setLogged(true);
				navigate && navigate(path);
			}
		})
		.catch((error) => {
			alert("Erreur d'authentification.");
		});
}

export default usePostForm;
