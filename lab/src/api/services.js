const GameAPI = {
    games: [
    ],
    all: function () {
        return this.games;
    },
    get: function (id) {
        const isGame = (p) => p.id === id;
        return this.games.find(isGame);
    },
    delete: function (id) {
        const isNotDelGame = (p) => p.id !== id;
        this.games = this.games.filter(isNotDelGame);
        return true;
    },
    add: function (game) {
        if (!game.id) {
            game = {
                ...game,
                id: this.games.reduce((prev, current) => {
                    return prev.id > current.id ? prev : current;
                }, { id: 0 }).id + 1,
                stock: parseInt(game.stock) || 0 // Добавляем поле stock
            };
        }
        this.games = [...this.games, game];
        return game;
    },
    update: function (game) {
        const index = this.games.findIndex(g => g.id === game.id);
        if (index !== -1) {
            this.games[index] = game;
        }
        return game;
    },
};
export default GameAPI;