import toFrenchDate from './toFrenchDate';

const TimeAgo = (answerDate) => {

    const currentTimestamp = toFrenchDate(new Date());
    const answerTimestamp = Date.parse(answerDate);

    const timeDiffInSeconds = Math.floor((currentTimestamp - answerTimestamp) / 1000);
    if (timeDiffInSeconds < 60) {

        return timeDiffInSeconds == 0 ? `Posté à l'instant ` : `Posté il y a ${timeDiffInSeconds} seconde${timeDiffInSeconds >= 2 ? "s" : ""}`

    } else {

        const minutes = Math.floor(timeDiffInSeconds / 60);
        if (minutes < 60) {

            return `Posté il y a ${minutes} minute${minutes >= 2 ? "s" : ""}`;

        } else {

            const hours = Math.floor(timeDiffInSeconds / 3600);
            if (hours < 24) {
                return `Posté il y a ${hours} heure${hours >= 2 ? "s" : ""}`;

            } else {

                const days = Math.floor(timeDiffInSeconds / (3600 * 24));
                if (days < 365) {
                    return `Posté il y a ${days} jour${days >= 2 ? "s" : ""}`;

                } else {

                    const years = Math.floor(timeDiffInSeconds / (3600 * 24 * 365));
                    return `Posté il y a ${years} an${years >= 2 ? "s" : ""}`;
                }
            }
        }
    }



}

module.exports = TimeAgo

{/* La fonction commence par obtenir la date et l'heure actuelles au format de date français 
    à l'aide de la fonction utilitaire toFrenchDate.
   -  Il analyse ensuite la chaîne de réponse fournie dans un horodatage.
   -  Le décalage horaire est calculé en secondes.
   -  En fonction de l'ampleur du décalage horaire, il formate le résultat sous la 
     forme d'une chaîne indiquant depuis combien de temps la réponse a été publiée en français,
     allant de quelques secondes à plusieurs années. La logique consiste à vérifier différents intervalles de temps
     (secondes, minutes, heures, jours et années). */}