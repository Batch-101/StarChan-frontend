{/* Remplace la liste de mots interdits par des étoiles */ }
function forbiddenWords(message) {
    const pattern = /\b(pute|pouffe|pouf|poufiasse|pouffy|poufyase|pouffyase|connard|connasse|cul|enculé|ntm|nique|enfoiré|pédé|pd|salot|mbdtc|fuck|fucker|facka|bitch|biatch|motherfucker|fum|asshole|fucking|filsdepute|fils de pute|fils de puterie|fdp|bite|fuckoff|fuq|fuqa|boche|chicano|enculeur|femmelette|gogol|goudou|gouine|lope|lopette|nabot|nègre|négresse|négrillon|pédé|pouffiasse|romano|schleu|sidaïque|tafiole|tantouse|tantouze|tarlouse|tarlouze|travelo|chicana|enculé|grognasse|salope|enculeuse|enculer)\b/ig;
    const newMessage = message.replace(pattern, '*****');
    return newMessage;
}

module.exports = forbiddenWords;