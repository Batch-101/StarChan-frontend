const FormatWeatherHours = (str) => {

    //str = 12:52:15 AM



    let newHourArr;

    if (str.split(':')[0] < 10) { // Si le nombre des heures est inférieur à 10
        newHourArr = str.slice(0, 4).split(':'); // On tranche 4 éléments à partir de l'index 0 et on le split à partir du caractère ":" donc on aura par exemple [2,32]
        newHourArr[0] = `0${newHourArr[0]}` // On rajoute un 0 devant le chiffre des heures
    } else {
        newHourArr = str.slice(0, 5).split(':'); // On tranche 5 éléments à partir de l'index 0 (car le nombre d'heures à un chiffre en plus)
    }

    if (str.includes("PM")) { // On est l'après-midi
        newHourArr[0] = newHourArr[0] != "12" ? `${Number(newHourArr[0]) + 12}` : "12"; // Si on est à 12 PM on ne change rien, sinon on rajoute 12 à l'heure (car 1:00 PM vaut 13h00 chez nous)
    } else {
        newHourArr[0] = newHourArr[0] != "12" ? newHourArr[0] : `00`; // Si on est à 12 AM, on le transforme à 00 car ça équivaut à minuit chez nous
    }

    return newHourArr.join('h') //On rejoint les éléments du tableau par la lettre h, on aura donc notre heure formatée
}

module.exports = FormatWeatherHours;
