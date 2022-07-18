/*
 * Connect to the clean database and add a service account
 */
let db = connect("127.0.0.1:27017/admin");
db.createUser({
  user: "sudothei",
  pwd: "changeme",
  roles: [{ role: "readWriteAnyDatabase", db: "admin" }],
});

/*
 * Add a user admin account
 */
db.createUser({
  user: "admin",
  pwd: passwordPrompt(),
  roles: [
    { role: "userAdminAnyDatabase", db: "admin" },
    { role: "readWriteAnyDatabase", db: "admin" },
  ],
});

/*
 * Connect to the sudothei database to create it
 */
db = db.getSiblingDB("sudothei");

/*
 * Create the schema validators for the collection
 */
const userValidator = {
  $jsonSchema: {
    bsonType: "object",
    additionalProperties: false,
    title: "user",
    properties: {
      _id: {
        bsonType: "objectId",
        description: "Automatically generated ObjectId",
      },
      username: {
        bsonType: "string",
        minLength: 1,
        maxLength: 70,
        description: "Must be a string between 1 and 70 characters, required.",
      },
      password_hash: {
        bsonType: "string",
        minLength: 12,
        maxLength: 255,
        description:
          "Must be a string between 12 and 255 characters, required.",
      },
    },
  },
};

/*
 * Create the collection
 */
db.createCollection("users", { validator: userValidator });
