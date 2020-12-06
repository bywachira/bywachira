export interface IProject {
	name: string;
	color: number;
	id: number;
	order: number;
	comment_count: number;
	shared: boolean;
	favorite: boolean;
	sync_id: number;
}

export interface ITask {
	id: number;
	assigner: number;
	section_id: number;
	order: number;
	content: string;
	completed: boolean;
	labels_id: number[];
	priority: number;
	comment_count: number;
	creator: number;
	created: string;
	url: string;
}