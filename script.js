let BFP = null;  // Variable pour stocker le pourcentage de masse grasse

// Masquer ou afficher le champ "tour de hanches" en fonction du genre
document.querySelectorAll('input[name="genreNavy"]').forEach(radio => {
    radio.addEventListener('change', () => {
        const tourHanches = document.getElementById('tourHanchesFemmeNavy');
        const labelHanches = document.getElementById('labelHanches');
        if (radio.value === 'femme') {
            tourHanches.style.display = 'block';
            labelHanches.style.display = 'block';
        } else {
            tourHanches.style.display = 'none';
            labelHanches.style.display = 'none';
        }
    });
});

// Fonction pour calculer le taux de masse grasse avec la formule US Navy
function calculNavy() {
    const taille = parseFloat(document.getElementById('tailleNavy').value);
    const tourCou = parseFloat(document.getElementById('tourCouNavy').value);
    const tourNombril = parseFloat(document.getElementById('tourNombrilNavy').value);
    const genre = document.querySelector('input[name="genreNavy"]:checked').value;
    const tourHanches = parseFloat(document.getElementById('tourHanchesFemmeNavy').value);

    if (!isNaN(taille) && !isNaN(tourCou) && !isNaN(tourNombril)) {
        if (genre === 'homme') {
            BFP = 495 / (1.0324 - 0.19077 * Math.log10(tourNombril - tourCou) + 0.15456 * Math.log10(taille)) - 450;
            document.getElementById('errorNavy').innerHTML = "";
            document.getElementById('resultNavy').innerHTML = `Taux de masse grasse selon US Navy : ${BFP.toFixed(2)}%`;
        } else {
            if (!isNaN(tourHanches)) {
                BFP = 495 / (1.29579 - 0.35004 * Math.log10(tourNombril + tourHanches - tourCou) + 0.22100 * Math.log10(taille)) - 450;
                document.getElementById('errorNavy').innerHTML = "";
                document.getElementById('resultNavy').innerHTML = `Taux de masse grasse selon US Navy : ${BFP.toFixed(2)}%`;
            } else {
                document.getElementById('errorNavy').innerHTML = "Veuillez entrer des valeurs valides pour le tour de hanches.";
                document.getElementById('resultNavy').innerHTML = "";
            }
        }
    } else {
        document.getElementById('errorNavy').innerHTML = "Veuillez entrer des valeurs valides pour la taille, le tour de cou et le tour de taille.";
        document.getElementById('resultNavy').innerHTML = "";
    }
}

// Fonction pour calculer le TDEE en utilisant la masse grasse et la formule Katch-McArdle
function calculTDEE() {
    const poids = parseFloat(document.getElementById('poidsTDEE').value);
    const heuresMoyenne = parseFloat(document.getElementById('heuresMoyenne').value);
    const heuresIntense = parseFloat(document.getElementById('heuresIntense').value);
    const travail = document.querySelector('input[name="travail"]:checked').value;
    const sommeil = document.querySelector('input[name="sommeil"]:checked').value;
    const objectif = document.getElementById('objectif').value;
    const niveauActivite = document.getElementById('niveauActivite').value;

    if (!isNaN(poids) && BFP !== null) {
        // Masse grasse (kg)
        const FM = (BFP / 100) * poids;
        // Masse maigre (kg)
        const LM = poids - FM;
        // Calcul du MB selon Katch-McArdle
        const MB = 370 + (21.6 * LM);

        // Déterminer le PAL en fonction du type de travail
        const PAL_VALUES = {
            bureau: 1.2,
            debout: 1.4,
            leger: 1.6,
            intense: 1.8
        };

        // Coefficients de sommeil (ajustement léger)
        const SOMMEIL_VALUES = {
            moins6: -0.1,
            '6-8': 0,
            plus8: 0.05
        };

        // Calcul du TDEE de base (sans le sport) avec le PAL
        const TDEE_base = MB * (PAL_VALUES[travail] + SOMMEIL_VALUES[sommeil]);

        // Calcul des calories sportives (1/3 du MB pour activité modérée, 1/2 pour intense)
        const caloriesSportMoyenne = heuresMoyenne * (MB / 3);
        const caloriesSportIntense = heuresIntense * (MB / 2);

        // Total des calories liées au sport par jour (en divisant par 7)
        const caloriesSportJour = (caloriesSportMoyenne + caloriesSportIntense) / 7;

        // TDEE total
        const TDEE_total = TDEE_base + caloriesSportJour;

        // Objectif de perte de poids ou autre
        let objectifCalories;
        if (objectif === 'deficit15') {
            objectifCalories = TDEE_total * 0.85;  // 15% de réduction
        } else if (objectif === 'deficit25') {
            objectifCalories = TDEE_total * 0.75;  // 25% de réduction
        } else if (objectif === 'deficit40') {
            objectifCalories = TDEE_total * 0.60;  // 40% de réduction
        } else if (objectif === 'prise15') {
            objectifCalories = TDEE_total * 1.15;  // 15% en plus
        } else if (objectif === 'prise25') {
            objectifCalories = TDEE_total * 1.25;  // 25% en plus
        } else {
            objectifCalories = TDEE_total; // Maintien
        }

        // Affichage des résultats sur trois lignes avec calories en couleur #A6B1E1
        document.getElementById('resultTDEE').innerHTML = `
            <p>Métabolisme de base (TDEE) : <span class="calories-highlight">${MB.toFixed(2)} calories</span></p>
            <p>Dépense calorique journalière : <span class="calories-highlight">${TDEE_total.toFixed(2)} calories</span></p>
            <p>Apport calorique en fonction de l'objectif : <span class="calories-highlight">${objectifCalories.toFixed(2)} calories</span></p>
        `;

        // Calcul des besoins journaliers en macronutriments
        let facteurProteine;
        if (niveauActivite === "nonSportif") {
            facteurProteine = 1.2;
        } else if (niveauActivite === "sportif") {
            facteurProteine = 2;
        } else if (niveauActivite === "amincissement") {
            facteurProteine = 2;
        }

        const proteines = poids * facteurProteine;
        const caloriesProteines = proteines * 4;

        const graisses = (objectifCalories * 0.20) / 9;
        const caloriesGraisses = graisses * 9;

        const glucides = (objectifCalories - caloriesProteines - caloriesGraisses) / 4;

        // Affichage des résultats des macros
        document.getElementById('resultProteines').innerHTML = `${proteines.toFixed(2)}g`;
        document.getElementById('resultGraisses').innerHTML = `${graisses.toFixed(2)}g`;
        document.getElementById('resultGlucides').innerHTML = `${glucides.toFixed(2)}g`;
    } else {
        alert("Veuillez calculer votre masse grasse avant de déterminer votre dépense énergétique.");
    }
}

// Fonction pour générer les repas (Note : Ne jamais exposer de clé API dans le code côté client)
async function genererRepas() {
    // Vérifier si les valeurs nécessaires sont calculées
    const resultProteines = document.getElementById('resultProteines').innerText;
    const resultGraisses = document.getElementById('resultGraisses').innerText;
    const resultGlucides = document.getElementById('resultGlucides').innerText;
    const resultTDEE = document.getElementById('resultTDEE').innerText;
    
    const caloriesMatch = resultTDEE.match(/Apport calorique en fonction de l'objectif :\s*(\d+\.?\d*)\s*calories/);
    const objectifCalories = caloriesMatch ? parseFloat(caloriesMatch[1]) : null;

    if (!objectifCalories || !resultProteines || !resultGraisses || !resultGlucides) {
        alert("Veuillez d'abord calculer votre TDEE et vos macronutriments.");
        return;
    }

    // Extraire les valeurs numériques
    const proteines = parseFloat(resultProteines);
    const graisses = parseFloat(resultGraisses);
    const glucides = parseFloat(resultGlucides);

    if (objectifCalories === null) {
        alert("Impossible d'extraire les calories calculées.");
        return;
    }

    // Obtenir les préférences utilisateur
    const typeRegime = document.querySelector('input[name="typeRegime"]:checked').value;
    const nombreRepas = document.getElementById('nombreRepas').value;

    // Texte pour la requête à l'API
    const prompt = `
        Génère un plan alimentaire pour une journée basé sur ${objectifCalories.toFixed(0)} calories avec ${proteines.toFixed(0)}g de protéines, ${graisses.toFixed(0)}g de graisses, et ${glucides.toFixed(0)}g de glucides. Le plan doit inclure ${nombreRepas} repas. Le régime est ${typeRegime}.
    `;

    // Appel à l'API OpenAI (doit être effectué côté serveur pour des raisons de sécurité)
    try {
        // Vous devez implémenter une requête côté serveur pour appeler l'API OpenAI en toute sécurité.
        // Voici un exemple d'appel côté client, mais cela n'est pas sécurisé et ne fonctionnera pas sans une clé API.

        const response = await fetch('YOUR_BACKEND_ENDPOINT', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt })
        });

        if (!response.ok) {
            throw new Error(`Erreur API : ${response.statusText}`);
        }

        const data = await response.json();
        const repas = data.repas; // Assurez-vous que votre backend renvoie les données au bon format.

        // Afficher les repas de manière formatée
        document.getElementById('resultRepas').innerHTML = `<pre>${repas}</pre>`;
    } catch (error) {
        console.error(error);
        document.getElementById('resultRepas').innerHTML = "Une erreur est survenue lors de la génération des repas.";
    }
}


