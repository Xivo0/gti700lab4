const affichageCapteurs = {
  temp: { prefixe: 'temp', titre: 'Température', unite: '°C', couleur: '#b44f27' },
  hum: { prefixe: 'hum', titre: 'Humidité', unite: '%', couleur: '#176ba0' },
  lum: { prefixe: 'hum', titre: 'Luminosité', unite: '', couleur: '#987226' }
};
const graphiquesCapteurs = new Map();
const formatMesure = new Intl.NumberFormat('fr-FR', {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1
});

function majColonne(type, actuelle, moyenne, historique) {
  if (!Object.hasOwn(affichageCapteurs, type)) return;
  const capteur = affichageCapteurs[type];
  const prefixe = capteur.prefixe;
  const afficherNombre = valeur => Number.isFinite(valeur) ? formatMesure.format(valeur) : '—';
  const mesures = Array.isArray(historique) ? historique.slice(-30) : [];

  if (prefixe === 'hum') {
    document.getElementById('hum-titre').textContent = capteur.titre;
    document.querySelectorAll('.hum-unit').forEach(element => {
      element.textContent = capteur.unite;
    });
  }

  document.getElementById(`${prefixe}-actuelle`).textContent = afficherNombre(actuelle);
  document.getElementById(`${prefixe}-moy`).textContent = afficherNombre(moyenne);

  const lignes = document.createDocumentFragment();
  for (const [timestamp, valeur] of mesures) {
    const ligne = document.createElement('tr');
    const date = document.createElement('td');
    const mesure = document.createElement('td');
    // conserver le timestamp fourni : ne pas inventer la date absente du mock.
    date.textContent = String(timestamp);
    mesure.textContent = afficherNombre(valeur);
    ligne.append(date, mesure);
    lignes.append(ligne);
  }
  if (mesures.length === 0) {
    const ligne = document.createElement('tr');
    const cellule = document.createElement('td');
    cellule.colSpan = 2;
    cellule.textContent = 'Aucune mesure disponible';
    ligne.append(cellule);
    lignes.append(ligne);
  }
  document.getElementById(`${prefixe}-tableau`).replaceChildren(lignes);

  const canvas = document.getElementById(`${prefixe}-graph`);
  canvas.setAttribute('aria-label', `Évolution : ${capteur.titre}. Mesures détaillées dans le tableau ci-dessous.`);
  // laisser les tableaux utilisables si le chargement de Chart.js a échoué.
  if (typeof Chart === 'undefined') {
    if (!canvas.parentElement.querySelector('.chart-error')) {
      const message = document.createElement('p');
      message.className = 'chart-error';
      message.textContent = 'Graphique indisponible : Chart.js n’a pas pu être chargé. Consulter le tableau.';
      canvas.parentElement.append(message);
      canvas.hidden = true;
    }
    return;
  }
  canvas.parentElement.querySelector('.chart-error')?.remove();
  canvas.hidden = false;

  let graphique = graphiquesCapteurs.get(prefixe);
  if (!graphique) {
    graphique = new Chart(canvas, {
      type: 'line',
      data: { labels: [], datasets: [{ data: [], pointRadius: 2, tension: 0 }] },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { title: { display: true, text: 'Heure (hh:mm:ss)' }, ticks: { maxTicksLimit: 6, maxRotation: 0 } },
          y: { title: { display: true, text: '' }, beginAtZero: false, grace: '10%' }
        }
      }
    });
    graphiquesCapteurs.set(prefixe, graphique);
  }

  graphique.data.labels = mesures.map(([timestamp]) => {
    const texte = String(timestamp);
    return texte.match(/\b\d{2}:\d{2}:\d{2}\b/)?.[0] ?? texte;
  });
  const serie = graphique.data.datasets[0];
  serie.label = capteur.unite ? `${capteur.titre} (${capteur.unite})` : capteur.titre;
  serie.borderColor = capteur.couleur;
  serie.backgroundColor = capteur.couleur;
  serie.data = mesures.map(([, valeur]) => Number.isFinite(valeur) ? valeur : null);
  graphique.options.scales.y.title.text = type === 'lum'
    ? 'Luminosité'
    : `${capteur.titre} (${capteur.unite})`;
  graphique.update();
}
