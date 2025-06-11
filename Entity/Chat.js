class Chat {
    constructor(id, songId, user1Id, user2Id, createdAt) {
        this.id = id;
        this.songId = songId;
        this.user1Id = user1Id;
        this.user2Id = user2Id;
        this.createdAt = createdAt;
    }
}
module.exports = Chat;