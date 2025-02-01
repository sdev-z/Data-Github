// Données de consommation d'huile d'olive
const oliveConsumptionData = [
    { year: 2010, greece: 24.0, spain: 13.5, italy: 12.8, portugal: 8.8, usa: 0.9 },
    { year: 2012, greece: 23.7, spain: 12.6, italy: 11.5, portugal: 8.1, usa: 0.9 },
    { year: 2014, greece: 22.3, spain: 11.3, italy: 10.5, portugal: 7.8, usa: 1.0 },
    { year: 2016, greece: 20.8, spain: 10.4, italy: 9.9, portugal: 7.2, usa: 1.1 },
    { year: 2018, greece: 19.5, spain: 10.1, italy: 9.2, portugal: 7.0, usa: 1.2 },
    { year: 2020, greece: 18.7, spain: 9.9, italy: 8.8, portugal: 6.8, usa: 1.3 }
  ];

  // Initialise le sélecteur d'année
  function initYearSelector() {
    const selector = document.getElementById('yearSelector');
    oliveConsumptionData.forEach(data => {
      const option = document.createElement('option');
      option.value = data.year;
      option.textContent = data.year;
      selector.appendChild(option);
    });

    // Lors du changement de sélection, on recrée le graphique
    selector.addEventListener('change', (e) => {
      createConsumptionChart(e.target.value);
    });
  }

  // Crée le graphique en fonction de l'année sélectionnée
  function createConsumptionChart(selectedYear = 'all') {
    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("width", "900");
    svg.setAttribute("height", "800");

    // Création d'un dégradé de fond pour le SVG
    const defs = document.createElementNS(svgNS, "defs");
    const linearGradient = document.createElementNS(svgNS, "linearGradient");
    linearGradient.setAttribute("id", "bgGradient");
    linearGradient.setAttribute("x1", "0%");
    linearGradient.setAttribute("y1", "0%");
    linearGradient.setAttribute("x2", "0%");
    linearGradient.setAttribute("y2", "100%");
    const stop1 = document.createElementNS(svgNS, "stop");
    stop1.setAttribute("offset", "0%");
    stop1.setAttribute("stop-color", "#f0f0f0");
    const stop2 = document.createElementNS(svgNS, "stop");
    stop2.setAttribute("offset", "100%");
    stop2.setAttribute("stop-color", "#e0e0e0");
    linearGradient.appendChild(stop1);
    linearGradient.appendChild(stop2);
    defs.appendChild(linearGradient);
    svg.appendChild(defs);

    // Ajout d'un fond via un rectangle
    const bgRect = document.createElementNS(svgNS, "rect");
    bgRect.setAttribute("width", "100%");
    bgRect.setAttribute("height", "100%");
    bgRect.setAttribute("fill", "url(#bgGradient)");
    svg.appendChild(bgRect);

    // Calcul du maximum de consommation pour calibrer les rayons
    const maxConsumption = Math.max(...oliveConsumptionData.flatMap(d => Object.values(d).slice(1)));
    // Liste des pays (les clés autres que 'year')
    const countries = Object.keys(oliveConsumptionData[0]).filter(key => key !== 'year');

    // Titre du graphique
    const title = document.createElementNS(svgNS, "text");
    title.setAttribute("x", "450");
    title.setAttribute("y", "40");
    title.setAttribute("text-anchor", "middle");
    title.setAttribute("font-size", "24");
    title.setAttribute("font-weight", "bold");
    title.textContent = selectedYear === 'all' 
      ? "Consommation d'huile d'olive par pays (litres/personne/an)" 
      : `Consommation d'huile d'olive en ${selectedYear} (litres/personne/an)`;
    svg.appendChild(title);

    // Filtrer les données en fonction de l'année sélectionnée
    const dataToDisplay = selectedYear === 'all' 
      ? oliveConsumptionData 
      : oliveConsumptionData.filter(d => d.year == selectedYear);

    // Pour chaque enregistrement (chaque année)...
    dataToDisplay.forEach((data, yearIndex) => {
      // Pour chaque pays...
      countries.forEach((country, countryIndex) => {
        const consumption = data[country];
        const radius = (consumption / maxConsumption) * 40;
        const x = 150 + countryIndex * 150;
        // Si "Toutes les années", chaque ligne représente une année
        const y = selectedYear === 'all' ? 100 + yearIndex * 100 : 300;

        // Création du cercle avec un rayon initial à 0 pour l'animation
        const circle = document.createElementNS(svgNS, "circle");
        circle.setAttribute("cx", x);
        circle.setAttribute("cy", y);
        circle.setAttribute("r", "0");
        circle.setAttribute("fill", getCountryColor(country));
        // Stockage des valeurs nécessaires à l'animation
        circle.setAttribute("data-radius", radius);
        const delay = yearIndex * 300 + countryIndex * 100;
        circle.setAttribute("data-delay", delay);
        circle.style.transition = "r 0.5s ease-out, opacity 0.5s";
        circle.style.opacity = "0.8";

        // Ajout d'un tooltip pour afficher le détail au survol
        const tooltip = document.createElementNS(svgNS, "title");
        tooltip.textContent = `${country}: ${consumption}L`;
        circle.appendChild(tooltip);

        svg.appendChild(circle);

        // Ajout d'un label sous le cercle
        const label = document.createElementNS(svgNS, "text");
        label.setAttribute("x", x);
        label.setAttribute("y", y + radius + 20);
        label.setAttribute("text-anchor", "middle");
        label.setAttribute("font-size", "12");
        label.textContent = `${country}: ${consumption}L`;
        svg.appendChild(label);
      });

      // Si l'affichage concerne "Toutes les années", ajouter un label indiquant l'année sur le côté gauche
      if (selectedYear === 'all') {
        const yearLabel = document.createElementNS(svgNS, "text");
        yearLabel.setAttribute("x", "50");
        yearLabel.setAttribute("y", 100 + yearIndex * 100 + 5);
        yearLabel.setAttribute("text-anchor", "middle");
        yearLabel.setAttribute("font-size", "14");
        yearLabel.setAttribute("font-weight", "bold");
        yearLabel.textContent = data.year;
        svg.appendChild(yearLabel);
      }
    });

    // Ajout d'une légende en bas du graphique
    countries.forEach((country, index) => {
      const legendGroup = document.createElementNS(svgNS, "g");
      const x = 150 + index * 150;
      const y = 750;

      const legendCircle = document.createElementNS(svgNS, "circle");
      legendCircle.setAttribute("cx", x);
      legendCircle.setAttribute("cy", y);
      legendCircle.setAttribute("r", "10");
      legendCircle.setAttribute("fill", getCountryColor(country));

      const legendText = document.createElementNS(svgNS, "text");
      legendText.setAttribute("x", x);
      legendText.setAttribute("y", y + 20);
      legendText.setAttribute("text-anchor", "middle");
      legendText.setAttribute("font-size", "12");
      legendText.textContent = country;

      legendGroup.appendChild(legendCircle);
      legendGroup.appendChild(legendText);
      svg.appendChild(legendGroup);
    });

    // Fonction qui lance l'animation des cercles
    const startAnimation = () => {
      const circles = svg.querySelectorAll('circle');
      circles.forEach(circle => {
        // On ne réanime que les cercles qui possèdent un "data-radius"
        if (!circle.hasAttribute('data-radius')) return;
        circle.setAttribute('r', '0');
        const radius = circle.getAttribute('data-radius');
        const delay = parseInt(circle.getAttribute('data-delay'));
        setTimeout(() => circle.setAttribute('r', radius), delay);
      });
    };

    // Démarrer l'animation dès l'affichage
    setTimeout(startAnimation, 0);
    // Autoriser le clic sur le graphique pour relancer l'animation
    svg.addEventListener('click', startAnimation);

    // Remplacer le contenu du conteneur du graphique par le nouveau SVG
    const chartContainer = document.getElementById("consumptionChart");
    chartContainer.innerHTML = '';
    chartContainer.appendChild(svg);
  }

  // Retourne la couleur associée à chaque pays
  function getCountryColor(country) {
    const colors = {
      greece: "#3D9970",
      spain: "#FF4136",
      italy: "#FF851B",
      portugal: "#0074D9",
      usa: "#B10DC9"
    };
    return colors[country] || "#AAAAAA";
  }

  // Initialisation au chargement de la page
  document.addEventListener('DOMContentLoaded', () => {
    initYearSelector();
    createConsumptionChart();
  });