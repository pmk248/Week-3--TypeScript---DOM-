"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function initializeLocalStorage() {
    const existingTeam = localStorage.getItem('fantasyTeam');
    if (!existingTeam) {
        const fantasyTeam = {
            PG: null,
            SG: null,
            SF: null,
            PF: null,
            C: null
        };
        localStorage.setItem('fantasyTeam', JSON.stringify(fantasyTeam));
    }
}
function addToTeam(player) {
    let team = JSON.parse(localStorage.getItem('fantasyTeam') || '{}');
    team[player.position] = player;
    localStorage.setItem('fantasyTeam', JSON.stringify(team));
    console.log(`Player ${player.name} added to position ${player.position}`);
}
class PlayerRow {
    constructor(element, playerData) {
        this.element = element;
        this.playerData = playerData;
        this.renderRows();
    }
    renderRows() {
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
    addEventListeners() {
        const addToTeamButton = this.element.querySelector('.add-to-team');
        if (addToTeamButton) {
            addToTeamButton.addEventListener('click', () => {
                addToTeam(this.playerData);
            });
        }
    }
}
;
const BASE_URL = 'https://nbaserver-q21u.onrender.com/api/filter/';
function returnFiltered(filter) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch(BASE_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(filter)
            });
            if (!response.ok) {
                throw new Error("Network Issue!");
            }
            let fillteredList = yield response.json();
            const responseList = [];
            fillteredList.forEach((player) => {
                let newPlayer = {
                    name: player.playerName,
                    position: player.position,
                    totalPoints: player.points,
                    twoPointer: player.twoPercent,
                    threePointer: player.threePercent
                };
                responseList.push(newPlayer);
            });
            console.log(responseList);
            renderRows(responseList);
        }
        catch (error) {
            throw error;
        }
    });
}
;
function renderRows(arr) {
    const tBody = document.getElementsByTagName('tbody')[0];
    arr.forEach(player => {
        const rowElement = document.createElement('tr');
        new PlayerRow(rowElement, player);
        tBody.appendChild(rowElement);
    });
}
document.addEventListener('DOMContentLoaded', () => __awaiter(void 0, void 0, void 0, function* () {
    const filterForm = document.getElementById('filter-form');
    const sliderTotal = document.getElementById("total-range");
    const outputTotal = document.getElementById("total-value");
    const sliderTwo = document.getElementById("two-range");
    const outputTwo = document.getElementById("two-value");
    const sliderThree = document.getElementById("three-range");
    const outputThree = document.getElementById("two-value");
    initializeLocalStorage();
    sliderTotal.addEventListener('oninput', () => {
        outputTotal.innerText = sliderTotal.value;
    });
    sliderTwo.addEventListener('oninput', () => {
        outputTwo.innerText = sliderTwo.value;
    });
    sliderThree.addEventListener('oninput', () => {
        outputThree.innerText = sliderThree.value;
    });
    filterForm === null || filterForm === void 0 ? void 0 : filterForm.addEventListener('submit', (event) => {
        event === null || event === void 0 ? void 0 : event.preventDefault();
        if (filterForm) {
            let formData = new FormData(filterForm);
            const newRequest = {
                position: formData.get('position'),
                twoPercent: Number(sliderTwo.value),
                threePercent: Number(sliderThree.value),
                points: Number(sliderTotal.value)
            };
            console.log(newRequest);
            returnFiltered(newRequest);
        }
    });
}));
// let blah: userRequest = {position: "PG", twoPercent: 30, threePercent: 30, points: 10000};
// console.log(typeof blah);
// returnFiltered(blah).then(result => console.log(result)).catch(error => console.error(error));
