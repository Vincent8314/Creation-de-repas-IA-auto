let BFP = null;

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

function calculNavy() {
    const taille = parseFloat(document.getElementById('tailleNavy').value);
    const tourCou = parseFloat(document.getElementById('tourCouNavy').value);
    const tourNombril = parseFloat(document.getElementById('tourNombrilNavy').value);
    const genre = document.querySelector('input[name="genreNavy"]:checked').value;
    const tourHanches = parseFloat(document.getElementById('tourHanchesFemmeNavy').value);

    if (!isNaN(taille) && !isNaN(tourCou) && !isNaN(tourNombril)) {
        if (genre === 'homme') {
            BFP = 495 / (1.0324 - 0.19077 * Math.log10(tourNombril - tourCou) + 0.15456 * Math.log10(taille)) - 450;
        } else {
            if (!isNaN(tourHanches)) {
                BFP = 495 / (1.29579 - 0.35004 * Math.log10(tourNombril + tourHanches - tourCou) + 0.22100 * Math.log10(taille)) - 450;
            } else {
                document.getElementById('errorNavy').innerHTML = "Veuillez entrer des valeurs valides pour le tour de hanches.";
                return;
            }
        }
        document.getElementById('errorNavy').innerHTML = "";
        document.getElementById('resultNavy').innerHTML = `Taux de masse grasse selon US Navy : ${BFP.toFixed(2)}%`;
    } else {
        document.getElementById('errorNavy').innerHTML = "Veuillez entrer des valeurs valides.";
    }
}

function calculTDEE() {
    const poids = parseFloat(document.getElementById('poidsTDEE').value);
    const heuresMoyenne = parseFloat(document.getElementById('heuresMoyenne').value);
    const heuresIntense = parseFloat(document.getElementById('heuresIntense').value);
    const travail = document.querySelector('input[name="travail"]:checked').value;
    const sommeil = document.querySelector('input[name="sommeil"]:checked').value;
    const objectif = document.getElementById('objectif').value;
    const niveauActivite = document.getElementById('niveauActivite').value;

    if (!isNaN(poids) && BFP !== null) {
        const FM = (BFP / 100) * poids;
        const LM = poids - FM;
        const MB = 370 + (21.6 * LM);

        const PAL_VALUES = {
            bureau: 1.2,
            debout: 1.4,
            leger: 1.6,
            intense: 1.8
        };

        const SOMMEIL_VALUES = {
            moins6: -0.1,
            '6-8': 0,
            plus8: 0.05
        };

        const TDEE_base = MB * (PAL_VALUES[travail] + SOMMEIL_VALUES[sommeil]);
        const caloriesSportMoyenne = heuresMoyenne * (MB / 3);
        const caloriesSportIntense = heuresIntense * (MB / 2);
        const caloriesSportJour = (caloriesSportMoyenne + caloriesSportIntense) / 7;
        const TDEE_total = TDEE_base + caloriesSportJour;

        let objectifCalories;
        if (objectif === 'deficit15') {
            objectifCalories = TDEE_total * 0.85;
        } else if (objectif === 'deficit25') {
            objectifCalories = TDEE_total * 0.75;
        } else if (objectif === 'deficit40') {
            objectifCalories = TDEE_total * 0.60;
        } else if (objectif === 'prise15') {
            objectifCalories = TDEE_total * 1.15;
        } else if (objectif === 'prise25') {
            objectifCalories = TDEE_total * 1.25;
        } else {
            objectifCalories = TDEE_total;
        }

        document.getElementById('resultTDEE').innerHTML = `
            <p>Métabolisme de base (TDEE) : ${MB.toFixed(2)} calories</p>
            <p>Dépense calorique journalière : ${TDEE_total.toFixed(2)} calories</p>
            <p>Apport calorique en fonction de l'objectif : ${objectifCalories.toFixed(2)} calories</p>
        `;

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

        document.getElementById('resultProteines').innerHTML = `${proteines.toFixed(2)}g`;
        document.getElementById('resultGraisses').innerHTML = `${graisses.toFixed(2)}g`;
        document.getElementById('resultGlucides').innerHTML = `${glucides.toFixed(2)}g`;
    } else {
        alert("Veuillez calculer votre masse grasse avant de déterminer votre dépense énergétique.");
    }
}
