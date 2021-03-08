export default {
    generateUUID: function() {
        // Get now time
        const n = Date.now();
        // Generate random
        const r = Math.random();
        // Stringify now time and generate additional random number
        const s = String(n) + String(~~(r * 9e4) + 1e4);
        // Form UUID and return it
        return `${s.slice(0, 8)}-${s.slice(8, 12)}-4${s.slice(12, 15)}-${
            [8, 9, "a", "b"][~~(r * 3)]
        }${s.slice(15, 18)}-${s.slice(s.length - 12)}`;
    },

    capitalizeFirstLetter: function(text) {
        if(text && text !== '' && text.length >= 1) {
            return text[0].toUpperCase() + text.substr(1).toLowerCase();
        } else {
            return text;
        }
    },
};
