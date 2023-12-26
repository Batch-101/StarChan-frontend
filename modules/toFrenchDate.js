const toFrenchDate = (date) => {
    return date.setHours(date.getHours() + 1) // Change les résultats de l'heure en fonction du fuseau horaire CET
}

module.exports = toFrenchDate