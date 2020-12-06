import axios from "axios";
import { IProject } from "./index.d"

class Todoist {
	private baseURL: string;
	private token: any;
	constructor(token: any) {
		this.baseURL = 'https://api.todoist.com/rest/v1'
		this.token = token
	}

	async fetchProjects() {
		try {
			const response = await axios.get(`${this.baseURL}/projects`, {
				headers: {
					Authorization: `Bearer ${this.token}`
				}
			});

			return response.data
		} catch (e) {
			throw {
				message: e.response.data.message || "Something went wrong"
			}
		}
	}

	projectsToString(projects: IProject[]) {
		let message = ``

		for (let i = 0; i < projects.length; i++) {
			message = message + `**${projects[i].name}**\n`;			
		}

		console.log(message.toString())

		return message
	}
}

export default Todoist