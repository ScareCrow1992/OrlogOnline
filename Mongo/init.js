db = db.getSiblingDB("orlog")

db.createCollection("user");

db.createCollection("games_constant");
db.createCollection("games_liberty");
db.createCollection("games_draft");