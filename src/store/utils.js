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

    pushBySchemaId: function(state, schemaId, obj) {
        function findAndPush(data, schemaId) {
            let result = null;

            data.some((e) => {
              console.log(e);
                if (e.schemaId == schemaId) {
                  result = e;
                  e.children.push(obj);
                  return;
                }
                if (!result && e.children) {
                  result = findAndPush(e.children, schemaId);
                }
            });
        }

        findAndPush(state.element.schema, schemaId);
    },
};
