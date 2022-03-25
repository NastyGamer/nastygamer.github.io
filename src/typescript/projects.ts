async function get_github_projects(username: string): Promise<Array<GithubProject>> {
	const response = await window.fetch(`https://api.github.com/users/${username}/repos`);
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const json: Array<any> = await response.json();
	return json.map((jsonObject) => { return new GithubProject(jsonObject); });
}

class GithubProject {

	stars: number;
	forks: number;
	name: string;
	link: string;

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	constructor(jsonObject: any) {
		this.stars = jsonObject["stargazers_count"];
		this.forks = jsonObject["forks_count"];
		this.name = jsonObject["name"];
		this.link = jsonObject["html_url"];
	}
}

get_github_projects("NastyGamer").then((projects) => { 
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	const table: HTMLTableElement = document.getElementById("project_table")!;
	projects.sort((a,b) => (a.stars < b.stars) ? 1 : ((b.stars < a.stars) ? -1 : 0)).forEach((project) => { 
		const row = project_row(table);
		project_cell(row, 0, project.name);
		project_cell(row, 1, project.stars.toString());
		project_cell(row, 2, project.forks.toString());
		project_cell_link(row, 3, project.link);
	});
});

function project_cell(row: HTMLTableRowElement, index: number, content: string): HTMLTableCellElement {
	const cell = row.insertCell(index);
	cell.classList.add("table-hover", "table-dark");
	cell.id = "project_cell";
	cell.innerText = content;
	return cell;
}

function project_cell_link(row: HTMLTableRowElement, index: number, content: string): HTMLTableCellElement {
	const cell = row.insertCell(index);
	cell.classList.add("table-hover", "table-dark");
	cell.id = "project_cell"; 
	const link = document.createElement("a");
	link.innerText = content;
	link.href = content;
	cell.appendChild(link);
	return cell;
}

function project_row(table: HTMLTableElement): HTMLTableRowElement {
	const row = table.insertRow();
	row.classList.add("table-striped", "table-dark");
	return row;
}