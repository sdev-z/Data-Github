// JavaScript code to dynamically modify the SVG and add color to countries based on export share

// Data for export percentages
const oliveeExportPercentageSpain = [
    { country: "Italy", spain: { exportShare: 25 } },
    { country: "United States", spain: { exportShare: 20 } },
    { country: "China", spain: { exportShare: 10 } },
    { country: "France", spain: { exportShare: 15 } },
    { country: "United Kingdom", spain: { exportShare: 8 } },
    { country: "Japan", spain: { exportShare: 7 } },
    { country: "Germany", spain: { exportShare: 10 } },
    { country: "Brazil", spain: { exportShare: 5 } }
];

const oliveeExportPercentageItaly = [
    { country: "United States", italy: { exportShare: 30 } },
    { country: "Germany", italy: { exportShare: 18 } },
    { country: "France", italy: { exportShare: 15 } },
    { country: "Japan", italy: { exportShare: 12 } },
    { country: "Canada", italy: { exportShare: 8.5 } },
    { country: "China", italy: { exportShare: 7 } },
    { country: "Australia", italy: { exportShare: 6 } },
    { country: "United Arab Emirates", italy: { exportShare: 4 } }
];

// Map country names to their SVG IDs
const countryIdMap = {
    "Spain": "ES",
    "Italy": "IT",
    "United States": "US",
    "China": "CN",
    "France": "FR",
    "United Kingdom": "GB",
    "Japan": "JP",
    "Germany": "DE",
    "Brazil": "BR",
    "Canada": "CA",
    "Australia": "AU",
    "United Arab Emirates": "AE"
};

// Function to calculate a color based on export share
// Fonction générique pour appliquer les couleurs à la carte SVG
function createDynamicSVGMap(svgUrl, spainData, italyData) {
    const countryIdMap = {
        "Spain": "ES", "Italy": "IT", "United States": "US", "China": "CN",
        "France": "FR", "United Kingdom": "GB", "Japan": "JP", "Germany": "DE",
        "Brazil": "BR", "Canada": "CA", "Australia": "AU", "United Arab Emirates": "AE"
    };

    // Fonction pour calculer une couleur basée sur la part totale d'exportation
    function calculateColor(country) {
        const spainExport = spainData.find(item => item.country === country);
        const italyExport = italyData.find(item => item.country === country);

        let totalExportShare = 0;
        if (spainExport) totalExportShare += spainExport.spain.exportShare;
        if (italyExport) totalExportShare += italyExport.italy.exportShare;

        const maxExportShare = 50; // Ajustez cette valeur si nécessaire
        const ratio = totalExportShare / maxExportShare;

        const minColor = [211, 211, 211]; // Gris clair
        const maxColor = [0, 128, 0]; // Vert foncé

        const r = Math.round(minColor[0] + ratio * (maxColor[0] - minColor[0]));
        const g = Math.round(minColor[1] + ratio * (maxColor[1] - minColor[1]));
        const b = Math.round(minColor[2] + ratio * (maxColor[2] - minColor[2]));

        return `rgb(${r},${g},${b})`;
    }

    // Fonction pour appliquer les couleurs et ajouter les événements de clic
    function applyColors(svgDocument) {
        const allCountries = [...new Set([...spainData, ...italyData].map(item => item.country))];

        allCountries.forEach(country => {
            const countryId = countryIdMap[country];
            if (countryId) {
                const countryElements = svgDocument.querySelectorAll(`#${countryId}, .${countryId}, [name="${country}"]`);
                countryElements.forEach(countryElement => {
                    if (countryElement) {
                        countryElement.style.fill = calculateColor(country);
                        countryElement.addEventListener("click", () => {
                            displayCountryInfo(country);
                        });
                    }
                });
            }
        });
    }

    // Fonction pour afficher les informations d'un pays
    function displayCountryInfo(country) {
        let infoDiv = document.getElementById("country-info");
        if (!infoDiv) {
            infoDiv = document.createElement("div");
            infoDiv.id = "country-info";
            infoDiv.style.cssText = `
                position: fixed;
                bottom: 10px;
                right: 10px;
                padding: 10px;
                background-color: white;
                border: 1px solid #ccc;
                border-radius: 5px;
            `;
            document.body.appendChild(infoDiv);
        }

        let infoContent = `<strong>Pays :</strong> ${country}<br>`;

        const spainExport = spainData.find(item => item.country === country);
        const italyExport = italyData.find(item => item.country === country);

        if (spainExport) {
            infoContent += `<strong>Exportation d'Espagne :</strong> ${spainExport.spain.exportShare}%<br>`;
        }

        if (italyExport) {
            infoContent += `<strong>Exportation d'Italie :</strong> ${italyExport.italy.exportShare}%<br>`;
        }

        if (!spainExport && !italyExport) {
            infoContent += `Pas de données d'exportation disponibles pour ce pays.`;
        }

        infoDiv.innerHTML = infoContent;
    }

    // Charger le fichier SVG et appliquer les couleurs
    fetch(svgUrl)
        .then(response => response.text())
        .then(svgText => {
            const parser = new DOMParser();
            const svgDocument = parser.parseFromString(svgText, "image/svg+xml").documentElement;
            applyColors(svgDocument);
            document.getElementById("svg-container").appendChild(svgDocument);
        })
        .catch(error => console.error("Erreur lors du chargement du SVG :", error));
}

// Utilisation de la fonction pour créer des cartes dynamiques
document.addEventListener("DOMContentLoaded", () => {
    createDynamicSVGMap(
        "../img/world_with_ids.svg",
        oliveeExportPercentageSpain,
        oliveeExportPercentageItaly
    );
});
