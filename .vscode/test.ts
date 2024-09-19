
function pickProperties(player: any): Player {
    return {
      name: player.name,
      position: player.position,
      shootingPercentage: player.shootingPercentage,
      points: player.points
    };
  }
  async function searchPlayers(formData: Record<string, unknown>): Promise<void> {
    const response = await fetch('/api/filter', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });
    const data = await response.json();
    // Use pickProperties to extract necessary fields
    const players: Player[] = data.map(pickProperties);
    displayPlayers(players);
  }

  function addToTeam(player: Player): void {
    let team: Player[] = JSON.parse(localStorage.getItem('fantasyTeam') || '[]');
    team.push(player);
    localStorage.setItem('fantasyTeam', JSON.stringify(team));
  }
  function loadTeam(): void {
    const team: Player[] = JSON.parse(localStorage.getItem('fantasyTeam') || '[]');
    const teamList = document.getElementById('teamList');
    if (teamList) {
      team.forEach((player: Player) => {
        const playerDiv = document.createElement('div');
        playerDiv.innerHTML = `<h3>${player.name}</h3><p>Position: ${player.position}</p>`;
        teamList.appendChild(playerDiv);
      });
    }
  }
  // Call loadTeam() when the page loads
  document.addEventListener('DOMContentLoaded', loadTeam);
  function initializeLocalStorage(): void {
    const existingTeam = localStorage.getItem('fantasyTeam');
    if (!existingTeam) {
      // If no team exists in local storage, create an empty array
      localStorage.setItem('fantasyTeam', JSON.stringify([]));
    }
  }
  document.addEventListener('DOMContentLoaded', () => {
    initializeLocalStorage();
  });