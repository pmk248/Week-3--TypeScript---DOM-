function initializeLocalStorage(): void {
    const existingTeam = localStorage.getItem('fantasyTeam');
    
    if (!existingTeam) {
        const fantasyTeam = {
            "PG": null,
            "SG": null,
            "SF": null,
            "PF": null,
            "C": null
        };
        localStorage.setItem('fantasyTeam', JSON.stringify(fantasyTeam));
    }
}

function addToTeam(player: Player): void {
    let team = JSON.parse(localStorage.getItem('fantasyTeam') || '{}');
    
    team[player.position] = player;
    localStorage.setItem('fantasyTeam', JSON.stringify(team));

    console.log(`Player ${player.name} added to position ${player.position}`);
    
    const card = document.querySelector(`#${player.position.toLowerCase()}-card`);
    if (card) {
        card.innerHTML = `
            <h3>${player.position}</h3>
            <p>${player.name}</p>
            <p>Total Points: ${player.totalPoints}</p>
            <p>Average (Two Pointer): ${player.twoPointer}</p>
            <p>Average (Three Pointer): ${player.threePointer}</p>
            `;
    }
}


class PlayerRow {
    element: HTMLElement;
    playerData: Player;

    constructor(element: HTMLElement, playerData: Player) {
        this.element = element;
        this.playerData = playerData;
        this.renderRows();
    }

    renderRows(): void {
        this.element.innerHTML = `
        <td>${this.playerData.name}</td>
        <td>${this.playerData.position}</td>
        <td>${this.playerData.totalPoints}</td>
        <td>${this.playerData.twoPointer}%</td>
        <td>${this.playerData.threePointer}%</td>
        <td><button class="add-to-team">Add ${this.playerData.name} to your team?</button></td>
        `;
        this.addEventListeners();
    }

    addEventListeners(): void {
        const addToTeamButton = this.element.querySelector('.add-to-team');
        
        if (addToTeamButton) {
            addToTeamButton.addEventListener('click', () => {
                addToTeam(this.playerData);
            });
        }
    }
}

interface Player {
    name: string,
    position: string,
    totalPoints: number,
    twoPointer: number,
    threePointer: number
};

interface userRequest {
    position: string,
    twoPercent: number,
    threePercent: number,
    points: number
}

const BASE_URL: string = 'https://nbaserver-q21u.onrender.com/api/filter/';

async function returnFiltered(filter: userRequest): Promise<void | Player[]> {
    try {
        const response = await fetch(BASE_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(filter)
        });
        if (!response.ok) {
            throw new Error("Network Issue!");
        }
        let filteredList = await response.json();
        const responseList: Array<Player> = [];
        filteredList.forEach((player: { 
            playerName: string; position: string; points: number; twoPercent: number; threePercent: number; 
            }) => {
            let newPlayer: Player = {
                name: player.playerName,
                position: player.position,
                totalPoints: player.points,
                twoPointer: player.twoPercent,
                threePointer: player.threePercent
            }
            responseList.push(newPlayer);
        });
        renderRows(responseList);
    } catch (error) {
        throw error;
    }
};

function renderRows(arr: Array<Player>): void {
    const tBody = document.querySelector('tbody'); 
    if (tBody){
        arr.forEach(player => {
            const rowElement = document.createElement('tr') as HTMLTableRowElement;
            new PlayerRow(rowElement, player);
            tBody.appendChild(rowElement);
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initializeLocalStorage();
    const filterForm = document.getElementById('filter-form') as HTMLFormElement;
    const sliderTotal = document.getElementById("total-range") as HTMLInputElement;
    const outputTotal = document.getElementById("total-value") as HTMLLabelElement;
    const sliderTwo = document.getElementById("two-range") as HTMLInputElement;
    const outputTwo = document.getElementById("two-value") as HTMLLabelElement;
    const sliderThree = document.getElementById("three-range") as HTMLInputElement;
    const outputThree = document.getElementById("three-value") as HTMLLabelElement;
    console.log(localStorage);
    sliderTotal.addEventListener('input', () => {
        outputTotal.innerText = "";
        outputTotal.innerText = `Total Points: ${sliderTotal.value}`;
    });
    sliderTwo.addEventListener('input', () => {
        outputTwo.innerText = `Two Point Average: ${sliderTwo.value}%`;
    });
    sliderThree.addEventListener('input', () => {
        outputThree.innerText = `Three Point Average: ${sliderThree.value}%`;
    });

    filterForm?.addEventListener('submit', async (event: Event) => {
        event.preventDefault();
        let formData = new FormData(filterForm);
        const newRequest: userRequest = {
            position: formData.get('position') as string,
            twoPercent: Number(sliderTwo.value),
            threePercent: Number(sliderThree.value),
            points: Number(sliderTotal.value)
        };
        console.log(newRequest);
        await returnFiltered(newRequest);
    });
});


