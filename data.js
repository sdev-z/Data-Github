const oliveExportPercentageSpain = [
  { country: "Italy", spain: { exportShare: 25 } },
  { country: "United States", spain: { exportShare: 20 } },
  { country: "China", spain: { exportShare: 10 } },
  { country: "France", spain: { exportShare: 15 } },
  { country: "United Kingdom", spain: { exportShare: 8 } },
  { country: "Japan", spain: { exportShare: 7 } },
  { country: "Germany", spain: { exportShare: 10 } },
  { country: "Brazil", spain: { exportShare: 5 } }
];

const oliveExportPercentageItaly = [
  { country: "United States", italy: { exportShare: 30 } },
  { country: "Germany", italy: { exportShare: 18 } },
  { country: "France", italy: { exportShare: 15 } },
  { country: "Japan", italy: { exportShare: 12 } },
  { country: "Canada", italy: { exportShare: 8.5 } },
  { country: "China", italy: { exportShare: 7 } },
  { country: "Australia", italy: { exportShare: 6 } },
  { country: "United Arab Emirates", italy: { exportShare: 4 } }
];

function renderBars(data, containerId, countryKey) {
  const container = document.getElementById(containerId);
  const barContainer = document.createElement('div');
  barContainer.className = 'bar-container';
  
  data.forEach((item, index) => {
    const exportShare = item[countryKey].exportShare;
    const countryName = item.country;

    const barDiv = document.createElement('div');
    barDiv.className = 'bar';

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const barHeight = 250 * (exportShare / 100);
    svg.setAttribute('width', '51');
    svg.setAttribute('height', `${barHeight}`);
    svg.setAttribute('viewBox', `0 0 51 ${barHeight}`);
    svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');

    // Créer le dégradé
    const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
    gradient.setAttribute('id', `gradient-${containerId}-${index}`);
    gradient.setAttribute('x1', '0%');
    gradient.setAttribute('y1', '0%');
    gradient.setAttribute('x2', '0%');
    gradient.setAttribute('y2', '100%');

    const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    stop1.setAttribute('offset', '0%');
    stop1.setAttribute('style', 'stop-color:#3E3630');

    const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    stop2.setAttribute('offset', '100%');
    stop2.setAttribute('style', 'stop-color:#6E6256');

    gradient.appendChild(stop1);
    gradient.appendChild(stop2);
    svg.appendChild(gradient);

    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('width', '51');
    rect.setAttribute('height', '100%');
    rect.setAttribute('fill', `url(#gradient-${containerId}-${index})`);

    svg.appendChild(rect);

    const label = document.createElement('span');
    label.textContent = `${countryName}\n${exportShare}%`;

    barDiv.appendChild(svg);
    barDiv.appendChild(label);
    barContainer.appendChild(barDiv);
  });

  container.appendChild(barContainer);
}

renderBars(oliveExportPercentageSpain, 'spain', 'spain');
renderBars(oliveExportPercentageItaly, 'italy', 'italy');


const prixData = [
    { prix: "3,5 €/L", pays: "Espagne" },
    { prix: "5 €/L", pays: "Italie" }
  ];


const oliveData = [
    { year: "2010", spain: { production: 1500000 }, italy: { production: 1200000 } },
    { year: "2011", spain: { production: 1600000 }, italy: { production: 1100000 } },
    { year: "2012", spain: { production: 1400000 }, italy: { production: 1250000 } },
    { year: "2013", spain: { production: 1450000 }, italy: { production: 1100000 } },
    { year: "2014", spain: { production: 1500000 }, italy: { production: 1150000 } },
    { year: "2015", spain: { production: 1550000 }, italy: { production: 1300000 } }
  ];




  
  function afficherPrix() {
    const prixInfo = document.querySelector('.prix-info');
    prixInfo.innerHTML = prixData.map(item => `
      <p>${item.pays} : ${item.prix}</p>
    `).join('');
  }
  
  // Appeler la fonction après le chargement du DOM
  document.addEventListener('DOMContentLoaded', afficherPrix);
  



  
  function createSVG(data) {
    const container = document.querySelector('#svg-container');
    const svg = document.querySelector('svg');
    svg.innerHTML = ''; // Effacer le contenu existant
    
    const itemsPerRow = 6;
    const itemWidth = 195;
    const itemHeight = 220; // Hauteur d'un élément
    const rows = Math.ceil(data.length / itemsPerRow);
    
    // Calculer la largeur et la hauteur totales nécessaires
    const totalWidth = Math.min(itemsPerRow, data.length) * itemWidth;
    const totalHeight = rows * itemHeight;
    
    // Définir la taille du SVG
    svg.setAttribute('width', totalWidth);
    svg.setAttribute('height', totalHeight);
    
    // Ajuster la taille du conteneur pour s'adapter au SVG
    container.style.width = `${totalWidth}px`;
    container.style.height = `${totalHeight}px`;
    container.style.overflow = 'auto';
  
    const maxProduction = Math.max(...data.flatMap(d => [d.spain.production, d.italy.production]));
  
    function formatNumber(num) {
      return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    }
  
    function createGlass(x, y, year, spainProduction, italyProduction) {
      const glassGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
      glassGroup.setAttribute('transform', `translate(${x}, ${y})`);
      glassGroup.innerHTML = `
        <path d="M1 0V152.518C1.13459 154.679 2.45359 159 6.65284 159C10.8521 159 57.3938 159 80.1398 159C81.2165 158.746 83.2892 157.322 82.9662 153.662C82.6432 150.001 82.8316 49.6954 82.9662 0" stroke="black"/>
        <path d="M89 0V152.518C89.1346 154.679 90.4536 159 94.6528 159C98.8521 159 145.394 159 168.14 159C169.217 158.746 171.289 157.322 170.966 153.662C170.643 150.001 170.832 49.6954 170.966 0" stroke="black"/>
        <rect class="spain-oil oil" x="3" y="152" width="78" height="0" fill="#A6C57C"/>
        <rect class="italy-oil oil" x="91" y="152" width="78" height="0" fill="#CB4D4D"/>
        <path d="M3 0H81V154C81 155.657 79.6569 157 78 157H6C4.34315 157 3 155.657 3 154V0Z" fill="#A6C57C" opacity="0.2"/>
        <path d="M91 0H169V154C169 155.657 167.657 157 166 157H94C92.3431 157 91 155.657 91 154V0Z" fill="#CB4D4D" opacity="0.2"/>
        <text x="86" y="180" text-anchor="middle" fill="black" class="year-label">${year}</text>
        <text x="42" y="195" text-anchor="middle" fill="black" class="quantity-label">${formatNumber(spainProduction)}</text>
        <text x="130" y="195" text-anchor="middle" fill="black" class="quantity-label">${formatNumber(italyProduction)}</text>
      `;
      svg.appendChild(glassGroup);
  
      const spainOil = glassGroup.querySelector('.spain-oil');
      const italyOil = glassGroup.querySelector('.italy-oil');
  
      setTimeout(() => {
        const spainHeight = (spainProduction / maxProduction) * 152;
        const italyHeight = (italyProduction / maxProduction) * 152;
  
        spainOil.setAttribute('height', spainHeight.toString());
        spainOil.setAttribute('y', (152 - spainHeight).toString());
        italyOil.setAttribute('height', italyHeight.toString());
        italyOil.setAttribute('y', (152 - italyHeight).toString());
      }, 100);
    }
  
    data.forEach((d, index) => {
      const row = Math.floor(index / itemsPerRow);
      const col = index % itemsPerRow;
      createGlass(col * itemWidth, row * itemHeight, d.year, d.spain.production, d.italy.production);
    });
  }
  
  // Appel initial
  createSVG(oliveData);
  
  // Exemple d'ajout de données et de mise à jour du SVG
  function addData(year, spainProduction, italyProduction) {
    oliveData.push({ year, spain: { production: spainProduction }, italy: { production: italyProduction } });
    createSVG(oliveData);
  }